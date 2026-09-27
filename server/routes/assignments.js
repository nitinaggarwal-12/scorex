const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const coreRouter = require('./assignmentsCore');
const assignmentRepository = require('../db/assignmentRepository');
const assessmentRepository = require('../db/assessmentRepository');
const userRepository = require('../db/userRepository');
const emailService = require('../services/emailService');
const { requireAuthorOrAdmin, canAccessResource } = require('../middleware/auth');

router.use(requireAuthorOrAdmin);

function normalizedEmail(value) {
  return String(value || '').trim().toLowerCase().slice(0, 320);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function secureTemporaryPassword() {
  // 24+ random bytes plus fixed character classes so it satisfies the production password policy.
  return `Sx-${crypto.randomBytes(18).toString('base64url')}9A`;
}

async function authorCanUseAssessment(user, assessmentId) {
  if (user.role === 'admin') return true;

  const assessment = await assessmentRepository.findById(assessmentId);
  if (!assessment) return false;

  if (canAccessResource(
    user,
    assessment,
    ['userId', 'user_id', 'createdBy', 'created_by', 'ownerId', 'owner_id', 'assignedAuthorId', 'assigned_author_id']
  )) {
    return true;
  }

  const existingAssignment = await assignmentRepository.getAssignmentByAssessmentId(assessmentId);
  return Boolean(existingAssignment && String(existingAssignment.author_id) === String(user.id));
}

// Harden the only workflow that may create participant credentials or attach an existing resource.
router.post('/assign', async (req, res, next) => {
  try {
    const existingAssessmentId = req.body?.assessmentId || null;
    const consumerId = req.body?.consumerId || null;
    const consumerEmail = normalizedEmail(req.body?.consumerEmail);

    if (existingAssessmentId) {
      const assessment = await assessmentRepository.findById(existingAssessmentId);
      if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

      if (!(await authorCanUseAssessment(req.user, existingAssessmentId))) {
        return res.status(403).json({ error: 'You are not authorized to assign this assessment' });
      }
    }

    if (consumerId) {
      const consumer = await userRepository.findById(consumerId);
      if (!consumer || consumer.role !== 'consumer' || !consumer.is_active) {
        return res.status(400).json({ error: 'Active participant account not found' });
      }
    }

    if (consumerEmail) {
      if (!validEmail(consumerEmail)) {
        return res.status(400).json({ error: 'A valid participant email is required' });
      }

      req.body.consumerEmail = consumerEmail;
      let consumer = await userRepository.findByEmail(consumerEmail);

      if (consumer && consumer.role !== 'consumer') {
        return res.status(400).json({ error: 'The target account is not a participant account' });
      }

      // Pre-provision securely so the legacy core can never reach its old Math.random()-based path.
      if (!consumer) {
        const tempPassword = secureTemporaryPassword();
        consumer = await userRepository.createUser({
          email: consumerEmail,
          password: tempPassword,
          role: 'consumer',
          firstName: String(req.body.firstName || '').trim().slice(0, 100),
          lastName: String(req.body.lastName || '').trim().slice(0, 100),
          organization: String(req.body.organizationName || req.body.organization || '').trim().slice(0, 200),
          createdBy: req.user.id
        });

        try {
          await emailService.sendWelcomeConsumerEmail({
            toEmail: consumer.email,
            firstName: consumer.first_name || req.body.firstName || '',
            tempPassword,
            organizationName: req.body.organizationName || req.body.organization || 'Your Organization'
          });
        } catch (emailError) {
          // Do not expose the temporary credential in logs or API responses.
          console.warn('[Assignment] Participant created but welcome email failed:', emailError.message);
        }
      }
    }

    return next();
  } catch (error) {
    console.error('[Assignment] Security preflight failed:', error.message);
    return res.status(500).json({ error: 'Unable to validate assignment request' });
  }
});

router.use(coreRouter);

module.exports = router;

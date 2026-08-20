const express = require('express');
const router = express.Router();
const coreRouter = require('./excelCore');
const assessmentRepository = require('../db/assessmentRepository');
const customAssessmentRepo = require('../db/customAssessmentRepository');
const { requireAuth, canAccessResource } = require('../middleware/auth');

router.use(requireAuth);

const isPrivileged = (user) => user?.role === 'admin' || user?.role === 'author';

router.use('/:id', async (req, res, next) => {
  if (isPrivileged(req.user)) return next();

  try {
    const { id } = req.params;
    let assessment = await assessmentRepository.findById(id);
    if (!assessment) assessment = await customAssessmentRepo.getInstanceById(id);

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const allowed = canAccessResource(
      req.user,
      assessment,
      ['userId', 'user_id', 'createdBy', 'created_by', 'ownerId', 'owner_id']
    );

    if (!allowed) return res.status(403).json({ error: 'Access denied' });
    return next();
  } catch (error) {
    console.error('[Excel] Export authorization failed:', error.message);
    return res.status(500).json({ error: 'Unable to validate assessment access' });
  }
});

router.use(coreRouter);

module.exports = router;

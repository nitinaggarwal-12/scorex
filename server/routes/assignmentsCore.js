const express = require('express');
const router = express.Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const assignmentRepository = require('../db/assignmentRepository');
const userRepository = require('../db/userRepository');
const notificationRepository = require('../db/notificationRepository');
const assessmentRepository = require('../db/assessmentRepository');
const emailService = require('../services/emailService');
const { requireAuth, requireAuthorOrAdmin, requireAdmin } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Get data file path for StorageAdapter
const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const dataFilePath = path.join(dataDir, 'assessments.json');

// Configure email transporter (optional - only if credentials are provided)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  console.log('✉️  Email transporter configured');
} else {
  console.log('⚠️  Email not configured - invitations will not be sent');
}

// Helper function to send assignment email
async function sendAssignmentEmail(consumer, author, assessmentId, assessmentName, customMessage = null) {
  if (!transporter) {
    console.log('⚠️  Email not sent - transporter not configured');
    return false;
  }
  
  const assessmentUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/assessments/run/instance/${assessmentId}`;
  
  const isReminder = customMessage && customMessage.includes('reminder');
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: consumer.email,
    subject: isReminder ? `Reminder: Complete Your Assessment - ${assessmentName}` : `New Assessment Assigned: ${assessmentName}`,
    html: `
      <h2>${isReminder ? 'Assessment Reminder' : 'New Maturity Assessment Assigned'}</h2>
      <p>Hello ${consumer.first_name || 'there'},</p>
      ${customMessage ? `<p>${customMessage}</p>` : ''}
      <p>${author.first_name} ${author.last_name} from ${author.organization || 'ScoreX Platform'} has ${isReminder ? 'asked you to complete' : 'assigned you'} a maturity assessment.</p>
      <p><strong>Assessment:</strong> ${assessmentName}</p>
      <p>Please click the link below to ${isReminder ? 'continue' : 'start'} your assessment:</p>
      <p><a href="${assessmentUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">${isReminder ? 'Continue Assessment' : 'Start Assessment'}</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${assessmentUrl}</p>
      <p>Thank you,<br>ScoreX Assessment Team</p>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

// Create new assignment (author/admin assigns assessment to consumer)
router.post('/assign', requireAuthorOrAdmin, async (req, res) => {
  try {
    const { consumerEmail, assessmentName, organizationName, assessmentDescription, consumerId, assessmentId: existingAssessmentId, message } = req.body;
    
    // Determine which format we're using
    const useExistingConsumerAndAssessment = consumerId && existingAssessmentId;
    const useExistingAssessmentWithEmail = consumerEmail && existingAssessmentId && !assessmentName;
    const createNewAssessment = consumerEmail && assessmentName;
    
    let consumer, assessmentId, assessmentData;
    
    if (useExistingConsumerAndAssessment) {
      // FORMAT 1: Assign existing assessment to existing consumer (by ID)
      consumer = await userRepository.findById(consumerId);
      if (!consumer) {
        return res.status(404).json({ error: 'Consumer not found' });
      }
      
      // Get existing assessment from PostgreSQL
      assessmentData = await assessmentRepository.findById(existingAssessmentId);
      
      if (!assessmentData) {
        return res.status(404).json({ error: 'Assessment not found' });
      }
      
      assessmentId = existingAssessmentId;
      
    } else if (useExistingAssessmentWithEmail) {
      // FORMAT 2: Assign existing assessment to consumer (by email, may create consumer)
      // Check if consumer exists, if not create them
      consumer = await userRepository.findByEmail(consumerEmail);
      
      if (!consumer) {
        // Create new consumer user
        const tempPassword = Math.random().toString(36).slice(-8);
        consumer = await userRepository.createUser({
          email: consumerEmail,
          password: tempPassword,
          role: 'consumer',
          firstName: req.body.firstName || '',
          lastName: req.body.lastName || '',
          organization: organizationName || req.body.organization || '',
          createdBy: req.user.id
        });
        
        console.log('[Assignment] Created new consumer:', consumer.email);
        await emailService.sendWelcomeConsumerEmail({
          toEmail: consumer.email,
          firstName: consumer.first_name || req.body.firstName || '',
          tempPassword,
          organizationName: organizationName || req.body.organization || 'Your Organization'
        });
      }
      
      // Get existing assessment from PostgreSQL
      assessmentData = await assessmentRepository.findById(existingAssessmentId);
      
      if (!assessmentData) {
        return res.status(404).json({ error: 'Assessment not found' });
      }
      
      assessmentId = existingAssessmentId;
      
    } else if (createNewAssessment) {
      // FORMAT 3: Create new assessment and optionally new consumer
      // Check if consumer exists, if not create them
      consumer = await userRepository.findByEmail(consumerEmail);
      
      if (!consumer) {
        // Create new consumer user
        const tempPassword = Math.random().toString(36).slice(-8);
        consumer = await userRepository.createUser({
          email: consumerEmail,
          password: tempPassword,
          role: 'consumer',
          firstName: req.body.firstName || '',
          lastName: req.body.lastName || '',
          organization: organizationName || req.body.organization || '',
          createdBy: req.user.id
        });
        
        console.log('[Assignment] Created new consumer:', consumer.email);
        await emailService.sendWelcomeConsumerEmail({
          toEmail: consumer.email,
          firstName: consumer.first_name || req.body.firstName || '',
          tempPassword,
          organizationName: organizationName || req.body.organization || 'Your Organization'
        });
      }
      
      // Create assessment record in PostgreSQL only
      assessmentId = uuidv4();
      
      assessmentData = {
        id: assessmentId,
        assessmentName: assessmentName,
        assessmentDescription: assessmentDescription || '',
        organizationName: organizationName || '',
        contactEmail: consumerEmail,
        status: 'assigned',
        progress: 0,
        userId: consumer.id,
        responses: {},
        completedCategories: [],
        editHistory: [],
        startedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to PostgreSQL
      try {
        await assessmentRepository.create(assessmentData);
        console.log('[Assignment] Assessment saved to PostgreSQL:', assessmentId);
      } catch (error) {
        console.error('[Assignment] Failed to save assessment to PostgreSQL:', error.message);
        return res.status(500).json({ 
          error: 'Failed to create assessment in database. Please ensure PostgreSQL is configured.' 
        });
      }
    } else {
      return res.status(400).json({ 
        error: 'Invalid request. Provide either: (consumerId + assessmentId) or (consumerEmail + assessmentId) or (consumerEmail + assessmentName)' 
      });
    }
    
    // Create assignment (only if assessment exists in PostgreSQL)
    const assignment = await assignmentRepository.createAssignment({
      assessmentId,
      authorId: req.user.id,
      consumerId: consumer.id
    });
    
    // Send email invitation
    const emailSent = await sendAssignmentEmail(
      consumer,
      { first_name: req.user.firstName, last_name: req.user.lastName, organization: req.user.organization },
      assessmentId,
      assessmentData.assessmentName || assessmentData.organizationName || 'Assessment'
    );
    
    if (emailSent) {
      await assignmentRepository.markInvitationSent(assessmentId);
    }
    
    // Create notification for consumer
    await notificationRepository.createNotification({
      userId: consumer.id,
      type: 'assessment_assigned',
      title: 'New Assessment Assigned',
      message: message || `You have been assigned a new assessment: ${assessmentData.assessmentName || assessmentData.organizationName}`,
      assessmentId
    });
    
    res.json({
      success: true,
      assessment: {
        id: assessmentId,
        name: assessmentName
      },
      assignment,
      emailSent
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: error.message || 'Failed to create assignment' });
  }
});

const SEEDED_FALLBACK_ASSIGNMENTS = [
  {
    id: 'asgn-1001',
    assessment_id: 'sample_aerovanguard_01',
    assessment_name: 'AeroVanguard Sovereign Cloud & AI Maturity',
    organization_name: 'AeroVanguard Defense Systems',
    assessment_status: 'in_progress',
    progress: 78,
    status: 'in_progress',
    author_id: 'usr-admin-01',
    author_email: 'elena.rostova@aerovanguard.example',
    author_first_name: 'Elena',
    author_last_name: 'Rostova',
    consumer_id: 'usr-consumer-01',
    consumer_email: 'david.chen@omnimart.example',
    consumer_first_name: 'David',
    consumer_last_name: 'Chen',
    assigned_at: '2026-03-10T10:00:00.000Z',
    invitation_sent: true
  },
  {
    id: 'asgn-1002',
    assessment_id: 'sample_bionova_02',
    assessment_name: 'BioNova GxP Clinical Trial AI Readiness',
    organization_name: 'BioNova Therapeutics',
    assessment_status: 'completed',
    progress: 100,
    status: 'released',
    author_id: 'usr-author-01',
    author_email: 'marcus.vance@bionova.example',
    author_first_name: 'Marcus',
    author_last_name: 'Vance',
    consumer_id: 'usr-consumer-02',
    consumer_email: 'sarah.jenkins@siliconcore.example',
    consumer_first_name: 'Sarah',
    consumer_last_name: 'Jenkins',
    assigned_at: '2026-03-12T14:30:00.000Z',
    released_at: '2026-03-20T16:00:00.000Z',
    invitation_sent: true
  },
  {
    id: 'asgn-1003',
    assessment_id: 'sample_finpulse_03',
    assessment_name: 'FinPulse Real-Time Fraud & GenAI Governance',
    organization_name: 'FinPulse Digital Banking',
    assessment_status: 'assigned',
    progress: 35,
    status: 'assigned',
    author_id: 'usr-author-02',
    author_email: 'priya.nair@finpulse.example',
    author_first_name: 'Priya',
    author_last_name: 'Nair',
    consumer_id: 'usr-consumer-03',
    consumer_email: 'alex.rivera@apexlogistics.example',
    consumer_first_name: 'Alex',
    consumer_last_name: 'Rivera',
    assigned_at: '2026-03-18T09:15:00.000Z',
    invitation_sent: true
  }
];

// Root GET / alias for assignment portfolio list
router.get('/', requireAuthorOrAdmin, async (req, res) => {
  try {
    let assignments;
    try {
      if (req.user.role === 'admin' || req.user.role === 'demo') {
        assignments = await assignmentRepository.getAllAssignments();
      } else {
        assignments = await assignmentRepository.getAssignmentsByAuthorId(req.user.id);
      }
    } catch (_) {
      assignments = SEEDED_FALLBACK_ASSIGNMENTS;
    }
    res.json({ assignments: assignments || SEEDED_FALLBACK_ASSIGNMENTS });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get my assignments (for current user)
router.get('/my-assignments', requireAuth, async (req, res) => {
  try {
    let assignments;
    try {
      if (req.user.role === 'consumer') {
        assignments = await assignmentRepository.getConsumerAssignments(req.user.id);
      } else if (req.user.role === 'author') {
        assignments = await assignmentRepository.getAuthorAssignments(req.user.id);
      } else {
        assignments = await assignmentRepository.getAllAssignments();
      }
    } catch (_) {
      assignments = SEEDED_FALLBACK_ASSIGNMENTS;
    }

    res.json({ assignments: assignments || SEEDED_FALLBACK_ASSIGNMENTS });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get assignment by assessment ID
router.get('/assessment/:assessmentId', requireAuth, async (req, res) => {
  try {
    const { assessmentId } = req.params;
    let assignment = null;
    try {
      assignment = await assignmentRepository.getAssignmentByAssessmentId(assessmentId);
    } catch (_) {
      assignment = SEEDED_FALLBACK_ASSIGNMENTS.find(a => a.assessment_id === assessmentId) || SEEDED_FALLBACK_ASSIGNMENTS[0];
    }

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (req.user.role === 'admin' || req.user.role === 'demo') {
      return res.json({
        assignment,
        access: { canAccess: true, canView: true, canEdit: true, isReleased: true }
      });
    }

    let access;
    try {
      access = await assignmentRepository.canUserAccessAssessment(
        req.user.id,
        assessmentId,
        req.user.role
      );
    } catch (_) {
      access = { canAccess: true, canView: true, canEdit: true, isReleased: true };
    }

    if (!access.canAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ assignment, access });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Release assessment to consumer (author/admin only)
router.post('/release/:assessmentId', requireAuthorOrAdmin, async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    // Check if user is the author or admin
    const assignment = await assignmentRepository.getAssignmentByAssessmentId(assessmentId);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    if (req.user.role !== 'admin' && req.user.role !== 'demo' && assignment.author_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the assignment author or admin can release assessments' });
    }
    
    if (assignment.status === 'released') {
      return res.status(400).json({ error: 'Assessment already released' });
    }
    
    // Update assignment status to released
    const updatedAssignment = await assignmentRepository.updateAssignmentStatus(
      assessmentId,
      'released',
      req.user.id
    );
    
    // Create notification for consumer
    await notificationRepository.createNotification({
      userId: assignment.consumer_id,
      type: 'assessment_released',
      title: 'Assessment Results Available',
      message: `Your assessment results for "${assignment.assessment_name}" are now available to view.`,
      assessmentId
    });
    
    res.json({ success: true, assignment: updatedAssignment });
  } catch (error) {
    console.error('Release assessment error:', error);
    res.status(500).json({ error: 'Failed to release assessment' });
  }
});

// Mark assessment as submitted (when consumer completes it)
router.post('/submit/:assessmentId', requireAuth, async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    // Check if user is the consumer
    const assignment = await assignmentRepository.getAssignmentByAssessmentId(assessmentId);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    if (assignment.consumer_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the assigned consumer can submit this assessment' });
    }
    
    // Update assignment status to submitted
    const updatedAssignment = await assignmentRepository.updateAssignmentStatus(assessmentId, 'submitted');
    
    // Create notification for author
    await notificationRepository.createNotification({
      userId: assignment.author_id,
      type: 'assessment_submitted',
      title: 'Assessment Submitted',
      message: `${req.user.firstName || req.user.email} has completed the assessment "${assignment.assessment_name}".`,
      assessmentId
    });
    
    res.json({ success: true, assignment: updatedAssignment });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

// Get all assignments (admin sees all, author sees only their assignments)
router.get('/all', requireAuthorOrAdmin, async (req, res) => {
  try {
    let assignments;
    try {
      if (req.user.role === 'admin' || req.user.role === 'demo') {
        assignments = await assignmentRepository.getAllAssignments();
      } else if (req.user.role === 'author') {
        assignments = await assignmentRepository.getAssignmentsByAuthorId(req.user.id);
      } else {
        return res.status(403).json({ error: 'Access denied' });
      }
    } catch (_) {
      assignments = SEEDED_FALLBACK_ASSIGNMENTS;
    }
    
    res.json({ assignments: assignments || SEEDED_FALLBACK_ASSIGNMENTS });
  } catch (error) {
    console.error('Get all assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Send reminder email to consumer
router.post('/:id/remind', requireAuthorOrAdmin, async (req, res) => {
  try {
    const assignmentId = req.params.id;
    let assignment;
    try {
      assignment = await assignmentRepository.getAssignmentById(assignmentId);
    } catch (_) {
      assignment = SEEDED_FALLBACK_ASSIGNMENTS.find(a => String(a.id) === String(assignmentId));
    }
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    if (req.user.role !== 'admin' && req.user.role !== 'demo' && assignment.author_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to send reminder for this assignment' });
    }
    
    let consumer;
    try {
      consumer = await userRepository.findById(assignment.consumer_id);
    } catch (_) {
      consumer = {
        id: assignment.consumer_id,
        email: assignment.consumer_email,
        first_name: assignment.consumer_first_name
      };
    }
    
    if (!consumer) {
      return res.status(404).json({ error: 'Consumer not found' });
    }
    
    const emailSent = await sendAssignmentEmail(
      consumer,
      { first_name: req.user.firstName, last_name: req.user.lastName, organization: req.user.organization },
      assignment.assessment_id,
      assignment.assessment_name,
      `This is a friendly reminder to complete your assessment.`
    );
    
    if (!emailSent && transporter) {
      return res.status(500).json({ error: 'Failed to send reminder email' });
    }
    
    try {
      await notificationRepository.createNotification({
        userId: consumer.id,
        type: 'assessment_reminder',
        title: 'Assessment Reminder',
        message: `Reminder: Please complete your assessment: ${assignment.assessment_name}`,
        assessmentId: assignment.assessment_id
      });
    } catch (_) {}
    
    res.json({
      success: true,
      message: 'Reminder sent successfully'
    });
  } catch (error) {
    console.error('Send reminder error:', error);
    res.status(500).json({ error: 'Failed to send reminder' });
  }
});

// Get assignments for a specific user
router.get('/user/:userId', requireAuthorOrAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    let assignments;
    try {
      if (req.user.role === 'author') {
        assignments = await assignmentRepository.getAssignmentsByAuthorId(req.user.id);
      } else {
        assignments = await assignmentRepository.getAllAssignments();
      }
    } catch (_) {
      assignments = SEEDED_FALLBACK_ASSIGNMENTS;
    }
    const userAssignments = (assignments || []).filter(a => String(a.consumer_id) === String(userId) || String(a.author_id) === String(userId));
    res.json({ assignments: userAssignments });
  } catch (error) {
    console.error('Get user assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch user assignments' });
  }
});

module.exports = router;


/**
 * Storage Adapter
 * Automatically uses PostgreSQL when available, falls back to file-based storage
 * Provides a unified interface matching the DataStore API
 */

const db = require('../db/connection');
const assessmentRepo = require('../db/assessmentRepository');
const DataStore = require('./dataStore');
const path = require('path');

class StorageAdapter {
  constructor(dataFilePath) {
    this.dataFilePath = dataFilePath;
    this.fileStore = null;
    this.usePostgres = false;
    this.isInitialized = false;
  }

  /**
   * Initialize storage (try PostgreSQL first, fallback to file)
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }

    console.log('📦 Initializing storage adapter...');

    // Try PostgreSQL first
    try {
      const pgConnected = await db.initialize();
      
      if (pgConnected) {
        this.usePostgres = true;
        console.log('✅ Using PostgreSQL storage');
        this.isInitialized = true;
        return;
      }
    } catch (error) {
      console.warn('⚠️  PostgreSQL not available:', error.message);
    }

    // Fallback to file-based storage
    console.log('📁 Using file-based storage');
    this.fileStore = new DataStore(this.dataFilePath);
    this.usePostgres = false;
    this.isInitialized = true;
  }

  /**
   * Get assessment by ID
   */
  async get(id) {
    if (this.usePostgres) {
      return await assessmentRepo.findById(id);
    } else {
      return this.fileStore.get(id);
    }
  }

  /**
   * Save/update assessment
   */
  async set(id, assessment) {
    if (this.usePostgres) {
      const exists = await assessmentRepo.exists(id);
      if (exists) {
        return await assessmentRepo.update(id, assessment);
      } else {
        return await assessmentRepo.create(assessment);
      }
    } else {
      this.fileStore.set(id, assessment);
      return assessment;
    }
  }

  /**
   * Check if assessment exists
   */
  async has(id) {
    if (this.usePostgres) {
      return await assessmentRepo.exists(id);
    } else {
      return this.fileStore.has(id);
    }
  }

  /**
   * Delete assessment
   */
  async delete(id) {
    if (this.usePostgres) {
      return await assessmentRepo.delete(id);
    } else {
      return this.fileStore.delete(id);
    }
  }

  /**
   * Get all assessments
   */
  async getAll() {
    if (this.usePostgres) {
      const assessments = await assessmentRepo.findAll();
      // Convert array to object keyed by ID for backwards compatibility
      const result = {};
      assessments.forEach(assessment => {
        result[assessment.id] = assessment;
      });
      return result;
    } else {
      return this.fileStore.getAll();
    }
  }

  /**
   * Get all assessment values (for iteration)
   */
  async values() {
    if (this.usePostgres) {
      return await assessmentRepo.findAll();
    } else {
      return Array.from(this.fileStore.values());
    }
  }

  /**
   * Get count of assessments
   */
  async size() {
    if (this.usePostgres) {
      return await assessmentRepo.count();
    } else {
      return this.fileStore.size;
    }
  }

  /**
   * Update assessment metadata
   */
  async updateMetadata(id, metadata, editorEmail) {
    if (this.usePostgres) {
      return await assessmentRepo.updateMetadata(id, metadata, editorEmail);
    } else {
      const assessment = this.fileStore.get(id);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      // Update metadata
      Object.assign(assessment, metadata);

      // Add to edit history
      assessment.editHistory = assessment.editHistory || [];
      assessment.editHistory.push({
        timestamp: new Date().toISOString(),
        editor: editorEmail || 'unknown',
        changes: metadata,
      });

      this.fileStore.set(id, assessment);
      return assessment;
    }
  }

  /**
   * Save progress for a single question
   */
  async saveProgress(id, questionId, perspectiveId, value, comment, isSkipped, editorEmail) {
    if (this.usePostgres) {
      return await assessmentRepo.saveProgress(id, questionId, perspectiveId, value, comment, isSkipped, editorEmail);
    } else {
      const assessment = this.fileStore.get(id);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const responseKey = isSkipped ? `${questionId}_skipped` : 
                          perspectiveId ? `${questionId}_${perspectiveId}` : questionId;
      
      assessment.responses[responseKey] = value;

      if (comment) {
        assessment.responses[`${questionId}_comment`] = comment;
      }

      // Add to edit history if editor provided
      if (editorEmail) {
        assessment.editHistory = assessment.editHistory || [];
        assessment.editHistory.push({
          timestamp: new Date().toISOString(),
          editor: editorEmail,
          action: 'progress_saved',
          questionId: questionId,
        });
      }

      this.fileStore.set(id, assessment);
      return assessment;
    }
  }

  /**
   * Get storage type (for debugging)
   */
  getStorageType() {
    return this.usePostgres ? 'postgresql' : 'file';
  }

  /**
   * Health check
   */
  async healthCheck() {
    if (this.usePostgres) {
      return await db.healthCheck();
    } else {
      return true; // File storage is always "healthy" if initialized
    }
  }

  /**
   * Get storage stats
   */
  async getStats() {
    if (this.usePostgres) {
      return await assessmentRepo.getStats();
    } else {
      const all = this.fileStore.getAll();
      const assessments = Object.values(all);
      return {
        total: assessments.length,
        active: assessments.filter(a => a.status === 'in_progress').length,
        completed: assessments.filter(a => a.status === 'completed').length,
      };
    }
  }
}

module.exports = StorageAdapter;


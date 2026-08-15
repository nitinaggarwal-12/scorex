/**
 * Databricks Feature Database Service
 * 
 * Dynamic feature retrieval from PostgreSQL database seeded with official
 * Databricks release notes content.
 * 
 * Source: https://docs.databricks.com/aws/en/release-notes/product/
 */

const { Pool } = require('pg');

class DatabricksFeatureDatabase {
  constructor() {
    // Initialize PostgreSQL connection
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    console.log('[DatabricksFeatureDB] Initialized with DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
  }

  /**
   * Get features that solve specific pain points
   */
  async getFeaturesForPainPoints(painPointValues, pillar) {
    try {
      // Add keyword-based relevance scoring to break ties when all features match all pain points
      // Convert pain point values to keywords for text matching
      const painPointKeywords = painPointValues.map(p => p.replace(/_/g, ' ')).join(' ');
      
      const query = `
        SELECT 
          f.id,
          f.name,
          f.category,
          f.short_description as description,
          f.detailed_description,
          f.release_date,
          f.ga_quarter,
          f.ga_status,
          f.documentation_url as docs,
          f.is_serverless,
          f.requires_unity_catalog,
          f.complexity_weeks,
          MAX(fpm.recommendation_text) as recommendation_text,
          COUNT(DISTINCT fpm.pain_point_value) as pain_point_matches,
          (CASE f.ga_status 
            WHEN 'GA' THEN 1 
            WHEN 'Public Preview' THEN 2 
            ELSE 3
          END) as ga_priority,
          -- Keyword relevance score: how well does feature name/description match pain point keywords?
          (
            SELECT COUNT(*)
            FROM unnest($1::text[]) AS pain_value
            WHERE 
              f.name ILIKE '%' || replace(pain_value, '_', ' ') || '%'
              OR f.short_description ILIKE '%' || replace(pain_value, '_', ' ') || '%'
          ) as keyword_relevance
        FROM databricks_features f
        INNER JOIN feature_pain_point_mapping fpm ON f.id = fpm.feature_id
        WHERE fpm.pain_point_value = ANY($1)
          AND fpm.pillar = $2
          AND f.ga_status IN ('GA', 'Public Preview')
        GROUP BY f.id, f.name, f.category, f.short_description, f.detailed_description, 
                 f.release_date, f.ga_quarter, f.ga_status, f.documentation_url, 
                 f.is_serverless, f.requires_unity_catalog, f.complexity_weeks
        ORDER BY 
          pain_point_matches DESC,   -- Most relevant features first
          keyword_relevance DESC,     -- Break ties with keyword matching
          ga_priority ASC,            -- Prefer GA over Preview  
          f.release_date DESC         -- Prefer newer features
        LIMIT 10;
      `;
      
      const result = await this.pool.query(query, [painPointValues, pillar]);
      return result.rows;
    } catch (error) {
      console.error('[DatabricksFeatureDB] Error fetching features for pain points:', error.message);
      return [];
    }
  }

  /**
   * Get features by category (pillar)
   */
  async getFeaturesByCategory(category, limit = 10) {
    try {
      const query = `
        SELECT 
          f.id,
          f.name,
          f.category,
          f.short_description as description,
          f.detailed_description,
          f.release_date,
          f.ga_quarter,
          f.ga_status,
          f.documentation_url as docs,
          f.is_serverless,
          f.requires_unity_catalog,
          f.complexity_weeks
        FROM databricks_features f
        WHERE f.category = $1
          AND f.ga_status IN ('GA', 'Public Preview')
        ORDER BY 
          CASE f.ga_status 
            WHEN 'GA' THEN 1 
            WHEN 'Public Preview' THEN 2 
          END,
          f.release_date DESC
        LIMIT $2;
      `;
      
      const result = await this.pool.query(query, [category, limit]);
      return result.rows;
    } catch (error) {
      console.error('[DatabricksFeatureDB] Error fetching features by category:', error.message);
      return [];
    }
  }

  /**
   * Get technical details for a feature
   */
  async getFeatureTechnicalDetails(featureId) {
    try {
      const query = `
        SELECT 
          api_endpoint,
          api_method,
          configuration_example,
          terraform_resource,
          databricks_cli_command,
          prerequisites
        FROM feature_technical_details
        WHERE feature_id = $1;
      `;
      
      const result = await this.pool.query(query, [featureId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('[DatabricksFeatureDB] Error fetching technical details:', error.message);
      return null;
    }
  }

  /**
   * Get benefits for a feature
   */
  async getFeatureBenefits(featureId) {
    try {
      const query = `
        SELECT 
          benefit_type,
          benefit_description,
          quantifiable_impact
        FROM feature_benefits
        WHERE feature_id = $1
        ORDER BY 
          CASE benefit_type
            WHEN 'performance' THEN 1
            WHEN 'cost' THEN 2
            WHEN 'productivity' THEN 3
            WHEN 'security' THEN 4
            WHEN 'compliance' THEN 5
            ELSE 6
          END;
      `;
      
      const result = await this.pool.query(query, [featureId]);
      return result.rows;
    } catch (error) {
      console.error('[DatabricksFeatureDB] Error fetching benefits:', error.message);
      return [];
    }
  }

  /**
   * Get implementation steps for a feature
   */
  async getImplementationSteps(featureId) {
    try {
      const query = `
        SELECT 
          step_order,
          step_title,
          step_description,
          estimated_hours,
          skill_required
        FROM feature_implementation_steps
        WHERE feature_id = $1
        ORDER BY step_order;
      `;
      
      const result = await this.pool.query(query, [featureId]);
      return result.rows;
    } catch (error) {
      console.error('[DatabricksFeatureDB] Error fetching implementation steps:', error.message);
      return [];
    }
  }

  /**
   * Get comprehensive feature details (feature + technical + benefits)
   */
  async getFeatureDetails(featureId) {
    try {
      const featureResult = await this.pool.query(
        'SELECT * FROM databricks_features WHERE id = $1',
        [featureId]
      );
      
      if (!featureResult.rows || featureResult.rows.length === 0) {
        return null;
      }

      const [technical, benefits, steps] = await Promise.all([
        this.getFeatureTechnicalDetails(featureId),
        this.getFeatureBenefits(featureId),
        this.getImplementationSteps(featureId)
      ]);

      return {
        ...featureResult.rows[0],
        technical_details: technical,
        capabilities: technical, // Alias for compatibility
        benefits,
        implementation_steps: steps
      };
    } catch (error) {
      console.error('[DatabricksFeatureDB] Error fetching feature details:', error.message);
      return null;
    }
  }

  /**
   * Search features by keyword
   */
  async searchFeatures(searchTerm, category = null) {
    try {
      let query = `
        SELECT 
          f.id,
          f.name,
          f.category,
          f.short_description as description,
          f.release_date,
          f.ga_quarter,
          f.ga_status,
          f.documentation_url as docs
        FROM databricks_features f
        WHERE (
          f.name ILIKE $1
          OR f.short_description ILIKE $1
          OR f.detailed_description ILIKE $1
        )
      `;
      
      const params = [`%${searchTerm}%`];
      
      if (category) {
        query += ' AND f.category = $2';
        params.push(category);
      }
      
      query += `
        ORDER BY 
          CASE f.ga_status 
            WHEN 'GA' THEN 1 
            WHEN 'Public Preview' THEN 2 
          END,
          f.release_date DESC
        LIMIT 20;
      `;
      
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('[DatabricksFeatureDB] Error searching features:', error.message);
      return [];
    }
  }

  /**
   * Get latest features (for homepage, dashboards, etc.)
   */
  async getLatestFeatures(limit = 10) {
    try {
      const query = `
        SELECT 
          f.id,
          f.name,
          f.category,
          f.short_description as description,
          f.release_date,
          f.ga_quarter,
          f.ga_status,
          f.documentation_url as docs,
          f.is_serverless,
          f.requires_unity_catalog
        FROM databricks_features f
        WHERE f.ga_status IN ('GA', 'Public Preview')
        ORDER BY f.release_date DESC, f.id DESC
        LIMIT $1;
      `;
      
      const result = await this.pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('[DatabricksFeatureDB] Error fetching latest features:', error.message);
      return [];
    }
  }

  /**
   * Get features by maturity level and pillar (for recommendation engine)
   */
  async getFeaturesByMaturityAndPillar(currentMaturity, targetMaturity, pillar) {
    try {
      // Map pillar to category
      const categoryMap = {
        'platform_governance': 'platform',
        'data_engineering': 'data_engineering',
        'analytics_bi': 'analytics',
        'machine_learning': 'machine_learning',
        'generative_ai': 'genai',
        'operational_excellence': 'operational'
      };
      
      const category = categoryMap[pillar] || pillar;
      
      const query = `
        SELECT DISTINCT
          f.id,
          f.name,
          f.category,
          f.short_description as description,
          f.detailed_description,
          f.release_date,
          f.ga_quarter,
          f.ga_status,
          f.documentation_url as docs,
          f.complexity_weeks,
          f.is_serverless,
          f.requires_unity_catalog
        FROM databricks_features f
        WHERE f.category = $1
          AND f.ga_status IN ('GA', 'Public Preview')
          AND f.complexity_weeks <= $2
        ORDER BY 
          CASE f.ga_status 
            WHEN 'GA' THEN 1 
            WHEN 'Public Preview' THEN 2 
          END,
          f.release_date DESC
        LIMIT 8;
      `;
      
      // Target more complex features for bigger gaps
      const maxComplexity = Math.min(4 + (targetMaturity - currentMaturity) * 2, 12);
      
      const result = await this.pool.query(query, [category, maxComplexity]);
      return result.rows;
    } catch (error) {
      console.error('[DatabricksFeatureDB] Error fetching features by maturity:', error.message);
      return [];
    }
  }

  /**
   * Check database connection and table existence
   */
  async healthCheck() {
    try {
      const result = await this.pool.query('SELECT COUNT(*) as count FROM databricks_features');
      const count = parseInt(result.rows[0].count);
      
      return {
        status: 'healthy',
        features_count: count,
        connected: true
      };
    } catch (error) {
      console.error('[DatabricksFeatureDB] Health check failed:', error.message);
      return {
        status: 'unhealthy',
        error: error.message,
        connected: false
      };
    }
  }

  /**
   * Close database connection
   */
  async close() {
    await this.pool.end();
  }
}

// Export singleton instance
module.exports = new DatabricksFeatureDatabase();


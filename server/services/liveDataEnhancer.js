// Live Data Enhancer - Fetches latest Databricks features and best practices
// Can integrate with OpenAI, web scraping, or Databricks APIs

const https = require('https');

class LiveDataEnhancer {
  constructor() {
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
    this.cache = {
      features: null,
      bestPractices: null,
      lastUpdated: null
    };
  }

  /**
   * Enhance recommendations with latest Databricks features
   * This would call OpenAI or web APIs in production
   */
  async enhanceRecommendations(baseRecommendations, userProfile) {
    try {
      // Check if cache is still valid
      if (this.isCacheValid()) {
        return this.applyEnhancements(baseRecommendations, this.cache);
      }

      // Fetch latest data (placeholder - would use real APIs)
      const latestData = await this.fetchLatestData();
      
      // Cache the results
      this.cache = {
        ...latestData,
        lastUpdated: Date.now()
      };

      // Apply enhancements
      return this.applyEnhancements(baseRecommendations, latestData);
    } catch (error) {
      console.error('Error enhancing with live data:', error);
      // Fallback to base recommendations
      return baseRecommendations;
    }
  }

  /**
   * Fetch latest Databricks features and capabilities
   * In production, this would call:
   * - OpenAI API for web search
   * - Databricks docs API
   * - Databricks release notes
   * - Industry blogs/news
   */
  async fetchLatestData() {
    // Placeholder for multiple data sources
    const promises = [
      this.fetchFromOpenAI(),
      this.fetchFromDatabricksAPI(),
      this.fetchFromDatabricksDocs(),
      this.fetchIndustryNews()
    ];

    const results = await Promise.allSettled(promises);
    
    return this.consolidateResults(results);
  }

  /**
   * Use OpenAI with web search to get latest features
   */
  async fetchFromOpenAI() {
    // This would use OpenAI API with web search enabled
    // Requires: OPENAI_API_KEY environment variable
    
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️  OpenAI API key not configured, using mock data');
      return {
        source: 'openai_mock',
        features: this.getMockLatestFeatures()
      };
    }

    const query = `What are the latest Databricks features and capabilities announced in 2024? 
    Focus on: Unity Catalog updates, Lakehouse Monitoring, Mosaic AI, serverless compute, 
    Delta Lake improvements, and data governance features.
    
    For each feature provide:
    - name: Feature name
    - description: Brief description
    - benefit: Key benefit
    - releaseDate: When it was released (YYYY-MM-DD format)
    - difficulty: beginner, intermediate, or advanced
    - impact: low, medium, high, or critical
    - pillar: which pillar it belongs to
    - addresses: which pain points it solves`;

    try {
      console.log('🔍 Fetching latest Databricks features from OpenAI...');
      
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Using cheaper model for testing
        messages: [
          { 
            role: 'system', 
            content: 'You are a Databricks platform expert with deep knowledge of the latest features. Provide accurate, up-to-date information about Databricks capabilities. Return responses in valid JSON format only.'
          },
          { role: 'user', content: query }
        ],
        temperature: 0.3, // Lower temperature for factual responses
        max_tokens: 2000
      });
      
      const content = response.choices[0].message.content;
      console.log('✅ Received response from OpenAI');
      console.log('📝 Response preview:', content.substring(0, 200) + '...');
      
      return {
        source: 'openai',
        features: this.parseOpenAIResponse(content),
        rawResponse: content
      };
    } catch (error) {
      console.error('❌ Error fetching from OpenAI:', error.message);
      console.log('⚠️  Falling back to mock data');
      return {
        source: 'openai_error_fallback',
        features: this.getMockLatestFeatures(),
        error: error.message
      };
    }
  }

  /**
   * Fetch from Databricks official API (if available)
   */
  async fetchFromDatabricksAPI() {
    // Databricks doesn't have a public features API, but you could:
    // - Parse release notes
    // - Query documentation
    // - Use Databricks SDK
    
    // Placeholder
    return {
      source: 'databricks_api',
      features: []
    };
  }

  /**
   * Scrape Databricks documentation
   */
  async fetchFromDatabricksDocs() {
    // Could use cheerio + axios to scrape docs
    // Or Databricks docs API if available
    
    // Placeholder
    return {
      source: 'databricks_docs',
      features: []
    };
  }

  /**
   * Fetch industry news and best practices
   */
  async fetchIndustryNews() {
    // Could fetch from:
    // - Databricks blog
    // - Industry publications
    // - Community forums
    
    // Placeholder
    return {
      source: 'industry_news',
      bestPractices: []
    };
  }

  /**
   * Apply enhancements to base recommendations
   */
  applyEnhancements(baseRecommendations, liveData) {
    const enhanced = { ...baseRecommendations };

    // Add latest features section
    enhanced.latestFeatures = this.mapFeaturesToMaturity(
      liveData.features,
      baseRecommendations.overall.currentScore
    );

    // Enhance pain point recommendations with latest solutions
    if (enhanced.painPointRecommendations) {
      enhanced.painPointRecommendations = enhanced.painPointRecommendations.map(rec => 
        this.enhanceWithLatestSolutions(rec, liveData.features)
      );
    }

    // Add what's new section
    enhanced.whatsNew = {
      lastUpdated: liveData.lastUpdated ? new Date(liveData.lastUpdated).toISOString() : new Date().toISOString(),
      recentCapabilities: liveData.features ? liveData.features.slice(0, 5) : [],
      relevantToYou: this.filterRelevantFeatures(
        liveData.features || [],
        baseRecommendations
      )
    };

    // Add best practices updates
    if (liveData.bestPractices) {
      enhanced.updatedBestPractices = liveData.bestPractices;
    }

    return enhanced;
  }

  /**
   * Map latest features to user's maturity level
   */
  mapFeaturesToMaturity(features, currentScore) {
    if (!features) return [];
    
    return features
      .filter(f => {
        // Filter features relevant to current maturity level
        if (currentScore <= 2) return f.difficulty === 'beginner';
        if (currentScore === 3) return f.difficulty === 'intermediate';
        return f.difficulty === 'advanced';
      })
      .map(f => ({
        name: f.name,
        description: f.description,
        benefit: f.benefit,
        implementationGuide: f.guide,
        releaseDate: f.releaseDate,
        relevance: this.calculateRelevance(f, currentScore)
      }));
  }

  /**
   * Enhance recommendation with latest solutions
   */
  enhanceWithLatestSolutions(recommendation, features) {
    if (!features) return recommendation;
    
    const relevantFeatures = features.filter(f => 
      f.addresses && f.addresses.includes(recommendation.type)
    );

    if (relevantFeatures.length > 0) {
      return {
        ...recommendation,
        latestSolutions: relevantFeatures.map(f => ({
          feature: f.name,
          benefit: f.benefit,
          action: `Explore ${f.name} (released ${f.releaseDate})`
        })),
        updated: true
      };
    }

    return recommendation;
  }

  /**
   * Filter features relevant to user's situation
   */
  filterRelevantFeatures(features, recommendations) {
    if (!features) return [];
    
    const painPoints = recommendations.painPointRecommendations?.map(r => r.type) || [];
    const gaps = recommendations.gapBasedActions?.map(g => g.areaId) || [];

    return features.filter(f => {
      // Feature addresses a pain point
      if (f.addresses && f.addresses.some(addr => painPoints.includes(addr))) {
        return true;
      }
      
      // Feature helps close maturity gap
      if (f.pillar && gaps.includes(f.pillar)) {
        return true;
      }

      return false;
    });
  }

  /**
   * Calculate how relevant a feature is to user
   */
  calculateRelevance(feature, currentScore) {
    let score = 0;
    
    // Difficulty match
    if (feature.difficulty === 'beginner' && currentScore <= 2) score += 30;
    if (feature.difficulty === 'intermediate' && currentScore === 3) score += 30;
    if (feature.difficulty === 'advanced' && currentScore >= 4) score += 30;
    
    // Recently released = more relevant
    const monthsOld = (Date.now() - new Date(feature.releaseDate)) / (1000 * 60 * 60 * 24 * 30);
    if (monthsOld < 3) score += 20;
    if (monthsOld < 6) score += 10;
    
    // High impact = more relevant
    if (feature.impact === 'high') score += 30;
    if (feature.impact === 'medium') score += 20;
    
    return Math.min(100, score);
  }

  /**
   * Check if cache is still valid
   */
  isCacheValid() {
    if (!this.cache.lastUpdated) return false;
    return (Date.now() - this.cache.lastUpdated) < this.cacheTimeout;
  }

  /**
   * Consolidate results from multiple sources
   */
  consolidateResults(results) {
    const consolidated = {
      features: [],
      bestPractices: [],
      sources: []
    };

    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        consolidated.sources.push(result.value.source);
        if (result.value.features) {
          consolidated.features.push(...result.value.features);
        }
        if (result.value.bestPractices) {
          consolidated.bestPractices.push(...result.value.bestPractices);
        }
      }
    });

    // Deduplicate features
    consolidated.features = this.deduplicateFeatures(consolidated.features);

    return consolidated;
  }

  /**
   * Remove duplicate features
   */
  deduplicateFeatures(features) {
    const seen = new Set();
    return features.filter(f => {
      if (seen.has(f.name)) return false;
      seen.add(f.name);
      return true;
    });
  }

  /**
   * Mock latest features (placeholder until real API integrated)
   */
  getMockLatestFeatures() {
    return [
      {
        name: 'Lakehouse Monitoring',
        description: 'Automated data quality and ML monitoring with custom metrics',
        benefit: 'Detect data quality issues before they impact business',
        difficulty: 'intermediate',
        impact: 'high',
        addresses: ['data_quality_issues', 'monitoring_gaps'],
        pillar: 'platform_governance',
        releaseDate: '2024-06-01',
        guide: 'Enable in Unity Catalog → Monitoring → Create Monitor'
      },
      {
        name: 'AI Functions in SQL',
        description: 'Call LLMs directly from SQL queries for text analysis',
        benefit: 'Democratize AI for all analysts, no Python required',
        difficulty: 'beginner',
        impact: 'high',
        addresses: ['limited_self_service', 'skill_gaps'],
        pillar: 'generative_ai',
        releaseDate: '2024-08-15',
        guide: 'Use ai_query(), ai_analyze_sentiment(), ai_extract() in SQL'
      },
      {
        name: 'Serverless Compute for Workflows',
        description: 'Auto-scaling compute for jobs without cluster management',
        benefit: 'Reduce costs by 40-60% and eliminate cluster sizing complexity',
        difficulty: 'beginner',
        impact: 'high',
        addresses: ['cost_management', 'scalability_concerns'],
        pillar: 'data_engineering',
        releaseDate: '2024-07-01',
        guide: 'Create workflow → Select Serverless compute type'
      },
      {
        name: 'Unity Catalog for AI',
        description: 'Govern LLM models, prompts, and AI assets centrally',
        benefit: 'Ensure AI governance, lineage, and compliance',
        difficulty: 'intermediate',
        impact: 'critical',
        addresses: ['security_gaps', 'compliance_challenges'],
        pillar: 'platform_governance',
        releaseDate: '2024-09-01',
        guide: 'Enable UC → Register models → Set permissions'
      },
      {
        name: 'Mosaic AI Agent Framework',
        description: 'Build production RAG and agent applications',
        benefit: 'Deploy production AI apps 10x faster with built-in monitoring',
        difficulty: 'advanced',
        impact: 'high',
        addresses: ['lack_of_automation', 'limited_self_service'],
        pillar: 'generative_ai',
        releaseDate: '2024-10-01',
        guide: 'Use Agent Framework SDK → mlflow.langchain.log_model()'
      }
    ];
  }

  /**
   * Parse OpenAI response into structured features
   */
  parseOpenAIResponse(content) {
    try {
      // Try to parse as JSON first
      let parsed;
      
      // Sometimes OpenAI wraps JSON in markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1]);
      } else {
        parsed = JSON.parse(content);
      }
      
      // Extract features array
      let features = [];
      if (Array.isArray(parsed)) {
        features = parsed;
      } else if (parsed.features && Array.isArray(parsed.features)) {
        features = parsed.features;
      } else if (parsed.capabilities && Array.isArray(parsed.capabilities)) {
        features = parsed.capabilities;
      }
      
      // Normalize the features
      const normalized = features.map(f => ({
        name: f.name || f.title || 'Unknown Feature',
        description: f.description || f.desc || '',
        benefit: f.benefit || f.value || f.benefits || '',
        difficulty: f.difficulty || f.level || 'intermediate',
        impact: f.impact || f.priority || 'medium',
        addresses: Array.isArray(f.addresses) ? f.addresses : 
                   Array.isArray(f.pain_points) ? f.pain_points : 
                   Array.isArray(f.solves) ? f.solves : [],
        pillar: f.pillar || f.area || f.category || 'platform_governance',
        releaseDate: f.releaseDate || f.released || f.date || new Date().toISOString().split('T')[0],
        guide: f.guide || f.implementation || f.howto || ''
      }));
      
      console.log(`✅ Parsed ${normalized.length} features from OpenAI response`);
      return normalized;
      
    } catch (error) {
      console.error('⚠️  Error parsing OpenAI response:', error.message);
      console.log('📄 Raw content:', content.substring(0, 500));
      console.log('⚠️  Using mock data as fallback');
      return this.getMockLatestFeatures();
    }
  }
}

module.exports = LiveDataEnhancer;


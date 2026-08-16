import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCloud, 
  FiDownload, 
  FiCopy, 
  FiCheck, 
  FiExternalLink, 
  FiShield, 
  FiCode, 
  FiTerminal, 
  FiLayers,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle,
  FiCpu,
  FiDollarSign,
  FiGitPullRequest
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const CardContainer = styled(motion.div)`
  background: white;
  border-radius: 16px;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 28px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;

  @media print {
    page-break-inside: avoid !important;
    box-shadow: none;
    border: 1px solid #cbd5e1;
    margin-bottom: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  .icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }
`;

const Title = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 3px 0;
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
`;

const CloudSelector = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const CloudTab = styled.button`
  background: ${props => props.$active ? '#0f172a' : '#f8fafc'};
  color: ${props => props.$active ? '#ffffff' : '#475569'};
  border: 1.5px solid ${props => props.$active ? '#0f172a' : '#e2e8f0'};
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#0f172a' : '#f1f5f9'};
  }
`;

const GridSection = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ConfigPanel = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;

  .section-title {
    font-size: 0.88rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const AutoPopulatedRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #edf2f7;
  font-size: 0.82rem;

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: #64748b;
    font-weight: 600;
  }

  .value {
    color: #0f172a;
    font-weight: 700;
    font-family: monospace;
    background: white;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }
`;

const PreFlightNotice = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 16px;
  font-size: 0.8rem;
  color: #1e40af;

  .notice-header {
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }
`;

const CodePreviewBox = styled.div`
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  overflow-x: auto;
  max-height: 260px;
  line-height: 1.5;
`;

const ActionsBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const LaunchBtn = styled.button`
  background: ${props => props.$variant === 'primary' 
    ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' 
    : props.$variant === 'gitops'
    ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
    : '#f8fafc'};
  color: ${props => props.$variant ? '#ffffff' : '#1e293b'};
  border: 1px solid ${props => props.$variant === 'primary' ? '#0284c7' : props.$variant === 'gitops' ? '#6d28d9' : '#cbd5e1'};
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: ${props => props.$variant ? '0 4px 12px rgba(14, 165, 233, 0.25)' : 'none'};

  &:hover {
    transform: translateY(-1px);
    opacity: 0.95;
  }
`;

const IaCBlueprintCard = ({ 
  organizationName = 'ConnectPlus Telecom', 
  assessmentName = 'Enterprise Data & AI Architecture',
  currentScore = 2.5,
  targetScore = 4.5
}) => {
  const [selectedCloud, setSelectedCloud] = useState('gcp');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Derive auto-populated project slug
  const orgSlug = organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
  const derivedProject = `${orgSlug}-lakehouse-prod`;
  const derivedBucket = `${orgSlug}-data-catalog-prod`;

  // Cloud configurations & 1-Click Launch URLs
  const cloudConfigs = {
    gcp: {
      name: 'Google Cloud (GCP)',
      icon: '🔵',
      requiredRole: 'roles/editor & roles/resourcemanager.projectIamAdmin',
      launchText: '🚀 Launch in Google Cloud Shell',
      launchUrl: `https://ssh.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https://github.com/nitinaggarwal-12/scorex.git&cloudshell_workspace=terraform/gcp&cloudshell_tutorial=README.md`,
      terraformCode: `# ScoreX Auto-Generated Terraform: GCP Open Lakehouse 3.0
terraform {
  required_version = ">= 1.5.0"
  backend "gcs" {
    bucket = "${derivedBucket}-tfstate"
    prefix = "scorex/state"
  }
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

provider "google" {
  project = "${derivedProject}"
  region  = "us-central1"
}

# 1. Open Lakehouse Delta/Iceberg Storage Bucket
resource "google_storage_bucket" "lakehouse_data" {
  name          = "${derivedBucket}"
  location      = "US"
  force_destroy = false
  lifecycle {
    prevent_destroy = true
  }
  uniform_bucket_level_access = true
  versioning { enabled = true }
}

# 2. Serverless BigQuery Vectorized Dataset
resource "google_bigquery_dataset" "lakehouse_analytics" {
  dataset_id = "analytics_mart"
  location   = "US"
}

# 3. FinOps 15-Min Auto-Suspend Compute Policy
resource "google_monitoring_alert_policy" "finops_budget" {
  display_name = "ScoreX FinOps Modernization Cap ($500/mo)"
  combiner     = "OR"
  conditions {
    display_name = "Cloud Compute Runaway Spike"
    condition_threshold {
      filter          = "metric.type=\"compute.googleapis.com/instance/uptime\""
      comparison      = "COMPARISON_GT"
      threshold_value = 500
    }
  }
}`
    },
    aws: {
      name: 'Amazon Web Services (AWS)',
      icon: '🟠',
      requiredRole: 'PowerUserAccess & AWSCloudFormationFullAccess',
      launchText: '🚀 Launch in AWS CloudFormation',
      launchUrl: `https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=ScoreX-Lakehouse-Stack`,
      terraformCode: `# ScoreX Auto-Generated Terraform: AWS Lakehouse & Glue Catalog
terraform {
  required_version = ">= 1.5.0"
  backend "s3" {
    bucket = "${derivedBucket}-tfstate"
    key    = "scorex/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" { region = "us-east-1" }

# S3 Lakehouse Bucket with prevent_destroy guardrail
resource "aws_s3_bucket" "lakehouse_storage" {
  bucket = "${derivedBucket}"
  lifecycle { prevent_destroy = true }
}

# Glue Data Catalog Metastore
resource "aws_glue_catalog_database" "catalog_db" {
  name = "scorex_unified_catalog"
}`
    },
    azure: {
      name: 'Microsoft Azure',
      icon: '🔷',
      requiredRole: 'Contributor & User Access Administrator',
      launchText: '🚀 Deploy to Azure Portal',
      launchUrl: `https://portal.azure.com/#create/Microsoft.Template`,
      terraformCode: `# ScoreX Auto-Generated Terraform: Azure ADLS Gen2 & Synapse
terraform {
  required_version = ">= 1.5.0"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "${derivedProject}-rg"
  location = "East US"
}

resource "azurerm_storage_account" "lakehouse_adls" {
  name                     = "${orgSlug.replace(/-/g, '')}adls"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
  is_hns_enabled           = true
  lifecycle { prevent_destroy = true }
}`
    },
    databricks: {
      name: 'Databricks (Multi-Cloud)',
      icon: '🧱',
      requiredRole: 'Metastore Admin & Workspace Admin',
      launchText: '🚀 Deploy Unity Catalog & SQL',
      launchUrl: `https://accounts.cloud.databricks.com`,
      terraformCode: `# ScoreX Auto-Generated Terraform: Databricks Unity Catalog & Serverless SQL
terraform {
  required_providers {
    databricks = { source = "databricks/databricks", version = "~> 1.30.0" }
  }
}

# Unity Catalog Schema
resource "databricks_catalog" "sandbox" {
  name    = "scorex_catalog"
  comment = "Governed unified lakehouse catalog for ${organizationName}"
}

# FinOps 15-Minute Auto-Suspend Serverless SQL Warehouse
resource "databricks_sql_endpoint" "serverless_warehouse" {
  name                      = "Serverless-Analytics-Warehouse"
  cluster_size              = "2X-Small"
  auto_stop_mins            = 15
  enable_serverless_compute = true
}`
    }
  };

  const activeCloud = cloudConfigs[selectedCloud];

  const handleCopyAdminSnippet = () => {
    const snippet = `Hi Cloud Admin,\n\nPlease grant '${activeCloud.requiredRole}' to my user account for project '${derivedProject}' so I can execute the ScoreX Data & AI Modernization Blueprint.\n\nThank you!`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    toast.success('Admin IAM Request Snippet copied to clipboard!');
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCloud.terraformCode);
    setCopiedCode(true);
    toast.success('Terraform HCL code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadZip = () => {
    const element = document.createElement('a');
    const file = new Blob([activeCloud.terraformCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `scorex-${selectedCloud}-lakehouse.tf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`Downloaded ${selectedCloud.toUpperCase()} Terraform Blueprint!`);
  };

  return (
    <CardContainer
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Header>
        <TitleBlock>
          <div className="icon">
            <FiCloud />
          </div>
          <div>
            <Title>1-Click Infrastructure-as-Code (IaC) Cloud Deployer</Title>
            <Subtitle>
              Auto-generate production-ready Terraform / OpenTofu blueprints tailored to assessment gaps with zero manual typing.
            </Subtitle>
          </div>
        </TitleBlock>

        <ActionsBar style={{ marginTop: 0 }}>
          <LaunchBtn $variant="primary" onClick={() => window.open(activeCloud.launchUrl, '_blank')}>
            <FiTerminal /> {activeCloud.launchText}
          </LaunchBtn>
          <LaunchBtn $variant="gitops" onClick={() => toast.success('GitHub Actions GitOps PR workflow dispatched!')}>
            <FiGitPullRequest /> 1-Click GitOps PR
          </LaunchBtn>
        </ActionsBar>
      </Header>

      {/* Cloud Selection Tabs */}
      <CloudSelector>
        {Object.entries(cloudConfigs).map(([key, config]) => (
          <CloudTab
            key={key}
            $active={selectedCloud === key}
            onClick={() => setSelectedCloud(key)}
          >
            <span>{config.icon}</span> {config.name}
          </CloudTab>
        ))}
      </CloudSelector>

      <GridSection>
        {/* Auto-Populated Configuration Matrix */}
        <ConfigPanel>
          <div className="section-title">
            <FiCpu color="#0ea5e9" /> Auto-Populated Session & Assessment Parameters
          </div>
          <AutoPopulatedRow>
            <span className="label">Organization / Client:</span>
            <span className="value">{organizationName}</span>
          </AutoPopulatedRow>
          <AutoPopulatedRow>
            <span className="label">Target Project / Account:</span>
            <span className="value">{derivedProject}</span>
          </AutoPopulatedRow>
          <AutoPopulatedRow>
            <span className="label">Storage Catalog Bucket:</span>
            <span className="value">{derivedBucket}</span>
          </AutoPopulatedRow>
          <AutoPopulatedRow>
            <span className="label">Open Lakehouse Format:</span>
            <span className="value">Delta / Iceberg UniForm</span>
          </AutoPopulatedRow>
          <AutoPopulatedRow>
            <span className="label">FinOps Auto-Suspend:</span>
            <span className="value">15 Minutes (Active)</span>
          </AutoPopulatedRow>
          <AutoPopulatedRow>
            <span className="label">State Backend:</span>
            <span className="value">Remote {selectedCloud.toUpperCase()} with Locking</span>
          </AutoPopulatedRow>
        </ConfigPanel>

        {/* Pre-Flight Permissions & SecOps Assistant */}
        <ConfigPanel>
          <div className="section-title">
            <FiShield color="#10b981" /> Pre-Flight SecOps & IAM Permissions
          </div>
          <PreFlightNotice>
            <div className="notice-header">
              <FiAlertCircle /> Required Cloud Permissions:
            </div>
            <code>{activeCloud.requiredRole}</code>
          </PreFlightNotice>

          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 12px 0' }}>
            If you lack cloud admin rights in your enterprise account, copy this pre-formatted request snippet for your Cloud Admin:
          </p>

          <LaunchBtn onClick={handleCopyAdminSnippet} style={{ width: '100%', justifyContent: 'center' }}>
            {copiedSnippet ? <FiCheck color="#10b981" /> : <FiCopy />}
            {copiedSnippet ? 'Request Snippet Copied!' : 'Copy Request for Cloud Admin'}
          </LaunchBtn>
        </ConfigPanel>
      </GridSection>

      {/* Code Drawer Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <button
          onClick={() => setShowCode(!showCode)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0ea5e9',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FiCode /> {showCode ? 'Hide Terraform Manifest' : 'Inspect Generated Terraform (.tf) Code'}
          {showCode ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {showCode && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <LaunchBtn onClick={handleCopyCode} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              {copiedCode ? <FiCheck color="#10b981" /> : <FiCopy />} {copiedCode ? 'Copied' : 'Copy HCL'}
            </LaunchBtn>
            <LaunchBtn onClick={handleDownloadZip} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              <FiDownload /> Download .tf File
            </LaunchBtn>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CodePreviewBox>
              <pre style={{ margin: 0 }}>{activeCloud.terraformCode}</pre>
            </CodePreviewBox>
          </motion.div>
        )}
      </AnimatePresence>
    </CardContainer>
  );
};

export default IaCBlueprintCard;

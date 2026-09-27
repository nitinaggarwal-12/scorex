import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiClock,
  FiBarChart2,
  FiDownload,
  FiShare2,
  FiFilter
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';
import * as assessmentService from '../services/assessmentService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #e0e7ff 0%, #f3f4f6 50%, #ffffff 100%);
  position: relative;
  padding: 100px 40px 40px 40px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
    z-index: 0;
    pointer-events: none;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 88px 20px 20px 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #3b82f6;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const KPICard = styled(motion.div)`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const KPILabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
`;

const KPIValue = styled.div`
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const KPITrend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
`;

const TableCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TableTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 16px 12px;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.$color || '#3b82f6'};
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'On Track': return '#d1fae5';
      case 'At Risk': return '#fef3c7';
      case 'Delayed': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'On Track': return '#065f46';
      case 'At Risk': return '#92400e';
      case 'Delayed': return '#991b1b';
      default: return '#374151';
    }
  }};
`;

const GapBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  margin: 2px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #374151;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  color: ${props => props.$active ? '#3b82f6' : '#6b7280'};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: -2px;
  transition: all 0.2s;

  &:hover {
    color: #3b82f6;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.125rem;
  color: #6b7280;
`;

// Main Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeRange, setTimeRange] = useState('6weeks');
  const [regionFilter, setRegionFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('');
  const [activeTab, setActiveTab] = useState('fastest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, regionFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('[Dashboard] Fetching dashboard data...');
      const response = await assessmentService.getDashboardStats();
      console.log('[Dashboard] Raw response:', response);
      console.log('[Dashboard] Response type:', typeof response);
      console.log('[Dashboard] Response keys:', Object.keys(response || {}));
      
      // The response might be wrapped in a data property
      const data = response?.data || response;
      console.log('[Dashboard] Extracted data:', data);
      console.log('[Dashboard] Total assessments:', data?.totalAssessments);
      
      setDashboardData(data);
      console.log('[Dashboard] State updated with data');
    } catch (error) {
      console.error('[Dashboard] Error fetching dashboard data:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      if (!dashboardData) {
        
        return;
      }

      // Create CSV content
      let csvContent = 'Dashboard Insights Export\n';
      csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;
      
      // KPIs Section
      csvContent += 'KEY PERFORMANCE INDICATORS\n';
      csvContent += 'Metric,Value,Trend\n';
      csvContent += `Total Assessments,${dashboardData.totalAssessments},${dashboardData.totalAssessmentsTrend > 0 ? '+' : ''}${dashboardData.totalAssessmentsTrend}\n`;
      csvContent += `Active Customers,${dashboardData.activeCustomers},${dashboardData.activeCustomersTrend > 0 ? '+' : ''}${dashboardData.activeCustomersTrend}\n`;
      csvContent += `Avg Completion Time,${dashboardData.avgCompletionTime} hrs,${dashboardData.avgCompletionTimeTrend}\n`;
      csvContent += `Avg Maturity Level,${dashboardData.avgMaturityLevel},${dashboardData.avgMaturityLevelTrend}\n`;
      csvContent += `Avg Improvement Potential,${dashboardData.avgImprovementPotential},${dashboardData.avgImprovementPotentialTrend}\n`;
      csvContent += `Feedback (NPS),${dashboardData.feedbackNPS},${dashboardData.feedbackNPSTrend}\n\n`;
      
      // Customer Portfolio Section
      csvContent += 'CUSTOMER PORTFOLIO\n';
      csvContent += 'Customer,Maturity,Target,Completion %,Key Gaps,Status\n';
      dashboardData.customerPortfolio?.forEach(customer => {
        csvContent += `"${customer.name}",${customer.maturity},${customer.target},${customer.completion},"${customer.keyGaps?.join(', ')}",${customer.status}\n`;
      });
      csvContent += '\n';
      
      // Weekly Completions Section
      csvContent += 'WEEKLY COMPLETIONS\n';
      csvContent += 'Week,Completed,Avg Hours\n';
      dashboardData.weeklyCompletions?.labels?.forEach((label, idx) => {
        csvContent += `${label},${dashboardData.weeklyCompletions.counts[idx]},${dashboardData.weeklyCompletions.avgHours[idx]}\n`;
      });
      csvContent += '\n';
      
      // Pillar Maturity Section
      csvContent += 'PILLAR MATURITY\n';
      csvContent += 'Pillar,Current,Target\n';
      const pillarNames = ['Platform', 'Data Eng', 'Analytics', 'ML/MLOps', 'GenAI', 'Ops'];
      pillarNames.forEach((name, idx) => {
        csvContent += `${name},${dashboardData.avgMaturityByPillar?.current[idx]},${dashboardData.avgMaturityByPillar?.target[idx]}\n`;
      });
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `dashboard-insights-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      
    } catch (error) {
      console.error('Export error:', error);
      
    }
  };

  const handleShare = () => {
    try {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl);
      
    } catch (error) {
      console.error('Share error:', error);
      
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>Loading dashboard data...</LoadingContainer>
      </PageContainer>
    );
  }

  if (!dashboardData) {
    return (
      <PageContainer>
        <LoadingContainer>No data available</LoadingContainer>
      </PageContainer>
    );
  }

  // Prepare chart data
  const radarData = {
    labels: ['Platform', 'Data', 'Analytics', 'ML', 'GenAI', 'Ops'],
    datasets: [
      {
        label: 'Current',
        data: dashboardData.avgMaturityByPillar?.current || [3, 3.2, 2.8, 3.1, 2.9, 3.3],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Target',
        data: dashboardData.avgMaturityByPillar?.target || [4, 4.2, 3.8, 4.1, 3.9, 4.3],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      }
    ]
  };

  const completionTimeData = {
    labels: dashboardData.weeklyCompletions?.labels || ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    datasets: [
      {
        label: '# completed',
        data: dashboardData.weeklyCompletions?.counts || [6, 9, 12, 8, 15, 18],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'avg hours',
        data: dashboardData.weeklyCompletions?.avgHours || [3.2, 2.8, 2.6, 3.0, 2.5, 2.4],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        type: 'line',
        yAxisID: 'y1',
      }
    ]
  };

  return (
    <PageContainer>
      <Header>
        <PageTitle>Assessment Insights Dashboard</PageTitle>
        <ActionButtons>
          <ActionButton
            onClick={handleExport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiDownload size={16} />
            Export
          </ActionButton>
          <ActionButton
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiShare2 size={16} />
            Share
          </ActionButton>
        </ActionButtons>
      </Header>

      {/* Filters */}
      <Filters>
        <FilterGroup>
          <FiClock size={16} color="#6b7280" />
          <FilterLabel>Last 6 weeks</FilterLabel>
          <FilterSelect value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="1week">Last week</option>
            <option value="2weeks">Last 2 weeks</option>
            <option value="4weeks">Last 4 weeks</option>
            <option value="6weeks">Last 6 weeks</option>
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FiFilter size={16} color="#6b7280" />
          <FilterLabel>All regions</FilterLabel>
          <FilterSelect value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
            <option value="all">All regions</option>
            <option value="na">North America</option>
            <option value="emea">EMEA</option>
            <option value="apac">APAC</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Filter by customer or AE...</FilterLabel>
          <FilterSelect 
            value={customerFilter} 
            onChange={(e) => setCustomerFilter(e.target.value)}
          >
            <option value="">All</option>
            {dashboardData?.customerPortfolio?.map((customer, idx) => (
              <option key={idx} value={customer.name}>
                {customer.name}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <ActionButton 
          style={{ marginLeft: 'auto' }}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <FiFilter size={16} />
          {showAdvancedFilters ? 'Hide filters' : 'Advanced filters'}
        </ActionButton>
      </Filters>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ marginBottom: '16px', fontWeight: 600, color: '#111827', fontSize: '1rem' }}>
            Additional Filters
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <FilterLabel style={{ display: 'block', marginBottom: '8px' }}>
                Maturity Level Range
              </FilterLabel>
              <FilterSelect style={{ width: '100%' }}>
                <option value="all">All levels</option>
                <option value="1-2">Level 1-2 (Explore-Experiment)</option>
                <option value="3">Level 3 (Formalize)</option>
                <option value="4-5">Level 4-5 (Optimize-Transform)</option>
              </FilterSelect>
            </div>
            <div>
              <FilterLabel style={{ display: 'block', marginBottom: '8px' }}>
                Completion Status
              </FilterLabel>
              <FilterSelect style={{ width: '100%' }}>
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="stalled">Stalled</option>
              </FilterSelect>
            </div>
            <div>
              <FilterLabel style={{ display: 'block', marginBottom: '8px' }}>
                Improvement Potential
              </FilterLabel>
              <FilterSelect style={{ width: '100%' }}>
                <option value="all">All ranges</option>
                <option value="high">High (&gt; 2.0)</option>
                <option value="medium">Medium (1.0-2.0)</option>
                <option value="low">Low (&lt; 1.0)</option>
              </FilterSelect>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <ActionButton
                onClick={() => {
                  setTimeRange('6weeks');
                  setRegionFilter('all');
                  setCustomerFilter('');
                  setShowAdvancedFilters(false);
                  
                }}
                style={{ width: '100%' }}
              >
                Clear All Filters
              </ActionButton>
            </div>
          </div>
        </motion.div>
      )}

      {/* KPI Cards */}
      <KPIGrid>
        <KPICard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <KPILabel>Total Assessments</KPILabel>
          <KPIValue>
            {dashboardData.totalAssessments || 0}
            <KPITrend $positive={true}>
              <FiTrendingUp size={16} />
              {dashboardData.totalAssessmentsTrend || 12}
            </KPITrend>
          </KPIValue>
        </KPICard>

        <KPICard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <KPILabel>Active Customers</KPILabel>
          <KPIValue>
            {dashboardData.activeCustomers || 0}
            <KPITrend $positive={true}>
              <FiTrendingUp size={16} />
              {dashboardData.activeCustomersTrend || 4}
            </KPITrend>
          </KPIValue>
        </KPICard>

        <KPICard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <KPILabel>Avg Completion Time</KPILabel>
          <KPIValue>
            {dashboardData.avgCompletionTime || '2.8'} hrs
            <KPITrend $positive={false}>
              <FiTrendingDown size={16} />
              {dashboardData.avgCompletionTimeTrend || '0.3'}
            </KPITrend>
          </KPIValue>
        </KPICard>

        <KPICard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <KPILabel>Avg Maturity Level</KPILabel>
          <KPIValue>
            {dashboardData.avgMaturityLevel || '3.2'}
            <KPITrend $positive={true}>
              <FiTrendingUp size={16} />
              {dashboardData.avgMaturityLevelTrend || '0.2'}
            </KPITrend>
          </KPIValue>
        </KPICard>

        <KPICard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <KPILabel>Avg Improvement Potential</KPILabel>
          <KPIValue>
            +{dashboardData.avgImprovementPotential || '0.8'}
            <KPITrend $positive={true}>
              <FiTrendingUp size={16} />
              {dashboardData.avgImprovementPotentialTrend || '0.1'}
            </KPITrend>
          </KPIValue>
        </KPICard>

        <KPICard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <KPILabel>Feedback (NPS)</KPILabel>
          <KPIValue>
            {dashboardData.feedbackNPS || '8.6'}
            <KPITrend $positive={true}>
              <FiTrendingUp size={16} />
              {dashboardData.feedbackNPSTrend || '0.4'}
            </KPITrend>
          </KPIValue>
        </KPICard>
      </KPIGrid>

      {/* Charts */}
      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Average Maturity by Pillar</ChartTitle>
          <Radar
            data={radarData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                r: {
                  beginAtZero: true,
                  max: 5,
                  ticks: {
                    stepSize: 1
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </ChartCard>

        <ChartCard>
          <ChartTitle>Assessment Completions & Avg Time</ChartTitle>
          <Bar
            data={completionTimeData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: '# Completed'
                  }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Avg Hours'
                  },
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </ChartCard>
      </ChartsGrid>

      {/* Customer Portfolio Table */}
      <TableCard>
        <TableHeader>
          <TableTitle>Customer Portfolio</TableTitle>
          <ActionButton>
            <FiBarChart2 size={16} />
            Columns
          </ActionButton>
        </TableHeader>

        <Table>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Maturity</Th>
              <Th>Target</Th>
              <Th>Completion</Th>
              <Th>Key Gaps</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.customerPortfolio
              ?.filter(customer => !customerFilter || customer.name === customerFilter)
              ?.map((customer, index) => (
              <tr key={index} style={{ cursor: 'pointer' }} onClick={() => navigate(`/results/${customer.assessmentId}`)}>
                <Td style={{ fontWeight: 600 }}>{customer.name}</Td>
                <Td>{customer.maturity}</Td>
                <Td>{customer.target}</Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ProgressBar style={{ flex: 1 }}>
                      <ProgressFill
                        $percentage={customer.completion}
                        $color={
                          customer.completion >= 90 ? '#10b981' :
                          customer.completion >= 70 ? '#3b82f6' :
                          customer.completion >= 50 ? '#f59e0b' :
                          '#ef4444'
                        }
                      />
                    </ProgressBar>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', minWidth: '35px' }}>
                      {customer.completion}%
                    </span>
                  </div>
                </Td>
                <Td>
                  {customer.keyGaps?.map((gap, i) => (
                    <GapBadge key={i}>{gap}</GapBadge>
                  ))}
                </Td>
                <Td>
                  <StatusBadge $status={customer.status}>{customer.status}</StatusBadge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>

      {/* Bottom Section with Tabs */}
      <TableCard>
        <TabContainer>
          <Tab $active={activeTab === 'fastest'} onClick={() => setActiveTab('fastest')}>
            Fastest Completion
          </Tab>
          <Tab $active={activeTab === 'improvement'} onClick={() => setActiveTab('improvement')}>
            Biggest Improvement
          </Tab>
          <Tab $active={activeTab === 'stalled'} onClick={() => setActiveTab('stalled')}>
            Stalled Assessments
          </Tab>
        </TabContainer>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {dashboardData[activeTab]?.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/results/${item.assessmentId}`)}
            >
              <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </TableCard>

      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '24px' }}>
        Updated just now • Data source: Assessment Platform
      </div>
    </PageContainer>
  );
};

export default Dashboard;

// Force rebuild Mon Oct 27 00:48:10 EDT 2025

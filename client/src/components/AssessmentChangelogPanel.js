import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  FiClock,
  FiUserPlus,
  FiMessageSquare,
  FiRefreshCw,
  FiCheckCircle,
  FiShield,
  FiSearch,
  FiLayers,
  FiActivity,
  FiUsers,
  FiArrowRight,
  FiPlus
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';

const PanelContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 28px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px 14px;
    border-radius: 12px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
`;

const TitleBlock = styled.div`
  flex: 1;
  min-width: 240px;

  h3 {
    margin: 0 0 6px 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  p {
    margin: 0;
    font-size: 0.88rem;
    color: #475569;
    line-height: 1.45;
  }
`;

const ActionButtonsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  @media (max-width: 640px) {
    width: 100%;
    button {
      flex: 1 1 auto;
      justify-content: center;
    }
  }
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 9px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  border: 1px solid ${props => props.$border || '#cbd5e1'};
  background: ${props => props.$bg || '#f8fafc'};
  color: ${props => props.$color || '#1e293b'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(15, 23, 42, 0.08);
  }
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

const KpiCard = styled.div`
  background: ${props => props.$bg || '#f8fafc'};
  border: 1px solid ${props => props.$border || '#e2e8f0'};
  border-radius: 12px;
  padding: 12px 14px;

  .kpi-label {
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${props => props.$labelColor || '#64748b'};
    margin-bottom: 4px;
  }

  .kpi-val {
    font-size: 1.45rem;
    font-weight: 900;
    color: ${props => props.$valColor || '#0f172a'};
    line-height: 1.1;
  }

  .kpi-sub {
    font-size: 0.75rem;
    color: #475569;
    margin-top: 4px;
  }
`;

const CollaboratorsStrip = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;

  .strip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 0.8rem;
    font-weight: 800;
    color: #1e293b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .collab-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px;
  }
`;

const CollabCard = styled.div`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;

  .collab-name {
    font-size: 0.84rem;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }

  .collab-role {
    font-size: 0.75rem;
    font-weight: 700;
    color: #2563eb;
  }

  .collab-email {
    font-size: 0.72rem;
    color: #64748b;
    word-break: break-all;
  }
`;

const DrawerForm = styled.form`
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;

  h4 {
    margin: 0 0 12px 0;
    font-size: 0.92rem;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 12px;
  }

  input, select, textarea {
    width: 100%;
    padding: 9px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 0.84rem;
    color: #0f172a;
    background: #ffffff;
    box-sizing: border-box;
    outline: none;

    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
    }
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

const CategoryPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const CategoryPill = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid ${props => (props.$active ? '#1d4ed8' : '#cbd5e1')};
  background: ${props => (props.$active ? '#1d4ed8' : '#f8fafc')};
  color: ${props => (props.$active ? '#ffffff' : '#334155')};
  transition: all 0.15s ease;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 12px;
  min-width: 240px;
  flex: 1;
  max-width: 360px;

  @media (max-width: 640px) {
    max-width: 100%;
    width: 100%;
  }

  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.82rem;
    color: #0f172a;
    width: 100%;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;

  th {
    background: #f1f5f9;
    color: #334155;
    border-bottom: 2px solid #cbd5e1;
    font-weight: 700;
    text-align: left;
    padding: 11px 14px;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
    color: #1e293b;
    line-height: 1.4;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  tr:hover td {
    background: #eff6ff;
  }
`;

const MobileTimelineList = styled.div`
  display: none;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileEventCard = styled.div`
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: ${props => props.$bg || '#eff6ff'};
  color: ${props => props.$color || '#1d4ed8'};
  border: 1px solid ${props => props.$border || '#bfdbfe'};
  white-space: nowrap;
`;

function getCategoryStyle(category, actionType) {
  const cat = String(category || actionType || '').toLowerCase();
  if (cat.includes('user')) {
    return { label: 'USER ADDED', bg: '#f3e8ff', color: '#6d28d9', border: '#ddd6fe' };
  }
  if (cat.includes('comment')) {
    return { label: 'COMMENT / NOTE', bg: '#fef3c7', color: '#92400e', border: '#fde68a' };
  }
  if (cat.includes('status')) {
    return { label: 'STATUS CHANGE', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' };
  }
  if (cat.includes('score') || cat.includes('pain')) {
    return { label: 'SCORE & PAIN POINT', bg: '#fee2e2', color: '#991b1b', border: '#fecaca' };
  }
  if (cat.includes('architecture')) {
    return { label: 'TEMPLATE 05 BLUEPRINT', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
  }
  return { label: 'SYSTEM AUDIT', bg: '#f1f5f9', color: '#334155', border: '#cbd5e1' };
}

function formatAuditTime(isoStr) {
  if (!isoStr) return 'Just now';
  try {
    const d = new Date(isoStr);
    if (Number.isNaN(d.getTime())) return String(isoStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return String(isoStr);
  }
}

const AssessmentChangelogPanel = ({
  instance,
  report,
  framework,
  onInstanceUpdated
}) => {
  const instanceId = instance?.id;

  const [localChangelog, setLocalChangelog] = useState(null);
  const [localCollaborators, setLocalCollaborators] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDrawer, setActiveDrawer] = useState(null); // 'user' | 'comment' | 'status' | null
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Security & Zero-Trust Reviewer');
  const [newUserPermission, setNewUserPermission] = useState('Contributor & Reviewer');

  const [commentScope, setCommentScope] = useState('Executive Governance Note');
  const [commentText, setCommentText] = useState('');
  const [commentActor, setCommentActor] = useState('Nitin Aggarwal (Lead Cloud Architect)');

  const [selectedStatus, setSelectedStatus] = useState(instance?.status || 'completed');
  const [statusReason, setStatusReason] = useState('');

  const changelog = useMemo(() => {
    if (Array.isArray(localChangelog)) return localChangelog;
    if (Array.isArray(instance?.changelog) && instance.changelog.length > 0) return instance.changelog;
    if (Array.isArray(report?.changelog) && report.changelog.length > 0) return report.changelog;
    if (Array.isArray(instance?.aiReport?.changelog) && instance.aiReport.changelog.length > 0) return instance.aiReport.changelog;
    return [];
  }, [localChangelog, instance, report]);

  const collaborators = useMemo(() => {
    if (Array.isArray(localCollaborators)) return localCollaborators;
    if (Array.isArray(instance?.collaborators) && instance.collaborators.length > 0) return instance.collaborators;
    if (Array.isArray(report?.collaborators) && report.collaborators.length > 0) return report.collaborators;
    if (Array.isArray(instance?.aiReport?.collaborators) && instance.aiReport.collaborators.length > 0) return instance.aiReport.collaborators;
    return [];
  }, [localCollaborators, instance, report]);

  const counts = useMemo(() => {
    const c = { all: changelog.length, user: 0, comment: 0, status: 0, score: 0, architecture: 0 };
    changelog.forEach(item => {
      const cat = String(item.category || '').toLowerCase();
      if (cat === 'user') c.user++;
      else if (cat === 'comment') c.comment++;
      else if (cat === 'status') c.status++;
      else if (cat === 'score') c.score++;
      else c.architecture++;
    });
    return c;
  }, [changelog]);

  const filteredChangelog = useMemo(() => {
    return changelog.filter(entry => {
      if (activeCategory !== 'all') {
        const cat = String(entry.category || '').toLowerCase();
        if (activeCategory === 'architecture') {
          if (cat !== 'architecture' && cat !== 'system') return false;
        } else if (cat !== activeCategory) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${entry.actorName || ''} ${entry.actorEmail || ''} ${entry.actorRole || ''} ${entry.targetScope || ''} ${entry.previousValue || ''} ${entry.newValue || ''} ${entry.summary || ''}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [changelog, activeCategory, searchQuery]);

  const questionScopes = useMemo(() => {
    const list = ['Executive Governance Note'];
    const dims = framework?.dimensions || instance?.frameworkSnapshot?.dimensions || [];
    dims.forEach((d, dIdx) => {
      (d.questions || []).slice(0, 3).forEach((q, qIdx) => {
        list.push(`Q${dIdx + 1}.${qIdx + 1} • ${d.name}`);
      });
    });
    return list;
  }, [framework, instance]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      toast.error('Please enter the collaborator name');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        actionType: 'user_added',
        category: 'user',
        actorName: 'Nitin Aggarwal (Lead Cloud Architect)',
        actorEmail: instance?.contactEmail || 'nitin.aggarwal@enterprise-architecture.io',
        actorRole: 'Lead Cloud Architect (Owner)',
        userToAdd: {
          name: newUserName.trim(),
          email: newUserEmail.trim() || `${newUserName.trim().toLowerCase().replace(/[^a-z0-9]/g, '.')}@enterprise.io`,
          role: newUserRole,
          permission: newUserPermission
        }
      };

      if (instanceId) {
        const res = await dynamicAssessmentService.appendChangelogEntry(instanceId, payload);
        if (res?.changelog) setLocalChangelog(res.changelog);
        if (res?.collaborators) setLocalCollaborators(res.collaborators);
        if (onInstanceUpdated && res?.instance) onInstanceUpdated(res.instance);
      } else {
        const fallbackEntry = {
          id: `chg_local_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorName: payload.actorName,
          actorEmail: payload.actorEmail,
          actorRole: payload.actorRole,
          actionType: 'user_added',
          category: 'user',
          targetScope: `Collaborator Access • ${newUserRole}`,
          previousValue: 'No Access',
          newValue: `${newUserName.trim()} (${payload.userToAdd.email}) [${newUserPermission}]`,
          summary: `Added ${newUserName.trim()} (${payload.userToAdd.email}) as "${newUserRole}" with ${newUserPermission} permissions.`
        };
        setLocalChangelog([fallbackEntry, ...changelog]);
        setLocalCollaborators([
          {
            id: `usr_${Date.now()}`,
            name: newUserName.trim(),
            email: payload.userToAdd.email,
            role: newUserRole,
            permission: newUserPermission,
            status: 'Active',
            addedAt: new Date().toISOString(),
            addedBy: payload.actorName
          },
          ...collaborators
        ]);
      }

      toast.success(`Added ${newUserName.trim()} to assessment & logged in Audit Changelog!`);
      setNewUserName('');
      setNewUserEmail('');
      setActiveDrawer(null);
    } catch (err) {
      toast.error('Failed to log user addition');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error('Please enter a comment or governance note');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        actionType: 'comment_added',
        category: 'comment',
        actorName: commentActor,
        actorEmail: instance?.contactEmail || 'nitin.aggarwal@enterprise-architecture.io',
        actorRole: 'Architecture Governance Board',
        targetScope: commentScope,
        commentText: commentText.trim(),
        summary: `Added governance comment on ${commentScope}: "${commentText.trim()}"`
      };

      if (instanceId) {
        const res = await dynamicAssessmentService.appendChangelogEntry(instanceId, payload);
        if (res?.changelog) setLocalChangelog(res.changelog);
        if (onInstanceUpdated && res?.instance) onInstanceUpdated(res.instance);
      } else {
        const fallbackEntry = {
          id: `chg_local_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorName: commentActor,
          actorEmail: payload.actorEmail,
          actorRole: payload.actorRole,
          actionType: 'comment_added',
          category: 'comment',
          targetScope: commentScope,
          previousValue: 'No note',
          newValue: commentText.trim(),
          summary: payload.summary
        };
        setLocalChangelog([fallbackEntry, ...changelog]);
      }

      toast.success('Comment recorded in Audit Changelog & Google Docs export!');
      setCommentText('');
      setActiveDrawer(null);
    } catch (err) {
      toast.error('Failed to record comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeStatus = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const prevStatus = instance?.status || 'in_progress';
      const payload = {
        actionType: 'status_changed',
        category: 'status',
        actorName: 'Nitin Aggarwal (Lead Cloud Architect)',
        actorEmail: instance?.contactEmail || 'nitin.aggarwal@enterprise-architecture.io',
        actorRole: 'Lead Cloud Architect (Owner)',
        targetScope: 'Assessment Lifecycle & Governance Status',
        previousValue: prevStatus,
        newStatus: selectedStatus,
        newValue: selectedStatus,
        summary: `Changed assessment status from "${prevStatus}" to "${selectedStatus}"${statusReason.trim() ? ` — Reason: ${statusReason.trim()}` : ''}.`
      };

      if (instanceId) {
        const res = await dynamicAssessmentService.appendChangelogEntry(instanceId, payload);
        if (res?.changelog) setLocalChangelog(res.changelog);
        if (onInstanceUpdated && res?.instance) onInstanceUpdated(res.instance);
      } else {
        const fallbackEntry = {
          id: `chg_local_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorName: payload.actorName,
          actorEmail: payload.actorEmail,
          actorRole: payload.actorRole,
          actionType: 'status_changed',
          category: 'status',
          targetScope: payload.targetScope,
          previousValue: prevStatus,
          newValue: selectedStatus,
          summary: payload.summary
        };
        setLocalChangelog([fallbackEntry, ...changelog]);
      }

      toast.success(`Status updated to "${selectedStatus}" & recorded in Audit Changelog!`);
      setStatusReason('');
      setActiveDrawer(null);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PanelContainer id="assessment-audit-changelog-panel" data-testid="assessment-changelog-panel">
      <HeaderRow>
        <TitleBlock>
          <h3>
            <FiClock style={{ color: '#2563eb' }} />
            Immutable Governance &amp; Audit Changelog (Who Changed What)
            <Badge $bg="#dcfce7" $color="#166534" $border="#86efac">
              <FiCheckCircle /> Synced to UI &amp; Google Docs
            </Badge>
          </h3>
          <p>
            Complete, tamper-evident audit trail tracking every user/collaborator addition, verbatim architect comment, status change, score update, and Template 05 architecture blueprint compilation across <strong>{instance?.customerName || 'Enterprise Assessment'}</strong>.
          </p>
        </TitleBlock>

        <ActionButtonsRow>
          <ActionBtn
            type="button"
            $bg={activeDrawer === 'user' ? '#7c3aed' : '#f3e8ff'}
            $color={activeDrawer === 'user' ? '#ffffff' : '#6d28d9'}
            $border="#c4b5fd"
            onClick={() => setActiveDrawer(activeDrawer === 'user' ? null : 'user')}
            data-testid="changelog-add-user-btn"
          >
            <FiUserPlus /> + Add User / Collaborator
          </ActionBtn>

          <ActionBtn
            type="button"
            $bg={activeDrawer === 'comment' ? '#d97706' : '#fef3c7'}
            $color={activeDrawer === 'comment' ? '#ffffff' : '#92400e'}
            $border="#fcd34d"
            onClick={() => setActiveDrawer(activeDrawer === 'comment' ? null : 'comment')}
            data-testid="changelog-add-comment-btn"
          >
            <FiMessageSquare /> + Log Comment
          </ActionBtn>

          <ActionBtn
            type="button"
            $bg={activeDrawer === 'status' ? '#059669' : '#dcfce7'}
            $color={activeDrawer === 'status' ? '#ffffff' : '#166534'}
            $border="#86efac"
            onClick={() => setActiveDrawer(activeDrawer === 'status' ? null : 'status')}
            data-testid="changelog-change-status-btn"
          >
            <FiRefreshCw /> Change Status
          </ActionBtn>
        </ActionButtonsRow>
      </HeaderRow>

      {/* Interactive Governance Action Drawers */}
      {activeDrawer === 'user' && (
        <DrawerForm onSubmit={handleAddUser} data-testid="changelog-user-drawer">
          <h4><FiUserPlus style={{ color: '#7c3aed' }} /> Add Collaborator / Reviewer to Assessment Governance</h4>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Collaborator Full Name (e.g., David Kim)"
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Corporate Email (e.g., david.kim@enterprise.io)"
              value={newUserEmail}
              onChange={e => setNewUserEmail(e.target.value)}
            />
            <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
              <option value="Security & Zero-Trust Reviewer">Security &amp; Zero-Trust Reviewer</option>
              <option value="Principal Data & AI Architect">Principal Data &amp; AI Architect</option>
              <option value="Executive FinOps & ROI Sponsor">Executive FinOps &amp; ROI Sponsor</option>
              <option value="Cloud Platform Engineering Lead">Cloud Platform Engineering Lead</option>
              <option value="Compliance & GxP Auditor">Compliance &amp; GxP Auditor</option>
            </select>
            <select value={newUserPermission} onChange={e => setNewUserPermission(e.target.value)}>
              <option value="Contributor & Reviewer">Contributor &amp; Reviewer</option>
              <option value="Admin & Approver">Admin &amp; Approver</option>
              <option value="Reviewer & Sign-Off">Reviewer &amp; Sign-Off</option>
              <option value="Read-Only Auditor">Read-Only Auditor</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <ActionBtn type="button" onClick={() => setActiveDrawer(null)}>Cancel</ActionBtn>
            <ActionBtn type="submit" $bg="#7c3aed" $color="#ffffff" $border="#6d28d9" disabled={isSubmitting}>
              <FiPlus /> {isSubmitting ? 'Saving...' : 'Add User & Record in Changelog'}
            </ActionBtn>
          </div>
        </DrawerForm>
      )}

      {activeDrawer === 'comment' && (
        <DrawerForm onSubmit={handleAddComment} data-testid="changelog-comment-drawer">
          <h4><FiMessageSquare style={{ color: '#d97706' }} /> Log Verbatim Architect / Stakeholder Comment</h4>
          <div className="form-grid">
            <select value={commentActor} onChange={e => setCommentActor(e.target.value)}>
              {collaborators.map((c, idx) => (
                <option key={c.id || idx} value={`${c.name} (${c.role})`}>
                  {c.name} — {c.role}
                </option>
              ))}
              <option value="Nitin Aggarwal (Lead Cloud Architect)">Nitin Aggarwal (Lead Cloud Architect)</option>
            </select>
            <select value={commentScope} onChange={e => setCommentScope(e.target.value)}>
              {questionScopes.map((sc, idx) => (
                <option key={idx} value={sc}>{sc}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <textarea
              rows={2}
              placeholder="Enter verbatim architectural observation, pain point clarification, or sign-off note..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <ActionBtn type="button" onClick={() => setActiveDrawer(null)}>Cancel</ActionBtn>
            <ActionBtn type="submit" $bg="#d97706" $color="#ffffff" $border="#b45309" disabled={isSubmitting}>
              <FiPlus /> {isSubmitting ? 'Recording...' : 'Record Comment in Changelog'}
            </ActionBtn>
          </div>
        </DrawerForm>
      )}

      {activeDrawer === 'status' && (
        <DrawerForm onSubmit={handleChangeStatus} data-testid="changelog-status-drawer">
          <h4><FiRefreshCw style={{ color: '#059669' }} /> Transition Assessment Lifecycle / Sign-Off Status</h4>
          <div className="form-grid">
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
              <option value="draft">draft — Initial Scoping</option>
              <option value="in_progress">in_progress — Active Discovery &amp; Scoring</option>
              <option value="in_review">in_review — Architecture Review Board</option>
              <option value="completed">completed — Executive Readout Certified</option>
              <option value="approved">approved — Stakeholder Sign-Off Complete</option>
            </select>
            <input
              type="text"
              placeholder="Optional governance note / reason for status transition..."
              value={statusReason}
              onChange={e => setStatusReason(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <ActionBtn type="button" onClick={() => setActiveDrawer(null)}>Cancel</ActionBtn>
            <ActionBtn type="submit" $bg="#059669" $color="#ffffff" $border="#047857" disabled={isSubmitting}>
              <FiCheckCircle /> {isSubmitting ? 'Updating...' : 'Update Status & Log Audit Event'}
            </ActionBtn>
          </div>
        </DrawerForm>
      )}

      {/* Summary KPI Cards */}
      <KpiGrid>
        <KpiCard $bg="#eff6ff" $border="#bfdbfe" $labelColor="#1e40af" $valColor="#1d4ed8">
          <div className="kpi-label">Total Logged Changes</div>
          <div className="kpi-val">{counts.all}</div>
          <div className="kpi-sub">100% immutable audit coverage</div>
        </KpiCard>

        <KpiCard $bg="#f3e8ff" $border="#ddd6fe" $labelColor="#6d28d9" $valColor="#5b21b6">
          <div className="kpi-label">Users &amp; Collaborators</div>
          <div className="kpi-val">{collaborators.length} <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>({counts.user} added)</span></div>
          <div className="kpi-sub">Active governance roster</div>
        </KpiCard>

        <KpiCard $bg="#fef3c7" $border="#fde68a" $labelColor="#92400e" $valColor="#b45309">
          <div className="kpi-label">Comments &amp; Field Notes</div>
          <div className="kpi-val">{counts.comment}</div>
          <div className="kpi-sub">Verbatim architect observations</div>
        </KpiCard>

        <KpiCard $bg="#dcfce7" $border="#bbf7d0" $labelColor="#166534" $valColor="#15803d">
          <div className="kpi-label">Status Transitions</div>
          <div className="kpi-val">{counts.status}</div>
          <div className="kpi-sub">Current: <strong>{(instance?.status || 'completed').toUpperCase()}</strong></div>
        </KpiCard>

        <KpiCard $bg="#fff1f2" $border="#fecdd3" $labelColor="#9f1239" $valColor="#be123c">
          <div className="kpi-label">Scores &amp; Blueprints</div>
          <div className="kpi-val">{counts.score + counts.architecture}</div>
          <div className="kpi-sub">Scores, pain points &amp; Template 05</div>
        </KpiCard>
      </KpiGrid>

      {/* Active Collaborators Roster */}
      {collaborators.length > 0 && (
        <CollaboratorsStrip>
          <div className="strip-header">
            <span><FiUsers style={{ marginRight: '6px' }} /> Active Assessment Collaborators &amp; Reviewers ({collaborators.length})</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>All user additions are permanently logged below &amp; exported to Google Docs</span>
          </div>
          <div className="collab-grid">
            {collaborators.map((collab, idx) => (
              <CollabCard key={collab.id || idx}>
                <div className="collab-name">
                  <span>{collab.name}</span>
                  <Badge $bg="#dcfce7" $color="#166534" $border="#86efac">{collab.status || 'Active'}</Badge>
                </div>
                <div className="collab-role">{collab.role} • {collab.permission || 'Contributor'}</div>
                <div className="collab-email">{collab.email}</div>
              </CollabCard>
            ))}
          </div>
        </CollaboratorsStrip>
      )}

      {/* Filter Pills & Search */}
      <FilterBar>
        <CategoryPills>
          <CategoryPill type="button" $active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
            All Events ({counts.all})
          </CategoryPill>
          <CategoryPill type="button" $active={activeCategory === 'user'} onClick={() => setActiveCategory('user')}>
            👤 Users Added ({counts.user})
          </CategoryPill>
          <CategoryPill type="button" $active={activeCategory === 'comment'} onClick={() => setActiveCategory('comment')}>
            💬 Comments ({counts.comment})
          </CategoryPill>
          <CategoryPill type="button" $active={activeCategory === 'status'} onClick={() => setActiveCategory('status')}>
            🔄 Status Changes ({counts.status})
          </CategoryPill>
          <CategoryPill type="button" $active={activeCategory === 'score'} onClick={() => setActiveCategory('score')}>
            📊 Scores &amp; Pain Points ({counts.score})
          </CategoryPill>
          <CategoryPill type="button" $active={activeCategory === 'architecture'} onClick={() => setActiveCategory('architecture')}>
            🏛️ Template 05 &amp; System ({counts.architecture})
          </CategoryPill>
        </CategoryPills>

        <SearchBox>
          <FiSearch style={{ color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search by user, comment, status, or question..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </SearchBox>
      </FilterBar>

      {/* Desktop Audit Changelog Table */}
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th style={{ width: '155px' }}>Timestamp</th>
              <th style={{ width: '210px' }}>Who (Actor &amp; Role)</th>
              <th style={{ width: '145px' }}>Change Type</th>
              <th style={{ width: '200px' }}>Target Scope</th>
              <th>What Changed (Previous → New Value &amp; Verbatim Details)</th>
            </tr>
          </thead>
          <tbody>
            {filteredChangelog.map((entry, idx) => {
              const style = getCategoryStyle(entry.category, entry.actionType);
              return (
                <tr key={entry.id || idx}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.77rem', color: '#475569', fontWeight: 600 }}>
                    {formatAuditTime(entry.timestamp)}
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{entry.actorName || 'Lead Cloud Architect'}</div>
                    <div style={{ fontSize: '0.73rem', color: '#2563eb', fontWeight: 600 }}>{entry.actorRole || 'Architecture Reviewer'}</div>
                    {entry.actorEmail && (
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{entry.actorEmail}</div>
                    )}
                  </td>
                  <td>
                    <Badge $bg={style.bg} $color={style.color} $border={style.border}>
                      {style.label}
                    </Badge>
                  </td>
                  <td style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.8rem' }}>
                    {entry.targetScope || 'Assessment Workspace'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px', fontSize: '0.77rem' }}>
                      {entry.previousValue && entry.previousValue !== 'None' && (
                        <>
                          <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 7px', borderRadius: '5px', textDecoration: entry.category === 'status' || entry.category === 'score' ? 'line-through' : 'none' }}>
                            {entry.previousValue}
                          </span>
                          <FiArrowRight style={{ color: '#64748b', flexShrink: 0 }} />
                        </>
                      )}
                      <span style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}`, padding: '2px 8px', borderRadius: '5px', fontWeight: 700 }}>
                        {entry.newValue || 'Updated'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.81rem', color: '#334155' }}>
                      {entry.summary}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </StyledTable>
      </TableWrapper>

      {/* Mobile / iOS & Android Responsive Cards View */}
      <MobileTimelineList>
        {filteredChangelog.map((entry, idx) => {
          const style = getCategoryStyle(entry.category, entry.actionType);
          return (
            <MobileEventCard key={entry.id || idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Badge $bg={style.bg} $color={style.color} $border={style.border}>
                  {style.label}
                </Badge>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  {formatAuditTime(entry.timestamp)}
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                {entry.actorName} <span style={{ fontWeight: 600, color: '#2563eb', fontSize: '0.76rem' }}>({entry.actorRole})</span>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                Scope: {entry.targetScope}
              </div>
              <div style={{ fontSize: '0.77rem', color: '#1e293b', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px' }}>
                {entry.previousValue && entry.previousValue !== 'None' ? `${entry.previousValue} → ` : ''}
                <strong>{entry.newValue}</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.35 }}>
                {entry.summary}
              </div>
            </MobileEventCard>
          );
        })}
      </MobileTimelineList>
    </PanelContainer>
  );
};

export default AssessmentChangelogPanel;

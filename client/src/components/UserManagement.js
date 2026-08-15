import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FiUsers, FiUserPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSearch, FiFilter, FiSend } from 'react-icons/fi';
import authService from '../services/authService';
import toast from 'react-hot-toast';

// Use relative URL in production (Railway), localhost in development
const API_URL = (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

// =====================
// STYLED COMPONENTS
// =====================

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100px 20px 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: white url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>') no-repeat 14px center;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FilterButton = styled.button`
  padding: 12px 20px;
  background: ${props => props.$active ? '#667eea' : 'white'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  border: 2px solid ${props => props.$active ? '#667eea' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$active ? '#5568d3' : '#f1f5f9'};
    border-color: ${props => props.$active ? '#5568d3' : '#cbd5e1'};
  }
`;

const ButtonGroupWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const CreateButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
`;

const AssignButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
`;

const TestUserButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const UserCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
`;

const UserEmail = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

const RoleBadge = styled.span`
  padding: 6px 12px;
  background: ${props => {
    if (props.$role === 'admin') return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    if (props.$role === 'author') return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  }};
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`;

const DetailLabel = styled.span`
  color: #64748b;
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: #1e293b;
  font-weight: 600;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  background: ${props => props.$active ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.$active ? '#166534' : '#991b1b'};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const UserActions = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 16px;
  background: ${props => props.$danger ? '#fee2e2' : '#f1f5f9'};
  color: ${props => props.$danger ? '#dc2626' : '#475569'};
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$danger ? '#fecaca' : '#e2e8f0'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  
  &:hover {
    color: #1e293b;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  background: ${props => props.$secondary ? '#f1f5f9' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${props => props.$secondary ? '#475569' : 'white'};
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  background: white;
  border-radius: 12px;
  padding: 60px 32px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
`;

// =====================
// COMPONENT
// =====================

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organization: '',
    role: 'consumer'
  });

  // Get current user role
  const currentUser = authService.getUser();
  const isAdmin = currentUser?.role === 'admin';
  const isAuthor = currentUser?.role === 'author';

  useEffect(() => {
    // Small delay to ensure axios interceptor has session ID
    const timer = setTimeout(() => {
      if (authService.isAuthenticated()) {
        fetchUsers();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authService.getAllUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      
      return;
    }

    try {
      await authService.register(formData);
      
      setShowCreateModal(false);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        organization: '',
        role: 'consumer'
      });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      
    }
  };

  const handleCreateTestUser = async () => {
    // Generate random test data
    const firstNames = ['Alex', 'Jordan', 'Morgan', 'Casey', 'Taylor', 'Jamie', 'Riley', 'Sam', 'Quinn', 'Avery'];
    const lastNames = ['Anderson', 'Brown', 'Chen', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris', 'Jackson', 'Kumar'];
    const companies = ['TechCorp', 'DataCo', 'CloudSystems', 'InnovateLabs', 'Digital Solutions', 'Analytics Inc', 'AI Ventures', 'SmartData', 'BizTech', 'Enterprise Co'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@${company.toLowerCase().replace(/\s+/g, '')}.com`;
    
    const testUserData = {
      email: email,
      password: 'password123',
      firstName: firstName,
      lastName: lastName,
      organization: company,
      role: 'consumer'
    };

    try {
      await authService.register(testUserData);
      
      fetchUsers();
    } catch (error) {
      console.error('Error creating test user:', error);
      
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      // Note: We need to add a delete endpoint to authService
      const sessionId = localStorage.getItem('sessionId');
      const response = await fetch(`${API_URL}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-session-id': sessionId
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '', // Don't populate password
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      organization: user.organization || '',
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    
    try {
      const sessionId = localStorage.getItem('sessionId');
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        organization: formData.organization,
        role: formData.role
      };

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`${API_URL}/auth/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }
      
      
      setShowEditModal(false);
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        organization: '',
        role: 'consumer'
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <div style={{ textAlign: 'center', color: 'white', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Loading users...</h2>
          </div>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>
            <FiUsers />
            {isAuthor ? 'My Consumers' : 'User Management'}
          </Title>
          <Subtitle>
            {isAuthor 
              ? 'Manage consumers and assign assessments' 
              : 'Manage user accounts, roles, and permissions'}
          </Subtitle>
          
          <ActionBar>
            <SearchBar>
              <SearchInput
                type="text"
                placeholder="Search by name, email, or organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBar>
            
            {!isAuthor && (
              <>
                <FilterButton
                  $active={roleFilter === 'all'}
                  onClick={() => setRoleFilter('all')}
                >
                  All Users ({users.length})
                </FilterButton>
                
                <FilterButton
                  $active={roleFilter === 'admin'}
                  onClick={() => setRoleFilter('admin')}
                >
                  Admins ({users.filter(u => u.role === 'admin').length})
                </FilterButton>
                
                <FilterButton
                  $active={roleFilter === 'author'}
                  onClick={() => setRoleFilter('author')}
                >
                  Authors ({users.filter(u => u.role === 'author').length})
                </FilterButton>
              </>
            )}
            
            <FilterButton
              $active={roleFilter === 'consumer' || (isAuthor && roleFilter === 'all')}
              onClick={() => setRoleFilter('consumer')}
            >
              Consumers ({users.filter(u => u.role === 'consumer').length})
            </FilterButton>
            
            <ButtonGroupWrapper>
              <AssignButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/assign-assessment')}
              >
                <FiSend />
                Assign Assessment
              </AssignButton>
              
              {isAdmin && (
                <>
                  <TestUserButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateTestUser}
                  >
                    <FiUserPlus />
                    Create Test User
                  </TestUserButton>
                  <CreateButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)}
                  >
                    <FiUserPlus />
                    Create User
                  </CreateButton>
                </>
              )}
            </ButtonGroupWrapper>
          </ActionBar>
        </Header>

        {filteredUsers.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyTitle>No users found</EmptyTitle>
            <EmptyText>
              {searchQuery || roleFilter !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Create your first user to get started'}
            </EmptyText>
          </EmptyState>
        ) : (
          <UsersGrid>
            {filteredUsers.map((user, index) => (
              <UserCard
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <UserHeader>
                  <UserInfo>
                    <UserName>
                      {user.first_name || user.firstName} {user.last_name || user.lastName}
                    </UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserInfo>
                  <RoleBadge $role={user.role}>{user.role}</RoleBadge>
                </UserHeader>
                
                <UserDetails>
                  <DetailRow>
                    <DetailLabel>Organization</DetailLabel>
                    <DetailValue>{user.organization || 'Not specified'}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Status</DetailLabel>
                    <StatusBadge $active={user.is_active}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Created</DetailLabel>
                    <DetailValue>
                      {new Date(user.created_at).toLocaleDateString()}
                    </DetailValue>
                  </DetailRow>
                </UserDetails>
                
                <UserActions>
                  {isAdmin && (
                    <>
                      <ActionButton onClick={() => openEditModal(user)}>
                        <FiEdit2 size={14} />
                        Edit
                      </ActionButton>
                      <ActionButton
                        $danger
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === 'admin'}
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </ActionButton>
                    </>
                  )}
                </UserActions>
              </UserCard>
            ))}
          </UsersGrid>
        )}

        {/* Create User Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
            >
              <ModalContent
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle>Create New User</ModalTitle>
                  <CloseButton onClick={() => setShowCreateModal(false)}>
                    <FiX size={24} />
                  </CloseButton>
                </ModalHeader>
                
                <Form onSubmit={handleCreateUser}>
                  <FormGroup>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Password *</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Organization</Label>
                    <Input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Role *</Label>
                    <Select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    >
                      <option value="consumer">Consumer (Customer)</option>
                      <option value="author">Author (Can create & assign assessments)</option>
                      <option value="admin">Admin (Full access)</option>
                    </Select>
                  </FormGroup>
                  
                  <ButtonGroup>
                    <Button type="button" $secondary onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create User
                    </Button>
                  </ButtonGroup>
                </Form>
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>

        {/* Edit User Modal */}
        <AnimatePresence>
          {showEditModal && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
            >
              <ModalContent
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle>Edit User</ModalTitle>
                  <CloseButton onClick={() => setShowEditModal(false)}>
                    <FiX size={24} />
                  </CloseButton>
                </ModalHeader>
                
                <Form onSubmit={handleEditUser}>
                  <FormGroup>
                    <Label>Email (cannot be changed)</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      disabled
                      style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>New Password (leave blank to keep current)</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      minLength={6}
                      placeholder="Leave blank to keep current password"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Organization</Label>
                    <Input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Role *</Label>
                    <Select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                      disabled={editingUser?.role === 'admin'}
                    >
                      <option value="consumer">Consumer</option>
                      <option value="author">Author</option>
                      <option value="admin">Admin</option>
                    </Select>
                    {editingUser?.role === 'admin' && (
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
                        Admin role cannot be changed
                      </div>
                    )}
                  </FormGroup>
                  
                  <ButtonGroup>
                    <Button type="button" $secondary onClick={() => setShowEditModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" $primary>
                      <FiCheck size={16} />
                      Update User
                    </Button>
                  </ButtonGroup>
                </Form>
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </PageContainer>
  );
};

export default UserManagement;


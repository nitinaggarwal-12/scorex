import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiBarChart2,
  FiBook,
  FiChevronDown,
  FiCompass,
  FiFileText,
  FiLayers,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiPlay,
  FiSend,
  FiUser,
  FiUsers,
  FiX
} from 'react-icons/fi';
import authService from '../services/authService';
import LoginModal from './LoginModal';

const Nav = styled.nav`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 1000;
  background: rgba(255,255,255,.94);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid #e2e8f0;
`;

const Inner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 12px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  @media (max-width: 760px) { padding: 10px 16px; }
`;

const Brand = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
  color: #0f172a;
  font-size: 1.08rem;
  font-weight: 900;
  letter-spacing: -.03em;
`;

const Mark = styled.span`
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
  box-shadow: 0 4px 12px rgba(37,99,235,.25);
`;

const Desktop = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
  justify-content: center;
  @media (max-width: 980px) { display: none; }
`;

const NavButton = styled.button`
  border: 0;
  background: ${props => props.$active ? '#f1f5f9' : 'transparent'};
  color: ${props => props.$active ? '#0f172a' : '#475569'};
  border-radius: 9px;
  padding: 9px 11px;
  font-size: .82rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  &:hover { background: #f8fafc; color: #1d4ed8; }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  @media (max-width: 980px) { display: none; }
`;

const CTA = styled.button`
  border: 1px solid ${props => props.$primary ? '#2563eb' : '#cbd5e1'};
  background: ${props => props.$primary ? '#2563eb' : '#fff'};
  color: ${props => props.$primary ? '#fff' : '#334155'};
  border-radius: 9px;
  padding: 9px 12px;
  font-size: .8rem;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  white-space: nowrap;
`;

const Dropdown = styled.div`
  position: relative;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 245px;
  padding: 7px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 14px 36px rgba(15,23,42,.12);
  display: ${props => props.$open ? 'grid' : 'none'};
  gap: 3px;
`;

const MenuButton = styled.button`
  border: 0;
  background: transparent;
  color: #334155;
  border-radius: 8px;
  padding: 10px 11px;
  display: flex;
  align-items: center;
  gap: 9px;
  text-align: left;
  cursor: pointer;
  font-size: .8rem;
  font-weight: 700;
  &:hover { background: #f8fafc; color: #1d4ed8; }
`;

const MenuLabel = styled.div`
  padding: 7px 10px 4px;
  color: #94a3b8;
  font-size: .65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .05em;
`;

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 4px 2px;
`;

const MobileToggle = styled.button`
  display: none;
  border: 0;
  background: transparent;
  color: #334155;
  font-size: 1.45rem;
  cursor: pointer;
  @media (max-width: 980px) { display: grid; place-items: center; }
`;

const Mobile = styled.div`
  display: none;
  @media (max-width: 980px) {
    display: ${props => props.$open ? 'grid' : 'none'};
    position: fixed;
    top: 52px;
    left: 0;
    right: 0;
    max-height: calc(100vh - 52px);
    overflow-y: auto;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 10px 24px rgba(15,23,42,.1);
    padding: 12px;
    gap: 5px;
  }
`;

const MobileButton = styled.button`
  border: 0;
  background: transparent;
  color: #334155;
  border-radius: 9px;
  padding: 12px 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: .9rem;
  font-weight: 800;
  text-align: left;
  cursor: pointer;
  &:hover { background: #f8fafc; }
`;

const UserChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GlobalNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getUser());

  useEffect(() => {
    setCurrentUser(authService.getUser());
  }, [location.pathname]);

  useEffect(() => {
    const close = event => {
      if (!event.target.closest('[data-nav-dropdown]')) {
        setAccountOpen(false);
        setResourcesOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const go = path => {
    setMobileOpen(false);
    setAccountOpen(false);
    setResourcesOpen(false);
    navigate(path);
  };

  const isActive = prefix => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`);

  const handleLoginSuccess = user => {
    setCurrentUser(user);
    setShowLoginModal(false);
    if (user?.role === 'consumer') go('/my-assessments');
    else go('/executive-dashboard');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    go('/');
  };

  const role = currentUser?.role;
  const isAuthor = role === 'author' || role === 'admin';
  const isAdmin = role === 'admin';

  return (
    <>
      <Nav>
        <Inner>
          <Brand onClick={() => go('/')} aria-label="ScoreX home"><Mark>SX</Mark><span>ScoreX</span></Brand>

          <Desktop>
            <NavButton $active={isActive('/executive')} onClick={() => go('/executive-dashboard')}><FiCompass /> Decision Room</NavButton>
            <NavButton $active={isActive('/assessments') || isActive('/assessment-templates')} onClick={() => go('/assessments/custom-hub')}><FiFileText /> Assessments</NavButton>
            <NavButton $active={isActive('/deep-dive')} onClick={() => go('/deep-dive')}><FiLayers /> Architecture</NavButton>
            <NavButton $active={isActive('/workflow')} onClick={() => go('/workflow-demo')}><FiPlay /> 3‑Min Demo</NavButton>
            <Dropdown data-nav-dropdown>
              <NavButton onClick={() => setResourcesOpen(open => !open)}><FiBook /> Resources <FiChevronDown size={13} /></NavButton>
              <Menu $open={resourcesOpen}>
                <MenuButton onClick={() => go('/user-guide')}><FiBook /> User Guide</MenuButton>
                <MenuButton onClick={() => go('/pitch-deck')}><FiBarChart2 /> Pitch Deck</MenuButton>
                <MenuButton onClick={() => go('/feedback')}><FiMessageSquare /> Give Feedback</MenuButton>
              </Menu>
            </Dropdown>
          </Desktop>

          <Actions>
            {!currentUser ? (
              <>
                <CTA $primary onClick={() => go('/workflow-demo')}><FiPlay /> Run Demo</CTA>
                <CTA onClick={() => setShowLoginModal(true)}><FiLogIn /> Sign In</CTA>
              </>
            ) : (
              <Dropdown data-nav-dropdown>
                <CTA onClick={() => setAccountOpen(open => !open)}><UserChip><FiUser /> {currentUser.firstName || currentUser.name || currentUser.email || 'Account'}</UserChip><FiChevronDown size={13} /></CTA>
                <Menu $open={accountOpen}>
                  <MenuLabel>Workspace</MenuLabel>
                  {role === 'consumer' && <MenuButton onClick={() => go('/my-assessments')}><FiFileText /> My Assessments</MenuButton>}
                  {isAuthor && <MenuButton onClick={() => go('/insights-dashboard')}><FiBarChart2 /> Insights</MenuButton>}
                  {isAuthor && <MenuButton onClick={() => go('/my-assignments')}><FiSend /> Assignments</MenuButton>}
                  {isAdmin && <MenuButton onClick={() => go('/user-management')}><FiUsers /> Users</MenuButton>}
                  <Divider />
                  <MenuButton onClick={() => go('/feedback')}><FiMessageSquare /> Feedback</MenuButton>
                  <MenuButton onClick={handleLogout}><FiLogOut /> Sign Out</MenuButton>
                </Menu>
              </Dropdown>
            )}
          </Actions>

          <MobileToggle onClick={() => setMobileOpen(open => !open)} aria-label="Toggle navigation">{mobileOpen ? <FiX /> : <FiMenu />}</MobileToggle>
        </Inner>
        <Mobile $open={mobileOpen}>
          <MobileButton onClick={() => go('/executive-dashboard')}><FiCompass /> Decision Room</MobileButton>
          <MobileButton onClick={() => go('/assessments/custom-hub')}><FiFileText /> Assessments</MobileButton>
          <MobileButton onClick={() => go('/deep-dive')}><FiLayers /> Architecture</MobileButton>
          <MobileButton onClick={() => go('/workflow-demo')}><FiPlay /> 3‑Minute Demo</MobileButton>
          <MobileButton onClick={() => go('/user-guide')}><FiBook /> User Guide</MobileButton>
          <MobileButton onClick={() => go('/pitch-deck')}><FiBarChart2 /> Pitch Deck</MobileButton>
          {role === 'consumer' && <MobileButton onClick={() => go('/my-assessments')}><FiFileText /> My Assessments</MobileButton>}
          {isAuthor && <MobileButton onClick={() => go('/insights-dashboard')}><FiBarChart2 /> Insights</MobileButton>}
          {isAuthor && <MobileButton onClick={() => go('/my-assignments')}><FiSend /> Assignments</MobileButton>}
          {isAdmin && <MobileButton onClick={() => go('/user-management')}><FiUsers /> Users</MobileButton>}
          <Divider />
          {!currentUser ? <MobileButton onClick={() => { setMobileOpen(false); setShowLoginModal(true); }}><FiLogIn /> Sign In</MobileButton> : <MobileButton onClick={handleLogout}><FiLogOut /> Sign Out</MobileButton>}
        </Mobile>
      </Nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default GlobalNav;

import React from 'react';
import styled from 'styled-components';
import { FiGlobe, FiSearch, FiLayers } from 'react-icons/fi';

const HeaderContainer = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 100%;
  margin: 0;
  padding: 12px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
  justify-content: flex-start;
`;

const NavLink = styled.a`
  color: #1f2937;
  text-decoration: none;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    color: #ff3621;
  }
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const CenterLink = styled.a`
  color: #1f2937;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #ff3621;
    transition: color 0.2s;
    stroke-width: 1.5;
  }
  
  &:hover {
    color: #ff3621;
    
    svg {
      color: #e62e1a;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  justify-content: flex-end;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #1f2937;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: #1f2937;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  padding: 8px 12px;
  white-space: nowrap;
  text-decoration: none;
  
  &:hover {
    color: #ff3621;
  }
`;

const TryButton = styled.button`
  background: #ff3621;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  
  &:hover {
    background: #e62e1a;
  }
`;

const Header = ({ currentAssessment }) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Nav>
          <NavLink href="https://www.databricks.com/why-databricks" target="_blank" rel="noopener noreferrer">
            Why Databricks
          </NavLink>
          <NavLink href="https://www.databricks.com/product" target="_blank" rel="noopener noreferrer">
            Product
          </NavLink>
          <NavLink href="https://www.databricks.com/solutions" target="_blank" rel="noopener noreferrer">
            Solutions
          </NavLink>
          <NavLink href="https://www.databricks.com/resources" target="_blank" rel="noopener noreferrer">
            Resources
          </NavLink>
          <NavLink href="https://www.databricks.com/company/about-us" target="_blank" rel="noopener noreferrer">
            About
          </NavLink>
        </Nav>
        
        <CenterSection>
          <CenterLink href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
            <FiLayers size={18} />
            Data & AI Technical Maturity Assessment Framework
          </CenterLink>
        </CenterSection>
        
        <RightSection>
          <IconButton title="Language">
            <FiGlobe size={20} />
          </IconButton>
          <IconButton title="Search">
            <FiSearch size={20} />
          </IconButton>
          <TextButton 
            as="a" 
            href="https://accounts.cloud.databricks.com/login" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Login
          </TextButton>
          <TextButton 
            as="a" 
            href="https://www.databricks.com/company/contact" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Contact Us
          </TextButton>
          <TryButton onClick={() => window.location.href = '/'}>Try Databricks</TryButton>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;



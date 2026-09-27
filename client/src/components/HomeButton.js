import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

const HomeButtonContainer = styled(motion.button)`
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 1000;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4);
  }

  @media (max-width: 768px) {
    right: 16px;
    top: 90px;
    padding: 10px 16px;
    font-size: 13px;
  }
`;

const HomeButton = ({ className }) => {
  const navigate = useNavigate();

  return (
    <HomeButtonContainer
      className={className}
      onClick={() => navigate('/')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <FiHome size={16} />
      Home
    </HomeButtonContainer>
  );
};

export default HomeButton;

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiX, FiCheck, FiChevronDown } from 'react-icons/fi';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SelectDisplay = styled.div`
  min-height: 48px;
  padding: 8px 40px 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  
  &:hover {
    border-color: #cbd5e1;
  }
  
  ${props => props.$isOpen && `
    border-color: #3b82f6;
  `}
`;

const Placeholder = styled.div`
  color: #94a3b8;
  font-size: 1rem;
`;

const SelectedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ChevronIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%) ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s;
  color: #64748b;
  pointer-events: none;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 320px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

const SearchWrapper = styled.div`
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const SearchInputContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9375rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const OptionsContainer = styled.div`
  overflow-y: auto;
  max-height: 250px;
`;

const Option = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  ${props => props.$selected && `
    background: #eff6ff;
  `}
  
  &:hover {
    background: ${props => props.$selected ? '#dbeafe' : '#f8fafc'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const OptionInfo = styled.div`
  flex: 1;
`;

const OptionTitle = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9375rem;
`;

const OptionSubtitle = styled.div`
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: 2px;
`;

const CheckIconWrapper = styled.div`
  color: #3b82f6;
  display: flex;
  align-items: center;
`;

const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
`;

const MultiSelectDropdown = ({ options, selectedIds, onChange, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => {
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = option.title?.toLowerCase().includes(searchLower);
    const subtitleMatch = option.subtitle?.toLowerCase().includes(searchLower);
    return titleMatch || subtitleMatch;
  });

  const selectedOptions = options.filter(opt => selectedIds.includes(opt.id));

  const toggleOption = (optionId) => {
    const newSelectedIds = selectedIds.includes(optionId)
      ? selectedIds.filter(id => id !== optionId)
      : [...selectedIds, optionId];
    onChange(newSelectedIds);
  };

  const removeOption = (optionId, e) => {
    e.stopPropagation();
    onChange(selectedIds.filter(id => id !== optionId));
  };

  return (
    <Container ref={containerRef}>
      <SelectDisplay 
        onClick={() => setIsOpen(!isOpen)}
        $isOpen={isOpen}
      >
        {selectedOptions.length === 0 ? (
          <Placeholder>{placeholder}</Placeholder>
        ) : (
          selectedOptions.map(option => (
            <SelectedBadge key={option.id}>
              {option.title}
              <RemoveButton onClick={(e) => removeOption(option.id, e)}>
                <FiX size={14} />
              </RemoveButton>
            </SelectedBadge>
          ))
        )}
        <ChevronIcon $isOpen={isOpen}>
          <FiChevronDown size={20} />
        </ChevronIcon>
      </SelectDisplay>

      {isOpen && (
        <Dropdown>
          <SearchWrapper>
            <SearchInputContainer>
              <SearchIcon>
                <FiSearch size={16} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </SearchInputContainer>
          </SearchWrapper>

          <OptionsContainer>
            {filteredOptions.length === 0 ? (
              <EmptyState>No options found</EmptyState>
            ) : (
              filteredOptions.map(option => (
                <Option
                  key={option.id}
                  $selected={selectedIds.includes(option.id)}
                  onClick={() => toggleOption(option.id)}
                >
                  <OptionInfo>
                    <OptionTitle>{option.title}</OptionTitle>
                    {option.subtitle && (
                      <OptionSubtitle>{option.subtitle}</OptionSubtitle>
                    )}
                  </OptionInfo>
                  {selectedIds.includes(option.id) && (
                    <CheckIconWrapper>
                      <FiCheck size={18} />
                    </CheckIconWrapper>
                  )}
                </Option>
              ))
            )}
          </OptionsContainer>
        </Dropdown>
      )}
    </Container>
  );
};

export default MultiSelectDropdown;



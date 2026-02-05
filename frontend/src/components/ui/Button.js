import React from 'react';
import styled from 'styled-components';

// We can use styled-components for specific component styling or just CSS modules/inline
// For speed and consistency with index.css, I'll use inline/objects or standard CSS classes if I had a module.
// But since I didn't set up modules, I'll use a simple style object approach or className.

const ButtonWrapper = styled.button`
  position: relative;
  padding: 1rem 2rem;
  border-radius: 2rem;
  border: 1px solid var(--grid-line);
  color: var(--text-primary);
  background: transparent;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background-color: var(--text-primary);
    transition: width 0.3s cubic-bezier(0.7, 0, 0.3, 1);
    z-index: -1;
  }

  &:hover {
    color: var(--bg-primary);
    border-color: var(--text-primary);
    &::before {
      width: 100%;
    }
  }

  &.text-only {
    border: none;
    padding: 0.5rem 1rem;
    
    &::before {
      display: none;
    }

    &:hover {
      color: var(--accent-violet);
    }
  }

  &.primary {
    background: var(--text-primary);
    color: var(--bg-primary);
    
    &:hover {
        background: var(--accent-teal);
        color: var(--text-primary);
        border-color: var(--accent-teal);
    }
    &::before {
        display: none;
    }
  }
`;

const Button = ({ children, variant = 'default', onClick, className }) => {
    return (
        <ButtonWrapper className={`${variant} ${className}`} onClick={onClick}>
            {children}
        </ButtonWrapper>
    );
};

export default Button;

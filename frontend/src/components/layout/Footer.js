import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: var(--text-primary);
  color: var(--bg-primary);
  padding: 2rem;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  opacity: 0.7;
`;

const Links = styled.div`
  display: flex;
  gap: 2rem;
  
  a {
    color: white;
    text-decoration: none;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
      color: var(--accent-teal);
    }
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <Copyright>
          © {new Date().getFullYear()} Placement Portal. All rights reserved.
        </Copyright>
        <Links>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Support</a>
        </Links>
      </FooterContent>
    </FooterWrapper>
  );
};

export default Footer;

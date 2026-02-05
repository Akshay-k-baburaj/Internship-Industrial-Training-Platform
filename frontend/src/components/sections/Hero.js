import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const Section = styled.section`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0 2rem;
  text-align: center;
  background: var(--bg-primary);
`;

const Title = styled(motion.h1)`
  font-family: 'Fira Code', monospace;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  
  span {
    color: var(--accent-teal);
  }
`;

const Subtitle = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;
  color: #666;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 3rem;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Hero = () => {
    return (
        <Section>
            <Title
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                University<br />
                <span>Placement Portal</span>
            </Title>

            <Subtitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
                Streamlining the journey from campus to career.
                Manage opportunities, track applications, and secure your future.
            </Subtitle>

            <ButtonGroup
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
                <Button variant="primary" onClick={() => window.location.href = '/login'}>Student Login</Button>
                <Button onClick={() => window.location.href = '/login/faculty'}>Faculty Access</Button>
            </ButtonGroup>
        </Section>
    );
};

export default Hero;

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';
import Button from '../components/ui/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-primary);
  padding: 2rem;
`;

const FormCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid var(--grid-line);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  font-family: 'Fira Code', monospace;
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-size: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #666;
    font-family: 'Inter', sans-serif;
  }
  
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s;
    
    &:focus {
      border-color: var(--accent-teal);
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-bottom: 1rem;
`;

const LinkText = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
  
  a {
    color: var(--accent-teal);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthService.register(email, password, role);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Create Account</Title>
        <form onSubmit={handleRegister}>
          <InputGroup>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="student@university.edu"
            />
          </InputGroup>

          <InputGroup>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </InputGroup>

          <InputGroup>
            <label>Role</label>
            <input
              type="text"
              value="Student"
              disabled
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button
            variant="primary"
            type="submit"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <LinkText>
          Already have an account? <Link to="/login">Login here</Link>
        </LinkText>
      </FormCard>
    </Container>
  );
};

export default Register;

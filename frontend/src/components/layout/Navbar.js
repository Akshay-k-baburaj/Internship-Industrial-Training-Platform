import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import Magnetic from '../ui/Magnetic';
import AuthService from '../../services/auth.service';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  mix-blend-mode: exclusion;
  color: white;
`;

const Logo = styled.div`
  font-family: 'Fira Code', monospace;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.05em;
  
  span {
    color: var(--accent-teal);
  }
`;

const Links = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: white;
  text-decoration: none;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--accent-teal);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const location = useLocation();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(undefined);
    }
  }, [location]); // Re-check on route change (e.g. login/logout)

  return (
    <Nav>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Magnetic>
          <Logo>PLACEMENT<span>PORTAL</span></Logo>
        </Magnetic>
      </Link>

      <Links>
        {!currentUser ? (
          <>
            <Magnetic>
              <NavLink to="/login">Student Login</NavLink>
            </Magnetic>
            <Magnetic>
              <NavLink to="/login/faculty">Faculty Login</NavLink>
            </Magnetic>
            <Magnetic>
              <NavLink to="/login/admin">Admin</NavLink>
            </Magnetic>
          </>
        ) : (
          <Magnetic>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </Magnetic>
        )}
      </Links>
    </Nav>
  );
};

export default Navbar;

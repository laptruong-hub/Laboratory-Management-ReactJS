import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styled from "styled-components";

const StyledNavbar = styled(Navbar)`
  .navbar-brand {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .nav-link {
    transition: opacity 0.2s ease-in-out;

    &:hover {
      color: #ffffff !important;
      opacity: 0.75;
    }
  }

  .nav-link[href="/auth/login"] {
    font-weight: 600;
  }
`;

const Header: React.FC = () => {
  return (
    <StyledNavbar bg="danger" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Quản lý phòng thí nghiệm
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Trang chủ
            </Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link as={Link} to="/auth/login">
              Đăng nhập
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Header;

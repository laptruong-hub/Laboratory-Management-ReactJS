import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { FaHome, FaUser, FaTimes, FaBars } from "react-icons/fa";

const StyledNavbar = styled(Navbar)<{ $scrolled: boolean }>`
  background: ${(p) =>
    p.$scrolled
      ? "rgba(220, 38, 38, 0.95) !important"
      : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important"};
  backdrop-filter: ${(p) => (p.$scrolled ? "blur(10px)" : "none")};
  box-shadow: ${(p) => (p.$scrolled ? "0 8px 32px rgba(193, 75, 83, 0.2)" : "0 2px 10px rgba(0, 0, 0, 0.1)")};
  padding: ${(p) => (p.$scrolled ? "0.75rem 0" : "1.25rem 0")};
  min-height: ${(p) => (p.$scrolled ? "70px" : "80px")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  top: 0;
  z-index: 1000;

  .navbar-brand {
    font-size: ${(p) => (p.$scrolled ? "1.3rem" : "1.5rem")};
    font-weight: 700;
    color: #ffffff !important;
    transition: all 0.3s ease-in-out;
    letter-spacing: -0.5px;
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    &:hover {
      opacity: 0.9;
      transform: scale(1.02);
    }

    .brand-icon {
      width: ${(p) => (p.$scrolled ? "36px" : "42px")};
      height: ${(p) => (p.$scrolled ? "36px" : "42px")};
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease-in-out;
    }
  }

  .nav-link {
    color: rgba(255, 255, 255, 0.9) !important;
    font-weight: 500;
    font-size: ${(p) => (p.$scrolled ? "0.95rem" : "1rem")};
    padding: ${(p) => (p.$scrolled ? "0.5rem 1rem" : "0.75rem 1.25rem")} !important;
    border-radius: 10px;
    transition: all 0.2s ease-in-out;
    margin: 0 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;

    &:hover {
      color: #ffffff !important;
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.25);
      color: #ffffff !important;
      font-weight: 600;

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 2px;
        background: #ffffff;
        border-radius: 2px;
      }
    }
  }

  .btn {
    margin-left: 0.5rem;
    font-size: ${(p) => (p.$scrolled ? "0.9rem" : "1rem")};
    padding: ${(p) => (p.$scrolled ? "0.6rem 1.5rem" : "0.75rem 1.75rem")};
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background-color: transparent;
    color: #ffffff !important;
    font-weight: 600;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      color: #ffffff !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .navbar-text {
    color: rgba(255, 255, 255, 0.9) !important;
    margin-right: 1rem;
    font-size: ${(p) => (p.$scrolled ? "0.9rem" : "1rem")};
    font-weight: 500;
  }

  .navbar-toggler {
    border: 2px solid rgba(255, 255, 255, 0.3);
    padding: 0.4rem 0.6rem;
    border-radius: 8px;

    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
    }

    .navbar-toggler-icon {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.85%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }
  }

  @media (max-width: 991px) {
    .navbar-collapse {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-link {
      margin: 0.25rem 0;
    }

    .btn {
      margin: 0.5rem 0 0 0;
      width: 100%;
      text-align: center;
    }

    .navbar-text {
      margin: 0.5rem 0;
      display: block;
    }
  }
`;

const ProfileButton = styled.button<{ $scrolled: boolean }>`
  width: ${(p) => (p.$scrolled ? "48px" : "52px")};
  height: ${(p) => (p.$scrolled ? "48px" : "52px")};
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }

  svg {
    width: ${(p) => (p.$scrolled ? "24px" : "26px")};
    height: ${(p) => (p.$scrolled ? "24px" : "26px")};
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  overflow: hidden;
  opacity: ${(p) => (p.$isOpen ? 1 : 0)};
  visibility: ${(p) => (p.$isOpen ? "visible" : "hidden")};
  transform: ${(p) => (p.$isOpen ? "translateY(0)" : "translateY(-10px)")};
  transition: all 0.2s ease-in-out;
  z-index: 1000;
`;

const DropdownHeader = styled.div`
  padding: 1.25rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DropdownAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  flex-shrink: 0;
`;

const DropdownInfo = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-weight: 600;
    color: #1f2937;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .email {
    font-size: 0.875rem;
    color: #6b7280;
    word-break: break-word;
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: none;
  background: transparent;
  text-align: left;
  color: #1f2937;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: #f8f9fa;
  }

  &.logout {
    color: #dc2626;
    border-top: 1px solid #e9ecef;
    margin-top: 0.25rem;

    &:hover {
      background: #fee2e2;
    }
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  opacity: ${(p) => (p.$isOpen ? 1 : 0)};
  visibility: ${(p) => (p.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease-in-out;
`;

const MobileMenuContent = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 85%;
  max-width: 320px;
  height: 100%;
  background: #ffffff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  transform: ${(p) => (p.$isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const MobileMenuHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const MobileMenuItem = styled(Link)`
  padding: 1rem 1.5rem;
  color: #1f2937;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f8f9fa;
    color: #dc2626;
  }

  &.active {
    background: #fee2e2;
    color: #dc2626;
    border-left: 4px solid #dc2626;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const BrandText = styled.span<{ $scrolled: boolean }>`
  display: ${(p) => (p.$scrolled ? "none" : "inline")};

  @media (max-width: 767px) {
    display: none;
  }

  @media (min-width: 768px) {
    display: inline;
  }
`;

const RelativeContainer = styled.div`
  position: relative;
`;

const NavWrapper = styled(Nav)`
  position: relative;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const Header: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        profileButtonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/", { replace: true });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname === path;
  };

  return (
    <>
      <StyledNavbar bg="danger" variant="dark" expand="lg" sticky="top" $scrolled={scrolled}>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <BrandText $scrolled={scrolled}>Quản lý phòng thí nghiệm</BrandText>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setMobileMenuOpen(true)}>
            <FaBars />
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className={isActive("/") ? "active" : ""}>
                <FaHome />
                <span>Trang chủ</span>
              </Nav.Link>
            </Nav>

            <NavWrapper>
              {loading ? (
                <Navbar.Text>Đang tải...</Navbar.Text>
              ) : user ? (
                <RelativeContainer>
                  <ProfileButton
                    ref={profileButtonRef}
                    $scrolled={scrolled}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-label="Menu người dùng"
                  >
                    <FaUser />
                  </ProfileButton>

                  
                  <DropdownMenu $isOpen={dropdownOpen} ref={dropdownRef}>
                    
                    <DropdownHeader>
                      <DropdownAvatar>
                        {user.avatarUrl ? (
                          <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                        ) : (
                          getInitials(user.fullName || user.email)
                        )}
                      </DropdownAvatar>
                      <DropdownInfo>
                        <div className="name">{user.fullName || "Người dùng"}</div>
                        <div className="email">{user.email}</div>
                      </DropdownInfo>
                    </DropdownHeader>
                    <DropdownItem
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/user/profile");
                      }}
                    >
                      <FaUser />
                      Tài khoản
                    </DropdownItem>
                    <DropdownItem className="logout" onClick={handleLogout}>
                      <FaTimes />
                      Đăng xuất
                    </DropdownItem>
                  </DropdownMenu>
                </RelativeContainer>
              ) : (
                <>
                  <Nav.Link as={Link} to="/auth/login" className="btn btn-outline-primary text-white px-2">
                    Đăng nhập
                  </Nav.Link>
                  <Nav.Link as={Link} to="/auth/signup" className="btn btn-outline-primary text-white px-2">
                    Đăng ký
                  </Nav.Link>
                </>
              )}
            </NavWrapper>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>

      {/* Mobile Menu */}
      <MobileMenu $isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(false)}>
        <MobileMenuContent $isOpen={mobileMenuOpen} onClick={(e) => e.stopPropagation()}>
          <MobileMenuHeader>
            <h3>Menu</h3>
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Đóng menu">
              <FaTimes />
            </button>
          </MobileMenuHeader>
          <MobileMenuItem to="/" className={isActive("/") ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>
            <FaHome />
            Trang chủ
          </MobileMenuItem>
          {user ? (
            <>
              <MobileMenuItem to="/user/profile" onClick={() => setMobileMenuOpen(false)}>
                <FaUser />
                Tài khoản
              </MobileMenuItem>
              <DropdownItem
                className="logout"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                style={{ marginTop: "auto", padding: "1.5rem" }}
              >
                <FaTimes />
                Đăng xuất
              </DropdownItem>
            </>
          ) : (
            <>
              <MobileMenuItem to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <FaUser />
                Đăng nhập
              </MobileMenuItem>
              <MobileMenuItem to="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                Đăng ký
              </MobileMenuItem>
            </>
          )}
        </MobileMenuContent>
      </MobileMenu>
    </>
  );
};

export default Header;

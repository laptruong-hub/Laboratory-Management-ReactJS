import React from "react";
import styled from "styled-components";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const theme = {
  colors: {
    primary: "#dc2626",
    white: "#ffffff",
    textLight: "rgba(255, 255, 255, 0.85)",
  },
};

const FooterWrapper = styled.footer`
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: 3.5rem 0 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1.2fr;
  gap: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 1.25rem 0;
  color: ${theme.colors.white};
`;

const FooterDescription = styled.p`
  color: ${theme.colors.textLight};
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 1.25rem 0;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SocialIcon = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
  display: grid;
  place-items: center;
  color: ${theme.colors.white};
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: ${theme.colors.white};
    color: ${theme.colors.primary};
  }
`;

const FooterLink = styled.a`
  color: ${theme.colors.textLight};
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 0.65rem;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.white};
  }
`;

const ContactItem = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  color: ${theme.colors.textLight};
  font-size: 0.9rem;
  margin-bottom: 0.85rem;
  line-height: 1.5;
`;

const ContactIcon = styled.div`
  color: ${theme.colors.white};
  font-size: 1rem;
  margin-top: 2px;
  flex-shrink: 0;
`;

const Copyright = styled.div`
  text-align: center;
  padding: 1.75rem 0;
  color: ${theme.colors.textLight};
  font-size: 0.875rem;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Container>
        <FooterContent>
          {/* Column 1: About */}
          <FooterColumn>
            <FooterTitle>Lab Xét Nghiệm</FooterTitle>
            <FooterDescription>
              Phòng lab hiện đại với đội ngũ chuyên gia giàu kinh nghiệm, cam
              kết mang đến dịch vụ xét nghiệm chất lượng cao nhất.
            </FooterDescription>
            <SocialIcons>
              <SocialIcon href="#" aria-label="Facebook">
                <FaFacebookF />
              </SocialIcon>
              <SocialIcon href="#" aria-label="Instagram">
                <FaInstagram />
              </SocialIcon>
              <SocialIcon href="#" aria-label="Twitter">
                <FaTwitter />
              </SocialIcon>
            </SocialIcons>
          </FooterColumn>

          {/* Column 2: Services */}
          <FooterColumn>
            <FooterTitle>Dịch Vụ</FooterTitle>
            <FooterLink href="#">Xét Nghiệm Tổng Quát</FooterLink>
            <FooterLink href="#">Xét Nghiệm Tim Mạch</FooterLink>
            <FooterLink href="#">Xét Nghiệm Đường Huyết</FooterLink>
            <FooterLink href="#">Xét Nghiệm Hóa Sinh</FooterLink>
          </FooterColumn>

          {/* Column 3: About Us */}
          <FooterColumn>
            <FooterTitle>Về Chúng Tôi</FooterTitle>
            <FooterLink href="#">Giới Thiệu</FooterLink>
            <FooterLink href="#">Đội Ngũ Chuyên Gia</FooterLink>
            <FooterLink href="#">Chứng Nhận</FooterLink>
            <FooterLink href="#">Tin Tức</FooterLink>
          </FooterColumn>

          {/* Column 4: Contact */}
          <FooterColumn>
            <FooterTitle>Liên Hệ</FooterTitle>
            <ContactItem>
              <ContactIcon>
                <FaMapMarkerAlt />
              </ContactIcon>
              <div>123 Đường ABC, Quận 1, TP.HCM</div>
            </ContactItem>
            <ContactItem>
              <ContactIcon>
                <FaPhoneAlt />
              </ContactIcon>
              <div>1900 xxxx</div>
            </ContactItem>
            <ContactItem>
              <ContactIcon>
                <FaEnvelope />
              </ContactIcon>
              <div>info@labxetnghiem.vn</div>
            </ContactItem>
          </FooterColumn>
        </FooterContent>

        <Copyright>© 2025 Lab Xét Nghiệm. Tất cả quyền được bảo lưu.</Copyright>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;

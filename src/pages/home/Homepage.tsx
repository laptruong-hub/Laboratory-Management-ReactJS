import React, { useEffect, useState, useRef } from "react";
import styled, { css, keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaFlask,
  FaStethoscope,
  FaHeartbeat,
  FaUserMd,
  FaMicroscope,
  FaFileMedicalAlt,
  FaCalendarAlt,
  FaVial,
  FaChartBar,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

import { apiClient } from "../../api/apiClient";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { validateEmail, validatePhone, validateForm } from "../../utils/validation";
import type { ValidationRule } from "../../utils/validation";

// --- STYLED COMPONENTS ---

const theme = {
  colors: {
    primary: "#dc2626",
    primaryDark: "#b91c1c",
    backgroundLight: "#f6f7f8",
    textDark: "#1f2937",
    textLight: "#6b7280",
    white: "#ffffff",
    border: "#e6e7ea",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
    md: "0 6px 18px rgba(0,0,0,0.06)",
    lg: "0 10px 30px rgba(0,0,0,0.10)",
  },
};

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.25rem;
`;

const Section = styled.section<{ color?: string; $animated?: boolean }>`
  padding: 4rem 0;
  background-color: ${(p) => p.color || theme.colors.white};
  ${(p) =>
    p.$animated &&
    css`
      opacity: 0;
      animation: ${fadeInUp} 0.6s ease-out forwards;
    `}
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${theme.colors.textDark};
  margin: 0;
`;

const Button = styled.button<{ $outline?: boolean; $loading?: boolean }>`
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: ${(p) => (p.$loading ? "not-allowed" : "pointer")};
  border: 2px solid transparent;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  transform: translateY(0);

  ${(p) =>
    p.$outline
      ? css`
          background: transparent;
          color: ${theme.colors.white};
          border-color: rgba(255, 255, 255, 0.9);
          &:hover:not(:disabled) {
            background: ${theme.colors.white};
            color: ${theme.colors.primary};
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      : css`
          background: ${theme.colors.white};
          color: ${theme.colors.primary};
          &:hover:not(:disabled) {
            background: #fff6f6;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `}

  &:disabled {
    opacity: 0.6;
  }
`;

const servicesData = [
  {
    icon: <FaStethoscope />,
    title: "Xét Nghiệm Tổng Quát",
    desc: "Kiểm tra tổng quát các chỉ số sức khỏe.",
    id: "general",
  },
  {
    icon: <FaHeartbeat />,
    title: "Xét Nghiệm Tim Mạch",
    desc: "Đánh giá nguy cơ tim mạch và cholesterol.",
    id: "cardiac",
  },
  {
    icon: <FaVial />,
    title: "Xét Nghiệm Huyết Học",
    desc: "Phân tích chỉ số máu cơ bản.",
    id: "hematology",
  },
  {
    icon: <FaMicroscope />,
    title: "Xét Nghiệm Hóa Sinh",
    desc: "Phân tích chức năng gan, thận, điện giải.",
    id: "biochemistry",
  },
  {
    icon: <FaUserMd />,
    title: "Xét Nghiệm Miễn Dịch",
    desc: "Đánh giá hệ miễn dịch và kháng thể.",
    id: "immunology",
  },
  {
    icon: <FaFlask />,
    title: "Xét Nghiệm Nhanh",
    desc: "Kết quả nhanh trong vòng 24h cho nhiều xét nghiệm.",
    id: "rapid",
  },
];

const whyChooseUsData = [
  {
    icon: <FaCheckCircle />,
    title: "Chứng Nhận Quốc Tế",
    desc: "Được chứng nhận quốc tế về chất lượng",
  },
  {
    icon: <FaChartBar />,
    title: "Kết Quả Chính Xác",
    desc: "Tỷ lệ chính xác trong xét nghiệm",
  },
  {
    icon: <FaUserMd />,
    title: "Đội Ngũ Chuyên Nghiệp",
    desc: "Bác sĩ và kỹ thuật viên giàu kinh nghiệm",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Nhiều Cơ Sở",
    desc: "Chi nhánh trên toàn quốc",
  },
];

const processData = [
  {
    icon: <FaCalendarAlt />,
    title: "1. Đặt Lịch Hẹn",
    subtitle: "Online hoặc gọi điện",
  },
  {
    icon: <FaVial />,
    title: "2. Lấy Mẫu",
    subtitle: "Nhân viên chuyên nghiệp",
  },
  {
    icon: <FaMicroscope />,
    title: "3. Phân Tích",
    subtitle: "Máy móc tiêu chuẩn",
  },
  {
    icon: <FaFileMedicalAlt />,
    title: "4. Nhận Kết Quả",
    subtitle: "Online hoặc tại cơ sở",
  },
];

const HeroWrapper = styled.div`
  position: relative;
  color: ${theme.colors.white};
  padding: 9rem 0 6.5rem 0;

  background-image: url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(220, 38, 38, 0.9), rgba(220, 38, 38, 0.83));
  }
`;

const HeroContent = styled(Container)`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: flex-start;
  color: ${theme.colors.white};
  animation: ${fadeIn} 0.8s ease-out;
  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroLeft = styled.div`
  flex: 0 0 55%;
  max-width: 720px;
  text-align: left;
  @media (max-width: 900px) {
    flex: auto;
    width: 100%;
    text-align: center;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.875rem;
  line-height: 1.08;
  margin: 0 0 0.75rem 0;
  font-weight: 800;
  animation: ${slideInLeft} 0.8s ease-out;
`;

const HeroSubtitle = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  max-width: 44rem;
  font-size: 1.05rem;
`;

const HeroCTA = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceIconWrap = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #fff0f2;
  color: ${theme.colors.primary};
  flex-shrink: 0;
  font-size: 1.5rem;
  transition: all 0.3s ease;
`;

const ServiceCard = styled.div<{ $isVisible?: boolean }>`
  background: ${theme.colors.white};
  padding: 1.5rem 1.25rem;
  border-radius: 12px;
  box-shadow: ${theme.shadows.sm};
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  border: 1px solid ${theme.colors.border};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.05), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.primary};

    &::before {
      left: 100%;
    }

    ${ServiceIconWrap} {
      transform: scale(1.1) rotate(5deg);
      background: linear-gradient(135deg, #fee2e2, #fecaca);
    }
  }

  ${(p) =>
    p.$isVisible &&
    css`
      animation: ${fadeInUp} 0.6s ease-out forwards;
    `}
`;

const WhyUsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 480px;
  gap: 2.5rem;
  align-items: center;
  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div<{ $isVisible?: boolean }>`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.25rem;
  background: ${theme.colors.white};
  border-radius: 12px;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
    border-color: ${theme.colors.primary};
  }

  ${(p) =>
    p.$isVisible &&
    css`
      animation: ${fadeInUp} 0.6s ease-out forwards;
    `}
`;

const FeatureIcon = styled.div`
  color: ${theme.colors.primary};
  font-size: 1.75rem;
  flex-shrink: 0;
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.strong`
  display: block;
  font-size: 1.1rem;
  color: ${theme.colors.textDark};
  margin-bottom: 0.5rem;
`;

const FeatureDesc = styled.small`
  color: ${theme.colors.textLight};
  display: block;
  margin-top: 0.25rem;
`;

const ProcessRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  position: relative;
  padding: 2rem 0;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryDark});
    z-index: 0;
    transform: translateY(-50%);
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    &::before {
      display: none;
    }
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ProcessCard = styled.div<{ $isVisible?: boolean; $index?: number }>`
  background: ${theme.colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: ${theme.shadows.sm};
  border: 2px solid ${theme.colors.border};
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.primary};
  }

  ${(p) =>
    p.$isVisible &&
    css`
      animation: ${fadeInUp} 0.6s ease-out forwards;
      animation-delay: ${(p.$index || 0) * 0.1}s;
    `}
`;

const ProcessIconWrapper = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #fff0f2, #fecaca);
  color: ${theme.colors.primary};
  font-size: 1.75rem;
  transition: all 0.3s ease;

  ${ProcessCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    background: linear-gradient(135deg, #fee2e2, #fca5a5);
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 1.25rem;
  align-items: start;
  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 760px;
  width: 100%;
  box-sizing: border-box;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-weight: 500;
  color: ${theme.colors.textDark};
  font-size: 0.9rem;
`;

const FormInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$hasError ? "#ef4444" : theme.colors.border)};
  box-shadow: ${theme.shadows.sm};
  background: ${theme.colors.white};
  color: ${theme.colors.textDark};
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;

const FormTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$hasError ? "#ef4444" : theme.colors.border)};
  box-shadow: ${theme.shadows.sm};
  resize: vertical;
  background: ${theme.colors.white};
  color: ${theme.colors.textDark};
  box-sizing: border-box;
  min-height: 120px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;

const FormError = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: -0.25rem;
`;

const SubmitButton = styled(Button)`
  width: 160px;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border-color: transparent;
  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }
`;

const AsideCard = styled.div`
  background: ${theme.colors.white};
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

const WhyUsImage = styled.img`
  width: 100%;
  border-radius: 12px;
  box-shadow: ${theme.shadows.lg};
  animation: ${fadeIn} 0.8s ease-out;
`;

// --- COMPONENTS ---

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    const servicesSection = document.getElementById("services-section");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <HeroWrapper>
      <HeroContent>
        <HeroLeft>
          <HeroTitle>
            Xét Nghiệm Máu
            <br />
            Chính Xác & Nhanh Chóng
          </HeroTitle>

          <HeroSubtitle>
            Phòng lab hiện đại với đội ngũ chuyên gia giàu kinh nghiệm, cam kết mang đến kết quả chính xác và dịch vụ
            tận tâm.
          </HeroSubtitle>

          <HeroCTA>
            <Button onClick={() => navigate("/booking")}>Đặt Lịch Xét Nghiệm</Button>

            <Button $outline onClick={handleLearnMore}>
              Tìm Hiểu Thêm
            </Button>
          </HeroCTA>
        </HeroLeft>
      </HeroContent>
    </HeroWrapper>
  );
};

const ServicesSection: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll("[data-service-card]");
      cards.forEach((card) => observer.observe(card));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Section color={theme.colors.backgroundLight} id="services-section" ref={sectionRef}>
      <Container>
        <SectionHeader>
          <SectionTitle>Dịch Vụ Xét Nghiệm</SectionTitle>
          <p style={{ marginTop: 8, color: theme.colors.textLight }}>
            Đa dạng các loại xét nghiệm với công nghệ hiện đại và độ chính xác cao
          </p>
        </SectionHeader>

        <ServicesGrid>
          {servicesData.map((s, index) => (
            <ServiceCard key={s.title} data-service-card $isVisible={visibleCards.has(index)}>
              <ServiceIconWrap>{s.icon}</ServiceIconWrap>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>{s.title}</h3>
                <p
                  style={{
                    margin: "6px 0 0 0",
                    color: theme.colors.textLight,
                    fontSize: 14,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Container>
    </Section>
  );
};

const WhyChooseUsSection: React.FC = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setVisibleFeatures((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const features = sectionRef.current.querySelectorAll("[data-feature]");
      features.forEach((feature) => observer.observe(feature));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef}>
      <Container>
        <SectionHeader>
          <SectionTitle>Tại Sao Chọn Chúng Tôi?</SectionTitle>
          <p style={{ marginTop: 8, color: theme.colors.textLight }}>
            Chúng tôi cam kết mang đến dịch vụ xét nghiệm chất lượng cao nhất
          </p>
        </SectionHeader>

        <WhyUsGrid>
          <div>
            <FeaturesGrid>
              {whyChooseUsData.map((f, index) => (
                <FeatureItem key={f.title} data-feature $isVisible={visibleFeatures.has(index)}>
                  <FeatureIcon>{f.icon}</FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>{f.title}</FeatureTitle>
                    <FeatureDesc>{f.desc}</FeatureDesc>
                  </FeatureContent>
                </FeatureItem>
              ))}
            </FeaturesGrid>
          </div>

          <div>
            <WhyUsImage
              src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=1800&auto=format&fit=crop"
              alt="Phòng xét nghiệm hiện đại với thiết bị tiên tiến"
              loading="lazy"
            />
          </div>
        </WhyUsGrid>
      </Container>
    </Section>
  );
};

const ProcessSection: React.FC = () => {
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const steps = sectionRef.current.querySelectorAll("[data-process-step]");
      steps.forEach((step) => observer.observe(step));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Section color={theme.colors.backgroundLight} ref={sectionRef}>
      <Container>
        <SectionHeader>
          <SectionTitle>Quy Trình Xét Nghiệm</SectionTitle>
          <p style={{ marginTop: 8, color: theme.colors.textLight }}>Đơn giản, nhanh chóng và chuyên nghiệp</p>
        </SectionHeader>

        <ProcessRow>
          {processData.map((p, index) => (
            <ProcessCard key={p.title} data-process-step $isVisible={visibleSteps.has(index)} $index={index}>
              <ProcessIconWrapper>{p.icon}</ProcessIconWrapper>
              <h4 style={{ margin: "6px 0", fontSize: "1.1rem" }}>{p.title}</h4>
              <p style={{ margin: 0, color: theme.colors.textLight }}>{p.subtitle}</p>
            </ProcessCard>
          ))}
        </ProcessRow>
      </Container>
    </Section>
  );
};

interface ContactFormData extends Record<string, string> {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationRules: Record<string, ValidationRule> = {
    name: { required: true, minLength: 2 },
    email: {
      required: true,
      custom: (value) => {
        if (!validateEmail(value)) {
          return "Email không hợp lệ";
        }
        return null;
      },
    },
    phone: {
      required: true,
      custom: (value) => {
        if (!validatePhone(value)) {
          return "Số điện thoại phải có 10-11 chữ số";
        }
        return null;
      },
    },
    message: { required: false },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateForm(formData, validationRules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionTitle>Liên Hệ Với Chúng Tôi</SectionTitle>
          <p style={{ marginTop: 8, color: theme.colors.textLight }}>
            Đặt lịch hẹn hoặc tư vấn miễn phí với chuyên gia của chúng tôi
          </p>
        </SectionHeader>

        <ContactGrid>
          <div>
            <ContactForm onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">
                  Họ và tên <span style={{ color: "#ef4444" }}>*</span>
                </FormLabel>
                <FormInput
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nhập họ và tên của bạn"
                  value={formData.name}
                  onChange={handleChange}
                  $hasError={!!errors.name}
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && <FormError id="name-error">{errors.name}</FormError>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="email">
                  Email <span style={{ color: "#ef4444" }}>*</span>
                </FormLabel>
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  $hasError={!!errors.email}
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <FormError id="email-error">{errors.email}</FormError>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="phone">
                  Số điện thoại <span style={{ color: "#ef4444" }}>*</span>
                </FormLabel>
                <FormInput
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0123456789"
                  value={formData.phone}
                  onChange={handleChange}
                  $hasError={!!errors.phone}
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && <FormError id="phone-error">{errors.phone}</FormError>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="message">Nội dung</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                  value={formData.message}
                  onChange={handleChange}
                  $hasError={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && <FormError id="message-error">{errors.message}</FormError>}
              </FormGroup>

              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <SubmitButton type="submit" disabled={isSubmitting} $loading={isSubmitting}>
                  {isSubmitting ? "Đang gửi..." : "Gửi Tin Nhắn"}
                </SubmitButton>
              </div>
            </ContactForm>
          </div>

          <aside>
            <AsideCard>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ color: theme.colors.primary, fontSize: "1.5rem" }}>
                  <FaPhoneAlt />
                </div>
                <div>
                  <strong>Điện Thoại</strong>
                  <div style={{ color: theme.colors.textLight, marginTop: 4 }}>1900 xxxx</div>
                </div>
              </div>
            </AsideCard>

            <AsideCard>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ color: theme.colors.primary, fontSize: "1.5rem" }}>
                  <FaEnvelope />
                </div>
                <div>
                  <strong>Email</strong>
                  <div style={{ color: theme.colors.textLight, marginTop: 4 }}>info@labxetnghiem.vn</div>
                </div>
              </div>
            </AsideCard>

            <AsideCard
              style={{
                background: theme.colors.primary,
                color: theme.colors.white,
              }}
            >
              <strong>Giờ Làm Việc</strong>
              <div style={{ marginTop: 8, color: "rgba(255,255,255,0.95)" }}>
                T2 - T6: 07:00 - 18:00
                <br />
                T7: 07:00 - 12:00
                <br />
                CN: Nghỉ
              </div>
            </AsideCard>
          </aside>
        </ContactGrid>
      </Container>
    </Section>
  );
};

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        await apiClient.get("/api/users/me");
      } catch (error) {
        console.error("Không thể lấy thông tin user (có thể token hết hạn):", error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("accessToken");

    if (token) {
      fetchMyProfile();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải trang..." />;
  }

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <ProcessSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default HomePage;

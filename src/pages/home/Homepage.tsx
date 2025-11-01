import React, { useEffect, useState } from "react"; // <-- 1. SỬA LỖI IMPORT Ở ĐÂY
import styled, { css } from "styled-components";

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

// --- (TẤT CẢ STYLED-COMPONENTS VÀ DATA CỦA BẠN BẮT ĐẦU TỪ ĐÂY) ---

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

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.25rem;
`;

const Section = styled.section<{ color?: string }>`
  padding: 4rem 0;
  background-color: ${(p) => p.color || theme.colors.white};
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

const Button = styled.button<{ $outline?: boolean }>`
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.18s ease-in-out;
  ${(p) =>
    p.$outline
      ? css`
          background: transparent;
          color: ${theme.colors.white};
          border-color: rgba(255, 255, 255, 0.9);
          &:hover {
            background: ${theme.colors.white};
            color: ${theme.colors.primary};
          }
        `
      : css`
          background: ${theme.colors.white};
          color: ${theme.colors.primary};
          &:hover {
            background: #fff6f6;
          }
        `}
`;

const servicesData = [
  {
    icon: <FaStethoscope />,
    title: "Xét Nghiệm Tổng Quát",
    desc: "Kiểm tra tổng quát các chỉ số sức khỏe.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Xét Nghiệm Tim Mạch",
    desc: "Đánh giá nguy cơ tim mạch và cholesterol.",
  },
  {
    icon: <FaVial />,
    title: "Xét Nghiệm Huyết Học",
    desc: "Phân tích chỉ số máu cơ bản.",
  },
  {
    icon: <FaMicroscope />,
    title: "Xét Nghiệm Hóa Sinh",
    desc: "Phân tích chức năng gan, thận, điện giải.",
  },
  {
    icon: <FaUserMd />,
    title: "Xét Nghiệm Miễn Dịch",
    desc: "Đánh giá hệ miễn dịch và kháng thể.",
  },
  {
    icon: <FaFlask />,
    title: "Xét Nghiệm Nhanh",
    desc: "Kết quả nhanh trong vòng 24h cho nhiều xét nghiệm.",
  },
];

const whyChooseUsData = [
  { icon: <FaCheckCircle />, title: "Chứng Nhận Quốc Tế" },
  { icon: <FaChartBar />, title: "Kết Quả Chính Xác" },
  { icon: <FaUserMd />, title: "Đội Ngũ Chuyên Nghiệp" },
  { icon: <FaMapMarkerAlt />, title: "Nhiều Cơ Sở" },
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
  padding: 6.5rem 0;
  background-image: url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(220, 38, 38, 0.9),
      rgba(220, 38, 38, 0.83)
    );
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

const ScheduleInput = styled.input`
  height: 44px;
  padding: 0 0.9rem;
  border-radius: 8px;
  border: none;
  min-width: 230px;
  box-shadow: ${theme.shadows.sm};
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

const ServiceCard = styled.div`
  background: ${theme.colors.white};
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: ${theme.shadows.sm};
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  border: 1px solid ${theme.colors.border};
`;

const ServiceIconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #fff0f2;
  color: ${theme.colors.primary};
  flex-shrink: 0;
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
  gap: 1rem;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  color: ${theme.colors.textLight};
`;

const FeatureIcon = styled.div`
  color: ${theme.colors.primary};
  font-size: 1.25rem;
`;

const ProcessRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ProcessCard = styled.div`
  background: ${theme.colors.white};
  border-radius: 10px;
  padding: 1.25rem;
  text-align: center;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
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
  gap: 0.9rem;
  max-width: 760px;
  width: 100%;
  box-sizing: border-box;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadows.sm};
  background: ${theme.colors.white};
  color: ${theme.colors.textDark};
  box-sizing: border-box;
  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadows.sm};
  resize: vertical;
  background: ${theme.colors.white};
  color: ${theme.colors.textDark};
  box-sizing: border-box;
  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;

const SubmitButton = styled(Button)`
  width: 160px;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border-color: transparent;
  &:hover {
    background: ${theme.colors.primaryDark};
  }
`;

const AsideCard = styled.div`
  background: ${theme.colors.white};
  padding: 0.9rem;
  border-radius: 10px;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  margin-bottom: 0.9rem;
`;

// --- (CÁC COMPONENT CON) ---

const HeroSection: React.FC<{ user: any }> = ({ user }) => (
  <HeroWrapper>
    <HeroContent>
      <HeroLeft>
        <HeroTitle>
          Xin chào, {user ? user.fullName : "bạn"}!
          <br />
          Chào mừng đến phòng Lab
        </HeroTitle>
        <HeroSubtitle>
          Phòng lab hiện đại với đội ngũ chuyên gia giàu kinh nghiệm, cam kết
          mang đến kết quả chính xác và dịch vụ tận tâm.
        </HeroSubtitle>
        <HeroCTA>
          <Button>Đặt Lịch Xét Nghiệm</Button>
          <ScheduleInput placeholder="Nhập số điện thoại hoặc mã đăng ký" />
          <Button $outline>Tìm Hiểu Thêm</Button>
        </HeroCTA>
      </HeroLeft>
    </HeroContent>
  </HeroWrapper>
);

const ServicesSection: React.FC = () => (
  <Section color={theme.colors.backgroundLight}>
    <Container>
      <SectionHeader>
        <SectionTitle>Dịch Vụ Xét Nghiệm</SectionTitle>
        <p style={{ marginTop: 8, color: theme.colors.textLight }}>
          Đa dạng các loại xét nghiệm với công nghệ hiện đại và độ chính xác cao
        </p>
      </SectionHeader>

      <ServicesGrid>
        {servicesData.map((s) => (
          <ServiceCard key={s.title}>
            <ServiceIconWrap>{s.icon}</ServiceIconWrap>
            <div>
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

const WhyChooseUsSection: React.FC = () => (
  <Section>
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
            {whyChooseUsData.map((f) => (
              <FeatureItem key={f.title}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <div>
                  <strong style={{ display: "block" }}>{f.title}</strong>
                  <small style={{ color: theme.colors.textLight }}>
                    Dịch vụ chuyên nghiệp, quy trình tiêu chuẩn
                  </small>
                </div>
              </FeatureItem>
            ))}
          </FeaturesGrid>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=1800&auto=format&fit=crop"
            alt="Phòng xét nghiệm"
            style={{
              width: "100%",
              borderRadius: 12,
              boxShadow: theme.shadows.lg,
            }}
          />
        </div>
      </WhyUsGrid>
    </Container>
  </Section>
);

const ProcessSection: React.FC = () => (
  <Section color={theme.colors.backgroundLight}>
    <Container>
      <SectionHeader>
        <SectionTitle>Quy Trình Xét Nghiệm</SectionTitle>
        <p style={{ marginTop: 8, color: theme.colors.textLight }}>
          Đơn giản, nhanh chóng và chuyên nghiệp
        </p>
      </SectionHeader>

      <ProcessRow>
        {processData.map((p) => (
          <ProcessCard key={p.title}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                margin: "0 auto 10px",
                background: "#fff0f2",
                color: theme.colors.primary,
              }}
            >
              {p.icon}
            </div>
            <h4 style={{ margin: "6px 0" }}>{p.title}</h4>
            <p style={{ margin: 0, color: theme.colors.textLight }}>
              {p.subtitle}
            </p>
          </ProcessCard>
        ))}
      </ProcessRow>
    </Container>
  </Section>
);

const ContactSection: React.FC = () => (
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
          <ContactForm onSubmit={(e) => e.preventDefault()}>
            <FormInput placeholder="Họ và tên *" />
            <FormInput placeholder="Email *" />
            <FormInput placeholder="Số điện thoại *" />
            <FormTextarea rows={5} placeholder="Nội dung" />
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <SubmitButton>Gửi Tin Nhắn</SubmitButton>
            </div>
          </ContactForm>
        </div>

        <aside>
          <AsideCard>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ color: theme.colors.primary }}>
                <FaPhoneAlt />
              </div>
              <div>
                <strong>Điện Thoại</strong>
                <div style={{ color: theme.colors.textLight }}>1900 xxxx</div>
              </div>
            </div>
          </AsideCard>

          <AsideCard>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ color: theme.colors.primary }}>
                <FaEnvelope />
              </div>
              <div>
                <strong>Email</strong>
                <div style={{ color: theme.colors.textLight }}>
                  info@labxetnghiem.vn
                </div>
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

const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    const fetchMyProfile = async () => {
      try {
        const response = await apiClient.get('/api/users/me');
        setUser(response.data); // Lưu thông tin user vào state
      } catch (error) {
        console.error("Không thể lấy thông tin user (có thể token hết hạn):", error);
      } finally {
        setLoading(false); // Dù thành công hay thất bại, cũng tắt loading
      }
    };

    const token = localStorage.getItem('accessToken');

    if (token) {
      // NẾU CÓ TOKEN (Đã đăng nhập) -> Mới gọi API
      fetchMyProfile();
    } else {
      // NẾU KHÔNG CÓ TOKEN (Khách) -> Không làm gì cả, chỉ tắt loading
      setLoading(false);
    }

  }, []); // [] = Chỉ chạy 1 lần duy nhất khi trang tải


  // Hiển thị "loading" trong khi đang check token hoặc fetch API
  if (loading) {
    return <div>Đang tải trang...</div>; // (Bạn có thể làm component Spinner đẹp hơn)
  }

  // Sau khi loading=false, render trang chính
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <main>
        {/* - Nếu là Khách: user=null -> "Xin chào, bạn!"
          - Nếu đã Login: user={...} -> "Xin chào, [Admin]!"
        */}
        <HeroSection user={user} />

        <ServicesSection />
        <WhyChooseUsSection />
        <ProcessSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default HomePage;
import React from "react";
import styled from "styled-components";
import BulkTestResultForm from "../../components/lab-user/BulkTestResultForm";

/* ---------- Styled Components ---------- */

const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
  flex-shrink: 0;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const PageDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const ContentSection = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

/* ---------- Component ---------- */

export default function LabUserDashboard() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Bảng điều khiển</PageTitle>
        <PageDescription>
          Quản lý và tạo kết quả xét nghiệm cho các đơn hàng đã được phân công
        </PageDescription>
      </PageHeader>

      <ContentSection>
        <SectionCard>
          <SectionTitle>Tạo kết quả xét nghiệm (Batch Mode)</SectionTitle>
          <BulkTestResultForm />
        </SectionCard>
      </ContentSection>
    </PageContainer>
  );
}


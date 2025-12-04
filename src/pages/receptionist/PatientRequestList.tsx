import React, { useState } from "react";
import styled from "styled-components";
import ApproveOrdersTab from "../../components/receptionist/ApproveOrdersTab";
import PatientRequestManage from "../admin/PatientRequestManage";

type TabType = "patient-requests" | "approve-orders";

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

/* ---------- Tab Components ---------- */
const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  flex-shrink: 0;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${(p) => (p.$active ? "#dc2626" : "#6b7280")};
  background: transparent;
  border: none;
  border-bottom: 3px solid ${(p) => (p.$active ? "#dc2626" : "transparent")};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;

  &:hover {
    color: #dc2626;
    background: #fef2f2;
  }
`;

/* ---------- Component ---------- */
export default function PatientRequestList() {
  const [activeTab, setActiveTab] = useState<TabType>("patient-requests");

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Quản Lý Đặt Lịch</PageTitle>
      </PageHeader>

      <TabContainer>
        <Tab $active={activeTab === "patient-requests"} onClick={() => setActiveTab("patient-requests")}>
          📋 Yêu cầu tạo tài khoản
        </Tab>
        <Tab $active={activeTab === "approve-orders"} onClick={() => setActiveTab("approve-orders")}>
          ✅ Duyệt lịch khám
        </Tab>
      </TabContainer>

      {activeTab === "patient-requests" ? <PatientRequestManage /> : <ApproveOrdersTab />}
    </PageContainer>
  );
}

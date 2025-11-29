import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import {
  getAllPatientRequests,
  getPatientRequestsByStatus,
  type PatientRequestDto,
} from "../../api/apiPatientRequest";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ScheduleOrderModal from "../../components/receptionist/ScheduleOrderModal";

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

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  flex-shrink: 0;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  flex: 1;
  min-width: 250px;
  max-width: 400px;

  svg {
    color: #9ca3af;
    margin-right: 0.5rem;
  }

  input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 0.875rem;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-bottom: 0.5rem;
`;

const RequestCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
`;

const CardHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
`;

const CardTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
`;

const CardSubTitle = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

const CardInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  label {
    font-size: 0.75rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  span {
    color: #374151;
    font-weight: 500;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(p) => {
    switch (p.$status) {
      case "PENDING":
        return "#fef3c7";
      case "ACTIVE":
        return "#d1fae5";
      case "REJECT":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(p) => {
    switch (p.$status) {
      case "PENDING":
        return "#92400e";
      case "ACTIVE":
        return "#065f46";
      case "REJECT":
        return "#991b1b";
      default:
        return "#374151";
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ScheduleButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #10b981;
  color: white;

  &:hover {
    background: #059669;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #6b7280;
`;

/* ---------- Component ---------- */
export default function PatientRequestList() {
  const [requests, setRequests] = useState<PatientRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<PatientRequestDto | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Only fetch ACTIVE requests for receptionist
      const data = await getPatientRequestsByStatus("ACTIVE");
      setRequests(data);
    } catch (error: any) {
      console.error("Error fetching patient requests:", error);
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        toast.error("Không thể tải danh sách yêu cầu");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const searchLower = search.toLowerCase();
    return (
      req.fullName.toLowerCase().includes(searchLower) ||
      req.email.toLowerCase().includes(searchLower) ||
      req.phoneNumber?.toLowerCase().includes(searchLower) ||
      req.notes?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "ACTIVE":
        return "Đã duyệt";
      case "REJECT":
        return "Từ chối";
      default:
        return status;
    }
  };

  const handleScheduleClick = (request: PatientRequestDto) => {
    setSelectedRequest(request);
    setShowScheduleModal(true);
  };

  const handleScheduleSuccess = () => {
    setShowScheduleModal(false);
    setSelectedRequest(null);
    fetchData(); // Refresh the list
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải danh sách yêu cầu..." />;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Danh sách yêu cầu</PageTitle>
      </PageHeader>

      <Toolbar>
        <SearchBox>
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBox>
      </Toolbar>

      <ContentSection>
        {filteredRequests.length === 0 ? (
          <EmptyState>
            <p>Không có yêu cầu nào</p>
          </EmptyState>
        ) : (
          <RequestList>
            {filteredRequests.map((request) => (
              <RequestCard key={request.patientRequestId}>
                <CardHeader>
                  <div>
                    <CardTitle>{request.fullName}</CardTitle>
                    <CardSubTitle>{request.email}</CardSubTitle>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <StatusBadge $status={request.status}>
                      {getStatusText(request.status)}
                    </StatusBadge>
                  </div>
                </CardHeader>

                <CardInfoGrid>
                  <InfoItem>
                    <label>Số điện thoại</label>
                    <span>{request.phoneNumber || "—"}</span>
                  </InfoItem>
                  <InfoItem>
                    <label>Ghi chú</label>
                    <span>{request.notes || "—"}</span>
                  </InfoItem>
                  <InfoItem>
                    <label>Ngày tạo</label>
                    <span>{formatDate(request.createdAt)}</span>
                  </InfoItem>
                </CardInfoGrid>

                {request.status === "ACTIVE" && (
                  <ActionButtons>
                    <ScheduleButton onClick={() => handleScheduleClick(request)}>
                      <FaCalendarAlt /> Đặt lịch
                    </ScheduleButton>
                  </ActionButtons>
                )}
              </RequestCard>
            ))}
          </RequestList>
        )}
      </ContentSection>

      {showScheduleModal && selectedRequest && (
        <ScheduleOrderModal
          open={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedRequest(null);
          }}
          patientRequest={selectedRequest}
          onSuccess={handleScheduleSuccess}
        />
      )}
    </PageContainer>
  );
}


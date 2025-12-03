import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { FaCalendarCheck } from "react-icons/fa";
import {
  getPatientRequestsByStatus,
  type PatientRequestDto,
} from "../../api/apiPatientRequest";
import ScheduleOrderModal from "../../components/receptionist/ScheduleOrderModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";

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
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RequestCard = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    border-color: #dc2626;
    background: #fef2f2;
  }
`;

const RequestInfo = styled.div`
  flex: 1;
`;

const RequestName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const RequestDetails = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ScheduleButton = styled.button`
  padding: 0.625rem 1.25rem;
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
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #6b7280;
`;

/* ---------- Component ---------- */

export default function ReceptionistScheduleAppointment() {
  const [requests, setRequests] = useState<PatientRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PatientRequestDto | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
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

  const handleScheduleClick = (request: PatientRequestDto) => {
    setSelectedRequest(request);
    setShowScheduleModal(true);
  };

  const handleScheduleSuccess = () => {
    fetchData();
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner fullScreen text="Đang tải danh sách yêu cầu..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Đặt lịch khám</PageTitle>
        <PageDescription>
          Chọn yêu cầu từ bệnh nhân để đặt lịch hẹn xét nghiệm
        </PageDescription>
      </PageHeader>

      <ContentSection>
        <SectionCard>
          <SectionTitle>
            <FaCalendarCheck />
            Danh sách yêu cầu chờ đặt lịch
          </SectionTitle>
          {requests.length === 0 ? (
            <EmptyState>
              <p>Không có yêu cầu nào đang chờ đặt lịch</p>
            </EmptyState>
          ) : (
            <RequestList>
              {requests.map((request) => (
                <RequestCard key={request.patientRequestId}>
                  <RequestInfo>
                    <RequestName>{request.fullName}</RequestName>
                    <RequestDetails>
                      {request.email} {request.phoneNumber && `• ${request.phoneNumber}`}
                    </RequestDetails>
                    {request.notes && (
                      <RequestDetails style={{ marginTop: "0.25rem", fontStyle: "italic" }}>
                        Ghi chú: {request.notes}
                      </RequestDetails>
                    )}
                  </RequestInfo>
                  <ScheduleButton onClick={() => handleScheduleClick(request)}>
                    <FaCalendarCheck />
                    Đặt lịch
                  </ScheduleButton>
                </RequestCard>
              ))}
            </RequestList>
          )}
        </SectionCard>
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


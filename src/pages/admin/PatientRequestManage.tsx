import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import {
  getAllPatientRequests,
  approvePatientRequest,
  rejectPatientRequest,
  deletePatientRequest,
  getPatientRequestsByStatus,
  type PatientRequestDto,
} from "../../api/apiPatientRequest";
import { toast } from "react-toastify";
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

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: ${(p) => (p.$active ? "#dc2626" : "white")};
  color: ${(p) => (p.$active ? "white" : "#374151")};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(p) => (p.$active ? "#b91c1c" : "#f9fafb")};
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

const CreatedAtBadge = styled.span`
  background: #f3f4f6;
  color: #374151;
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
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

const ActionButton = styled.button<{ $variant?: "approve" | "reject" | "delete" }>`
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  ${(p) => {
    switch (p.$variant) {
      case "approve":
        return `
          background: #10b981;
          color: white;
          &:hover {
            background: #059669;
          }
        `;
      case "reject":
        return `
          background: #ef4444;
          color: white;
          &:hover {
            background: #dc2626;
          }
        `;
      case "delete":
        return `
          background: #f3f4f6;
          color: #374151;
          &:hover {
            background: #e5e7eb;
          }
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
          &:hover {
            background: #e5e7eb;
          }
        `;
    }
  }}

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

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalField = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: 0.875rem;
    color: #6b7280;
    word-break: break-word;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button<{ $variant?: "primary" | "danger" | "secondary" }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(p) => {
    switch (p.$variant) {
      case "primary":
        return `
          background: #dc2626;
          color: white;
          &:hover {
            background: #b91c1c;
          }
        `;
      case "danger":
        return `
          background: #ef4444;
          color: white;
          &:hover {
            background: #dc2626;
          }
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
          &:hover {
            background: #e5e7eb;
          }
        `;
    }
  }}
`;

/* ---------- Component ---------- */
export default function PatientRequestManage() {
  const [requests, setRequests] = useState<PatientRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "ACTIVE" | "REJECT">("ALL");
  const [selectedRequest, setSelectedRequest] = useState<PatientRequestDto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let data: PatientRequestDto[];

      if (statusFilter === "ALL") {
        data = await getAllPatientRequests();
      } else {
        data = await getPatientRequestsByStatus(statusFilter);
      }

      setRequests(data);
    } catch (error: any) {
      console.error("Error fetching patient requests:", error);

      // Handle 401 Unauthorized - redirect to login
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        // The apiClient interceptor should handle redirect, but just in case:
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 2000);
        return;
      }

      const errorMessage = error.response?.data?.message || error.message || "Không thể tải danh sách yêu cầu";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const filteredRequests = requests.filter((req) => {
    const searchLower = search.toLowerCase();
    return (
      req.fullName.toLowerCase().includes(searchLower) ||
      req.email.toLowerCase().includes(searchLower) ||
      req.phoneNumber?.toLowerCase().includes(searchLower) ||
      req.notes?.toLowerCase().includes(searchLower)
    );
  });

  const handleApprove = async (id: number) => {
    // Prevent double click - check if already processing
    if (processingId !== null) {
      toast.warning("Đang xử lý một yêu cầu khác, vui lòng đợi...");
      return;
    }

    // Check if request is already approved
    const request = requests.find(r => r.patientRequestId === id);
    if (request && request.status !== "PENDING") {
      toast.warning("Yêu cầu này đã được xử lý rồi.");
      await fetchData();
      return;
    }

    if (!window.confirm("Bạn có chắc muốn duyệt yêu cầu này? Tài khoản sẽ được tạo tự động với mật khẩu mặc định.")) {
      return;
    }

    // Set processing immediately to prevent double click (before async call)
    setProcessingId(id);

    try {
      await approvePatientRequest(id);
      toast.success("Duyệt yêu cầu thành công! Tài khoản đã được tạo.");
      await fetchData();
      if (selectedRequest?.patientRequestId === id) {
        setShowModal(false);
        setSelectedRequest(null);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể duyệt yêu cầu";
      toast.error(errorMessage);
      // Refresh data to get latest status
      await fetchData();
    } finally {
      // Small delay to prevent rapid re-clicks
      setTimeout(() => {
        setProcessingId(null);
      }, 500);
    }
  };

  const handleReject = async (id: number) => {
    // Prevent double click
    if (processingId === id) {
      return;
    }

    // Check if request is already processed
    const request = requests.find(r => r.patientRequestId === id);
    if (request && request.status !== "PENDING") {
      toast.warning("Yêu cầu này đã được xử lý rồi.");
      await fetchData();
      return;
    }

    if (!window.confirm("Bạn có chắc muốn từ chối yêu cầu này?")) {
      return;
    }

    setProcessingId(id);

    try {
      await rejectPatientRequest(id);
      toast.success("Từ chối yêu cầu thành công");
      await fetchData();
      if (selectedRequest?.patientRequestId === id) {
        setShowModal(false);
        setSelectedRequest(null);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể từ chối yêu cầu";
      toast.error(errorMessage);
      await fetchData();
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa yêu cầu này?")) {
      return;
    }

    try {
      setProcessingId(id);
      await deletePatientRequest(id);
      toast.success("Xóa yêu cầu thành công");
      await fetchData();
      if (selectedRequest?.patientRequestId === id) {
        setShowModal(false);
        setSelectedRequest(null);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể xóa yêu cầu";
      toast.error(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "ACTIVE":
        return "Đã duyệt";
      case "REJECT":
        return "Đã từ chối";
      default:
        return status;
    }
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

        <FilterButtons>
          <FilterButton
            $active={statusFilter === "ALL"}
            onClick={() => setStatusFilter("ALL")}
          >
            Tất cả
          </FilterButton>
          <FilterButton
            $active={statusFilter === "PENDING"}
            onClick={() => setStatusFilter("PENDING")}
          >
            Chờ duyệt
          </FilterButton>
          <FilterButton
            $active={statusFilter === "ACTIVE"}
            onClick={() => setStatusFilter("ACTIVE")}
          >
            Đã duyệt
          </FilterButton>
          <FilterButton
            $active={statusFilter === "REJECT"}
            onClick={() => setStatusFilter("REJECT")}
          >
            Đã từ chối
          </FilterButton>
        </FilterButtons>
      </Toolbar>

      <ContentSection>
        {filteredRequests.length === 0 ? (
          <EmptyState>
            <p>Không có yêu cầu nào</p>
          </EmptyState>
        ) : (
          <RequestList>
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.patientRequestId}
                onClick={() => {
                  setSelectedRequest(request);
                  setShowModal(true);
                }}
              >
                <CardHeader>
                  <div>
                    <CardTitle>{request.fullName}</CardTitle>
                    <CardSubTitle>{request.email}</CardSubTitle>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <StatusBadge $status={request.status}>
                      {getStatusText(request.status)}
                    </StatusBadge>
                    <CreatedAtBadge>{formatDate(request.createdAt)}</CreatedAtBadge>
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
                  {request.updatedAt && (
                    <InfoItem>
                      <label>Ngày cập nhật</label>
                      <span>{formatDate(request.updatedAt)}</span>
                    </InfoItem>
                  )}
                </CardInfoGrid>

                <ActionButtons onClick={(e) => e.stopPropagation()}>
                  {request.status === "PENDING" && (
                    <>
                      <ActionButton
                        $variant="approve"
                        onClick={() => handleApprove(request.patientRequestId)}
                        disabled={processingId === request.patientRequestId}
                      >
                        <FaCheck /> Duyệt
                      </ActionButton>
                      <ActionButton
                        $variant="reject"
                        onClick={() => handleReject(request.patientRequestId)}
                        disabled={processingId === request.patientRequestId}
                      >
                        <FaTimes /> Từ chối
                      </ActionButton>
                    </>
                  )}
                  <ActionButton
                    $variant="delete"
                    onClick={() => handleDelete(request.patientRequestId)}
                    disabled={processingId === request.patientRequestId}
                  >
                    <FaTrash />
                  </ActionButton>
                </ActionButtons>
              </RequestCard>
            ))}
          </RequestList>
        )}
      </ContentSection>

      {showModal && selectedRequest && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>Chi tiết yêu cầu</ModalHeader>
            <ModalBody>
              <ModalField>
                <label>Họ và tên</label>
                <div className="value">{selectedRequest.fullName}</div>
              </ModalField>
              <ModalField>
                <label>Email</label>
                <div className="value">{selectedRequest.email}</div>
              </ModalField>
              <ModalField>
                <label>Số điện thoại</label>
                <div className="value">{selectedRequest.phoneNumber || "—"}</div>
              </ModalField>
              <ModalField>
                <label>Trạng thái</label>
                <div className="value">
                  <StatusBadge $status={selectedRequest.status}>
                    {getStatusText(selectedRequest.status)}
                  </StatusBadge>
                </div>
              </ModalField>
              <ModalField>
                <label>Ghi chú</label>
                <div className="value">{selectedRequest.notes || "—"}</div>
              </ModalField>
              <ModalField>
                <label>Ngày tạo</label>
                <div className="value">{formatDate(selectedRequest.createdAt)}</div>
              </ModalField>
              {selectedRequest.updatedAt && (
                <ModalField>
                  <label>Ngày cập nhật</label>
                  <div className="value">{formatDate(selectedRequest.updatedAt)}</div>
                </ModalField>
              )}
            </ModalBody>
            <ModalFooter>
              {selectedRequest.status === "PENDING" && (
                <>
                  <Button
                    $variant="primary"
                    onClick={() => {
                      handleApprove(selectedRequest.patientRequestId);
                    }}
                    disabled={processingId === selectedRequest.patientRequestId}
                  >
                    <FaCheck /> Duyệt
                  </Button>
                  <Button
                    $variant="danger"
                    onClick={() => {
                      handleReject(selectedRequest.patientRequestId);
                    }}
                    disabled={processingId === selectedRequest.patientRequestId}
                  >
                    <FaTimes /> Từ chối
                  </Button>
                </>
              )}
              <Button onClick={() => setShowModal(false)}>Đóng</Button>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}


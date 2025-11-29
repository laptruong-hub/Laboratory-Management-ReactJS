import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { PatientRequestDto } from "../../api/apiPatientRequest";
import {
  createOrder,
  getAllPurposes,
  type PurposeResponse,
  type CreateOrderRequest,
} from "../../api/apiOrder";
import { getAllWorkSlots, type WorkSlotResponse } from "../../api/apiWorkSlot";
import { apiClient } from "../../api/apiClient";
import LoadingSpinner from "../common/LoadingSpinner";

/* ---------- Types ---------- */

interface UserOption {
  id: number;
  fullName: string;
  email: string;
}

interface ScheduleOrderModalProps {
  open: boolean;
  onClose: () => void;
  patientRequest: PatientRequestDto;
  onSuccess: () => void;
}

interface OrderFormData {
  purposeId: string;
  userId: string;
  note: string;
  dateBook: string;
  workSlotId: string;
}

/* ---------- Styled Components ---------- */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 1.25rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #374151;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const PatientInfo = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const PatientInfoTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
`;

const PatientInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const PatientInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  span {
    font-size: 0.875rem;
    color: #111827;
    font-weight: 500;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(p) => {
    if (p.$variant === "primary") {
      return `
        background: #dc2626;
        color: white;
        &:hover {
          background: #b91c1c;
        }
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `;
    }
    return `
      background: #f3f4f6;
      color: #374151;
      &:hover {
        background: #e5e7eb;
      }
    `;
  }}
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

const ConfirmationModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`;

const ConfirmationContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  max-width: 400px;
  width: 100%;
`;

const ConfirmationTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
`;

const ConfirmationText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.25rem 0;
`;

const ConfirmationButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

/* ---------- Component ---------- */

export default function ScheduleOrderModal({
  open,
  onClose,
  patientRequest,
  onSuccess,
}: ScheduleOrderModalProps) {
  const [purposes, setPurposes] = useState<PurposeResponse[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [workSlots, setWorkSlots] = useState<WorkSlotResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<OrderFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<OrderFormData>();

  const selectedDate = watch("dateBook");

  useEffect(() => {
    if (open) {
      fetchData();
      reset();
    }
  }, [open]);

  useEffect(() => {
    if (selectedDate) {
      fetchWorkSlots(selectedDate);
    } else {
      setWorkSlots([]);
    }
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [purposesData, usersResponse] = await Promise.all([
        getAllPurposes(),
        apiClient.get("/api/users"),
      ]);

      setPurposes(purposesData);
      const usersData: UserOption[] = usersResponse.data.map((user: any) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      }));
      setUsers(usersData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchWorkSlots = async (date: string) => {
    try {
      const allWorkSlots = await getAllWorkSlots();
      // Filter work slots by date and active status
      const filtered = allWorkSlots.filter(
        (slot) => slot.date === date && slot.isActive
      );
      setWorkSlots(filtered);
    } catch (error: any) {
      console.error("Error fetching work slots:", error);
      toast.error("Không thể tải danh sách ca làm việc.");
    }
  };

  const onSubmit = (data: OrderFormData) => {
    setFormData(data);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!formData) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (!patientRequest.patientId) {
      toast.error("Yêu cầu này chưa có thông tin bệnh nhân. Vui lòng liên hệ quản trị viên.");
      return;
    }

    try {
      setLoading(true);
      const orderData: CreateOrderRequest = {
        patientId: patientRequest.patientId,
        purposeId: parseInt(formData.purposeId),
        userId: formData.userId ? parseInt(formData.userId) : undefined,
        note: formData.note || undefined,
        dateBook: formData.dateBook || undefined,
        workSlotId: formData.workSlotId ? parseInt(formData.workSlotId) : undefined,
      };

      await createOrder(orderData);
      toast.success("Đặt lịch thành công!");
      setShowConfirmation(false);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể tạo đơn đặt lịch";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Đặt lịch khám</ModalTitle>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>

          {loadingData ? (
            <LoadingSpinner text="Đang tải dữ liệu..." />
          ) : (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <PatientInfo>
                <PatientInfoTitle>Thông tin bệnh nhân</PatientInfoTitle>
                <PatientInfoGrid>
                  <PatientInfoItem>
                    <label>Họ và tên</label>
                    <span>{patientRequest.fullName}</span>
                  </PatientInfoItem>
                  <PatientInfoItem>
                    <label>Email</label>
                    <span>{patientRequest.email}</span>
                  </PatientInfoItem>
                  <PatientInfoItem>
                    <label>Số điện thoại</label>
                    <span>{patientRequest.phoneNumber || "—"}</span>
                  </PatientInfoItem>
                  <PatientInfoItem>
                    <label>Ghi chú</label>
                    <span>{patientRequest.notes || "—"}</span>
                  </PatientInfoItem>
                </PatientInfoGrid>
              </PatientInfo>

              <FormGroup>
                <Label htmlFor="purposeId">
                  Mục đích khám <span style={{ color: "#ef4444" }}>*</span>
                </Label>
                <Select
                  id="purposeId"
                  {...register("purposeId", { required: "Vui lòng chọn mục đích khám" })}
                >
                  <option value="">-- Chọn mục đích --</option>
                  {purposes.map((purpose) => (
                    <option key={purpose.purposeId} value={purpose.purposeId}>
                      {purpose.name}
                    </option>
                  ))}
                </Select>
                {errors.purposeId && (
                  <ErrorMessage>{errors.purposeId.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="userId">Người phụ trách</Label>
                <Select id="userId" {...register("userId")}>
                  <option value="">-- Chọn người phụ trách --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="dateBook">Ngày đặt lịch</Label>
                <Input
                  id="dateBook"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("dateBook")}
                />
              </FormGroup>

              {selectedDate && (
                <FormGroup>
                  <Label htmlFor="workSlotId">Ca làm việc</Label>
                  <Select id="workSlotId" {...register("workSlotId")}>
                    <option value="">-- Chọn ca làm việc --</option>
                    {workSlots.length === 0 ? (
                      <option disabled>Không có ca làm việc nào vào ngày này</option>
                    ) : (
                      workSlots.map((slot) => (
                        <option key={slot.workSlotId} value={slot.workSlotId}>
                          {slot.workSessionName} - {slot.labUserName} ({slot.date})
                        </option>
                      ))
                    )}
                  </Select>
                </FormGroup>
              )}

              <FormGroup>
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  {...register("note")}
                  placeholder="Nhập ghi chú (nếu có)"
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={onClose}>
                  Hủy
                </Button>
                <Button type="submit" $variant="primary" disabled={loading}>
                  {loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
                </Button>
              </ButtonGroup>
            </Form>
          )}
        </Modal>
      </ModalOverlay>

      {showConfirmation && (
        <ConfirmationModal onClick={() => setShowConfirmation(false)}>
          <ConfirmationContent onClick={(e) => e.stopPropagation()}>
            <ConfirmationTitle>Xác nhận đặt lịch</ConfirmationTitle>
            <ConfirmationText>
              Bạn có chắc chắn muốn tạo đơn đặt lịch cho bệnh nhân{" "}
              <strong>{patientRequest.fullName}</strong> không?
            </ConfirmationText>
            <ConfirmationButtons>
              <Button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="button"
                $variant="primary"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </ConfirmationButtons>
          </ConfirmationContent>
        </ConfirmationModal>
      )}
    </>
  );
}


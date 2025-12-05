import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  createReceptionOrder,
  getAllPurposes,
  type PurposeResponse,
  type CreateOrderRequest,
} from "../../api/apiOrder";
import { getAllWorkSlots, type WorkSlotResponse } from "../../api/apiWorkSlot";
import { getAllActiveTypeTests, type TypeTestResponse } from "../../api/apiTypeTest";
import { getAllActiveLabUsers } from "../../api/apiLabUser";
import LoadingSpinner from "../common/LoadingSpinner";

/* ---------- Types ---------- */

interface Patient {
  patientId: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}

interface UserOption {
  id: number;
  fullName: string;
  email: string;
}

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient;
  onSuccess: () => void;
}

interface OrderFormData {
  purposeId: string;
  labUserId: string;
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

const Required = styled.span`
  color: #dc2626;
`;

const Input = styled.input`
  padding: 0.75rem;
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
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #dc2626;
`;

const TestSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
`;

const TestList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 0.25rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;

    &:hover {
      background: #94a3b8;
    }
  }
`;

const TestItem = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: ${(p) => (p.$selected ? "#fef2f2" : "white")};
  border: 2px solid ${(p) => (p.$selected ? "#dc2626" : "#e5e7eb")};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${(p) => (p.$selected ? "0 4px 12px rgba(220, 38, 38, 0.15)" : "0 1px 3px rgba(0, 0, 0, 0.1)")};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${(p) => (p.$selected ? "#dc2626" : "transparent")};
    transition: all 0.2s ease;
  }

  &:hover {
    border-color: ${(p) => (p.$selected ? "#b91c1c" : "#dc2626")};
    box-shadow: ${(p) => (p.$selected ? "0 6px 16px rgba(220, 38, 38, 0.2)" : "0 4px 12px rgba(0, 0, 0, 0.15)")};
    transform: translateY(-2px);
  }
`;

const TestItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const TestCheckbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  margin-top: 0.125rem;
  accent-color: #dc2626;
  flex-shrink: 0;
`;

const TestInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TestName = styled.div`
  font-weight: 600;
  font-size: 0.9375rem;
  color: #1f2937;
  line-height: 1.4;
`;

const TestDescription = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.4;
  margin-top: 0.25rem;
`;

const TestPrice = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #dc2626;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
`;

const TotalPrice = styled.div`
  margin-top: 1.25rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 2px solid #dc2626;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 1.125rem;
  color: #1f2937;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(p) =>
    p.$variant === "primary"
      ? `
    background: #dc2626;
    color: white;
    &:hover {
      background: #b91c1c;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const PatientInfo = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const PatientInfoText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;

  strong {
    color: #1f2937;
    font-weight: 600;
  }
`;

/* ---------- Component ---------- */

export default function CreateOrderModal({ open, onClose, patient, onSuccess }: CreateOrderModalProps) {
  const [purposes, setPurposes] = useState<PurposeResponse[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [workSlots, setWorkSlots] = useState<WorkSlotResponse[]>([]);
  const [typeTests, setTypeTests] = useState<TypeTestResponse[]>([]);
  const [selectedTests, setSelectedTests] = useState<{ typeTestId: number; totalPrice: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

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
      setSelectedTests([]);
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
      const [purposesData, usersData, typeTestsData] = await Promise.all([
        getAllPurposes(),
        getAllActiveLabUsers(),
        getAllActiveTypeTests(),
      ]);
      setPurposes(purposesData);
      setUsers(usersData);
      setTypeTests(typeTestsData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchWorkSlots = async (date: string) => {
    try {
      const slots = await getAllWorkSlots(date);
      setWorkSlots(slots);
    } catch (error: any) {
      console.error("Error fetching work slots:", error);
      toast.error("Không thể tải lịch làm việc.");
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    if (selectedTests.length === 0) {
      toast.error("Vui lòng chọn ít nhất một loại xét nghiệm");
      return;
    }

    try {
      setLoading(true);
      const orderData: CreateOrderRequest = {
        patientId: patient.patientId,
        purposeId: parseInt(data.purposeId),
        labUserId: data.labUserId ? parseInt(data.labUserId) : undefined,
        note: data.note || undefined,
        dateBook: data.dateBook || undefined,
        workSlotId: data.workSlotId ? parseInt(data.workSlotId) : undefined,
        orderDetails: selectedTests,
      };

      await createReceptionOrder(orderData);
      toast.success("Tạo đơn xét nghiệm thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error creating order:", error);
      const errorMessage = error.response?.data?.message || "Không thể tạo đơn xét nghiệm";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTestToggle = (test: TypeTestResponse) => {
    const isSelected = selectedTests.some((t) => t.typeTestId === test.typeTestId);
    if (isSelected) {
      setSelectedTests(selectedTests.filter((t) => t.typeTestId !== test.typeTestId));
    } else {
      setSelectedTests([...selectedTests, { typeTestId: test.typeTestId, totalPrice: test.price }]);
    }
  };

  const totalPrice = selectedTests.reduce((sum, test) => sum + test.totalPrice, 0);

  if (!open) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Tạo đơn xét nghiệm</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        {loadingData ? (
          <LoadingSpinner />
        ) : (
          <>
            <PatientInfo>
              <PatientInfoText>
                <strong>Bệnh nhân:</strong> {patient.fullName}
              </PatientInfoText>
              <PatientInfoText>
                <strong>Email:</strong> {patient.email}
              </PatientInfoText>
              {patient.phone && (
                <PatientInfoText>
                  <strong>Số điện thoại:</strong> {patient.phone}
                </PatientInfoText>
              )}
            </PatientInfo>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label>
                  Mục đích <Required>*</Required>
                </Label>
                <Select {...register("purposeId", { required: "Vui lòng chọn mục đích" })}>
                  <option value="">-- Chọn mục đích --</option>
                  {purposes.map((purpose) => (
                    <option key={purpose.purposeId} value={purpose.purposeId}>
                      {purpose.name}
                    </option>
                  ))}
                </Select>
                {errors.purposeId && <ErrorMessage>{errors.purposeId.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Nhân viên xét nghiệm</Label>
                <Select {...register("labUserId")}>
                  <option value="">-- Chọn nhân viên (tùy chọn) --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Ngày đặt lịch</Label>
                <Input type="date" {...register("dateBook")} min={new Date().toISOString().split("T")[0]} />
              </FormGroup>

              {selectedDate && workSlots.length > 0 && (
                <FormGroup>
                  <Label>Ca làm việc</Label>
                  <Select {...register("workSlotId")}>
                    <option value="">-- Chọn ca làm việc (tùy chọn) --</option>
                    {workSlots.map((slot) => (
                      <option key={slot.workSlotId} value={slot.workSlotId}>
                        {slot.startTime} - {slot.endTime}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              )}

              <FormGroup>
                <Label>Ghi chú</Label>
                <TextArea {...register("note")} placeholder="Nhập ghi chú (nếu có)" />
              </FormGroup>

              <TestSection>
                <Label>
                  Chọn loại xét nghiệm <Required>*</Required>
                </Label>
                <TestList>
                  {typeTests.map((test) => {
                    const isSelected = selectedTests.some((t) => t.typeTestId === test.typeTestId);
                    return (
                      <TestItem key={test.typeTestId} $selected={isSelected} onClick={() => handleTestToggle(test)}>
                        <TestItemHeader>
                          <TestCheckbox
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleTestToggle(test)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <TestInfo>
                            <TestName>{test.name}</TestName>
                            {test.description && <TestDescription>{test.description}</TestDescription>}
                            <TestPrice>
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(test.price)}
                            </TestPrice>
                          </TestInfo>
                        </TestItemHeader>
                      </TestItem>
                    );
                  })}
                </TestList>
                {selectedTests.length > 0 && (
                  <TotalPrice>
                    <span>Tổng tiền:</span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(totalPrice)}
                    </span>
                  </TotalPrice>
                )}
              </TestSection>

              <ButtonGroup>
                <Button type="button" onClick={onClose} $variant="secondary">
                  Hủy
                </Button>
                <Button type="submit" $variant="primary" disabled={loading}>
                  {loading ? "Đang tạo..." : "Tạo đơn"}
                </Button>
              </ButtonGroup>
            </Form>
          </>
        )}
      </Modal>
    </ModalOverlay>
  );
}

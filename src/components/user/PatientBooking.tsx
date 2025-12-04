import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  createPatientOrder,
  getAllPurposes,
  type PurposeResponse,
  type CreateOrderRequest,
  type OrderDetailItem,
} from "../../api/apiOrder";
import { getAllWorkSlots, type WorkSlotResponse } from "../../api/apiWorkSlot";
import {
  getAllActiveTypeTests,
  type TypeTestResponse,
} from "../../api/apiTypeTest";
import { getAllActiveLabUsers, type LabUserResponse } from "../../api/apiLabUser";
import { getPatientByAccountId } from "../../api/apiPatient";
import LoadingSpinner from "../common/LoadingSpinner";

/* ---------- Types ---------- */

interface OrderFormData {
  purposeId: string;
  labUserId: string;
  note: string;
  dateBook: string;
  workSlotId: string;
}

/* ---------- Styled Components ---------- */

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }

  option {
    color: #1f2937;
    background: white;
    padding: 0.5rem;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const TypeTestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
`;

const TypeTestCard = styled.div<{ $selected: boolean }>`
  padding: 1rem;
  border: 2px solid ${(p) => (p.$selected ? "#dc2626" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(p) => (p.$selected ? "#fef2f2" : "white")};

  &:hover {
    border-color: #dc2626;
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
  }
`;

const TypeTestCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const TypeTestCheckbox = styled.input`
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  accent-color: #dc2626;
`;

const TypeTestTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const TypeTestDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0;
`;

const TypeTestPrice = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #dc2626;
  margin-top: 0.5rem;
`;

const SummaryBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SummaryText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const SummaryTotal = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #dc2626;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${(p) =>
    p.$variant === "primary"
      ? `
    background: #dc2626;
    color: white;
    &:hover:not(:disabled) {
      background: #b91c1c;
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
`;

const SuccessMessage = styled.div`
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 0.5rem;
  padding: 1rem;
  color: #166534;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/* ---------- Component ---------- */

const PatientBooking: React.FC = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<OrderFormData>();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [patientId, setPatientId] = useState<number | null>(null);
  const [purposes, setPurposes] = useState<PurposeResponse[]>([]);
  const [filteredWorkSlots, setFilteredWorkSlots] = useState<WorkSlotResponse[]>([]); // Filtered work slots
  const [typeTests, setTypeTests] = useState<TypeTestResponse[]>([]);
  const [labUsers, setLabUsers] = useState<LabUserResponse[]>([]);
  const [selectedTypeTests, setSelectedTypeTests] = useState<OrderDetailItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Watch form changes
  const selectedLabUserId = watch("labUserId");
  const selectedDate = watch("dateBook");

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  // Fetch work slots when lab user or date changes
  useEffect(() => {
    if (selectedLabUserId && selectedDate) {
      fetchWorkSlotsByLabUserAndDate(parseInt(selectedLabUserId), selectedDate);
    } else if (selectedLabUserId) {
      // Fetch all work slots for selected lab user (no date filter)
      fetchWorkSlotsByLabUser(parseInt(selectedLabUserId));
    } else {
      setFilteredWorkSlots([]);
    }
  }, [selectedLabUserId, selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch patient info
      const patientData = await getPatientByAccountId(user!.id);
      setPatientId(patientData.patientId);

      // Fetch all options (except work slots - will fetch later)
      const [purposesData, typeTestsData, labUsersData] = await Promise.all([
        getAllPurposes(),
        getAllActiveTypeTests(),
        getAllActiveLabUsers(),
      ]);

      setPurposes(purposesData);
      setTypeTests(typeTestsData);
      setLabUsers(labUsersData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkSlotsByLabUser = async (labUserId: number) => {
    try {
      const workSlotsData = await getAllWorkSlots();
      // Filter by labUserId and isActive
      const filtered = workSlotsData.filter(
        (slot) => slot.labUserId === labUserId && slot.isActive
      );
      setFilteredWorkSlots(filtered);
    } catch (error: any) {
      console.error("Error fetching work slots:", error);
      toast.error("Không thể tải danh sách ca làm việc.");
    }
  };

  const fetchWorkSlotsByLabUserAndDate = async (labUserId: number, date: string) => {
    try {
      const workSlotsData = await getAllWorkSlots();
      // Filter by labUserId, date, and isActive
      const filtered = workSlotsData.filter(
        (slot) =>
          slot.labUserId === labUserId &&
          slot.date === date &&
          slot.isActive
      );
      setFilteredWorkSlots(filtered);
    } catch (error: any) {
      console.error("Error fetching work slots:", error);
      toast.error("Không thể tải danh sách ca làm việc.");
    }
  };

  const handleTypeTestToggle = (typeTest: TypeTestResponse) => {
    setSelectedTypeTests((prev) => {
      const isSelected = prev.some((item) => item.typeTestId === typeTest.typeTestId);
      if (isSelected) {
        return prev.filter((item) => item.typeTestId !== typeTest.typeTestId);
      } else {
        return [...prev, { typeTestId: typeTest.typeTestId, totalPrice: typeTest.price }];
      }
    });
  };

  const totalAmount = selectedTypeTests.reduce((sum, item) => sum + item.totalPrice, 0);

  const onSubmit = async (data: OrderFormData) => {
    if (!patientId) {
      toast.error("Không tìm thấy thông tin bệnh nhân");
      return;
    }

    if (selectedTypeTests.length === 0) {
      toast.error("Vui lòng chọn ít nhất một loại xét nghiệm");
      return;
    }

    try {
      setSubmitting(true);

      const orderData: CreateOrderRequest = {
        patientId: patientId,
        purposeId: parseInt(data.purposeId),
        labUserId: data.labUserId ? parseInt(data.labUserId) : undefined,
        note: data.note || undefined,
        dateBook: data.dateBook || undefined,
        workSlotId: data.workSlotId ? parseInt(data.workSlotId) : undefined,
        orderDetails: selectedTypeTests,
      };

      await createPatientOrder(orderData);

      toast.success("Đặt lịch xét nghiệm thành công!");
      setShowSuccess(true);
      reset();
      setSelectedTypeTests([]);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      console.error("Error creating order:", error);
      const errorMessage = error.response?.data?.message || "Không thể tạo đơn đặt lịch. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>Đặt Lịch Xét Nghiệm</Title>
        <Subtitle>Chọn loại xét nghiệm và thời gian phù hợp với bạn</Subtitle>

        {showSuccess && (
          <SuccessMessage>
            <span>✓</span>
            <div>
              <strong>Đặt lịch thành công!</strong>
              <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                Chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn.
              </div>
            </div>
          </SuccessMessage>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Purpose */}
          <FormGroup>
            <Label>
              Mục đích khám <span style={{ color: "#ef4444" }}>*</span>
            </Label>
            <Select {...register("purposeId", { required: "Vui lòng chọn mục đích khám" })}>
              <option value="">-- Chọn mục đích khám --</option>
              {purposes.map((purpose) => (
                <option key={purpose.purposeId} value={purpose.purposeId}>
                  {purpose.name}
                </option>
              ))}
            </Select>
            {errors.purposeId && <ErrorMessage>{errors.purposeId.message}</ErrorMessage>}
          </FormGroup>

          {/* Type Tests */}
          <FormGroup>
            <Label>
              Chọn loại xét nghiệm <span style={{ color: "#ef4444" }}>*</span>
            </Label>
            {typeTests.length === 0 ? (
              <EmptyState>Không có loại xét nghiệm nào để chọn.</EmptyState>
            ) : (
              <TypeTestGrid>
                {typeTests.map((typeTest) => (
                  <TypeTestCard
                    key={typeTest.typeTestId}
                    $selected={selectedTypeTests.some(
                      (item) => item.typeTestId === typeTest.typeTestId
                    )}
                    onClick={() => handleTypeTestToggle(typeTest)}
                  >
                    <TypeTestCardHeader>
                      <TypeTestCheckbox
                        type="checkbox"
                        checked={selectedTypeTests.some(
                          (item) => item.typeTestId === typeTest.typeTestId
                        )}
                        onChange={() => handleTypeTestToggle(typeTest)}
                      />
                      <TypeTestTitle>{typeTest.typeName}</TypeTestTitle>
                    </TypeTestCardHeader>
                    <TypeTestDescription>{typeTest.description}</TypeTestDescription>
                    <TypeTestPrice>
                      {typeTest.price.toLocaleString("vi-VN")} VNĐ
                    </TypeTestPrice>
                  </TypeTestCard>
                ))}
              </TypeTestGrid>
            )}
            {selectedTypeTests.length === 0 && errors.purposeId && (
              <ErrorMessage>Vui lòng chọn ít nhất một loại xét nghiệm</ErrorMessage>
            )}
            <SummaryBox>
              <SummaryText>
                Đã chọn: {selectedTypeTests.length} loại xét nghiệm
              </SummaryText>
              <SummaryTotal>
                {totalAmount.toLocaleString("vi-VN")} VNĐ
              </SummaryTotal>
            </SummaryBox>
          </FormGroup>

          {/* Lab User - Moved to top */}
          <FormGroup>
            <Label>Người phụ trách (tùy chọn)</Label>
            <Select {...register("labUserId")}>
              <option value="">-- Chọn người phụ trách --</option>
              {labUsers.map((labUser) => (
                <option key={labUser.labUserId} value={labUser.labUserId}>
                  {labUser.fullName} - {labUser.email}
                </option>
              ))}
            </Select>
          </FormGroup>

          {/* Date Book */}
          <FormGroup>
            <Label>Ngày hẹn (tùy chọn)</Label>
            <Input type="date" {...register("dateBook")} />
          </FormGroup>

          {/* Work Slot */}
          <FormGroup>
            <Label>Ca làm việc (tùy chọn)</Label>
            <Select {...register("workSlotId")} disabled={!selectedLabUserId}>
              <option value="">
                {selectedLabUserId
                  ? "-- Chọn ca làm việc --"
                  : "-- Vui lòng chọn người phụ trách trước --"}
              </option>
              {filteredWorkSlots.map((slot) => (
                <option key={slot.workSlotId} value={slot.workSlotId}>
                  {slot.workSessionName} ({slot.startTime} - {slot.endTime})
                </option>
              ))}
            </Select>
            {selectedLabUserId && filteredWorkSlots.length === 0 && (
              <EmptyState style={{ padding: "0.5rem", marginTop: "0.5rem" }}>
                Người phụ trách này chưa có ca làm việc nào
              </EmptyState>
            )}
          </FormGroup>

          {/* Note */}
          <FormGroup>
            <Label>Ghi chú (tùy chọn)</Label>
            <Textarea
              {...register("note")}
              placeholder="Nhập ghi chú nếu có..."
            />
          </FormGroup>

          {/* Buttons */}
          <ButtonGroup>
            <Button
              type="button"
              $variant="secondary"
              onClick={() => {
                reset();
                setSelectedTypeTests([]);
              }}
            >
              Đặt lại
            </Button>
            <Button type="submit" $variant="primary" disabled={submitting}>
              {submitting ? "Đang xử lý..." : "Đặt lịch"}
            </Button>
          </ButtonGroup>
        </Form>
      </Card>
    </Container>
  );
};

export default PatientBooking;


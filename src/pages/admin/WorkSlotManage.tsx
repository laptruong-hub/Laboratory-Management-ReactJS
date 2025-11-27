import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaClock,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getAllWorkSlots,
  getAvailableDoctors,
  createWorkSlot,
  updateWorkSlot,
  cancelWorkSlot,
  deleteWorkSlot,
  type WorkSlotResponse,
  type CreateWorkSlotRequest,
  type UpdateWorkSlotRequest,
  type DoctorResponse,
  type WorkSlotStatus,
  WorkSlotStatusValues,
} from "../../api/apiWorkSlot";
import LoadingSpinner from "../../components/common/LoadingSpinner";

/* ---------- Styled Components ---------- */
const PageContainer = styled.div`
  width: 100%;
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

const Breadcrumb = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  span {
    margin: 0 0.5rem;
  }
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
  max-width: 25rem;
  min-width: 0;

  input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 0.9rem;
    margin-left: 0.5rem;
    background: #ffffff;
    color: #1f2937;
    min-width: 0;

    &::placeholder {
      color: #94a3b8;
    }
  }
  svg {
    color: #9ca3af;
    flex-shrink: 0;
  }
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" | "danger" }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  ${(props) => {
    if (props.$variant === "primary") {
      return `background-color:#dc2626;color:white; &:hover{background-color:#b91c1c}`;
    } else if (props.$variant === "danger") {
      return `background-color:#ef4444;color:white; &:hover{background-color:#dc2626}`;
    } else {
      return `background:white;color:#4b5563;border:1px solid #e5e7eb; &:hover{background:#f9fafb}`;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterSelect = styled.select`
  padding: 0.65rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background: white;
  color: #1f2937;
  cursor: pointer;
  min-width: 150px;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.06);
  overflow: hidden;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const TableWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  box-sizing: border-box;

  scrollbar-width: thin;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 0.25rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f9fafb;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  white-space: nowrap;

  &:first-child {
    width: 4rem;
    text-align: center;
  }

  &:last-child {
    width: 10rem;
    text-align: center;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #1f2937;
  vertical-align: middle;

  &:first-child {
    text-align: center;
    color: #6b7280;
    font-weight: 500;
  }

  &:last-child {
    text-align: center;
  }
`;

const StatusBadge = styled.span<{ $status: WorkSlotStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${(props) => {
    switch (props.$status) {
      case "AVAILABLE":
        return `background-color:#dcfce7;color:#166534;`;
      case "BOOKED":
        return `background-color:#dbeafe;color:#1e40af;`;
      case "CANCELLED":
        return `background-color:#f3f4f6;color:#4b5563;`;
      case "COMPLETED":
        return `background-color:#fef3c7;color:#92400e;`;
      default:
        return `background-color:#f3f4f6;color:#6b7280;`;
    }
  }}
`;

const ActionButton = styled.button<{ $variant?: "edit" | "cancel" | "delete" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.35rem;
  margin: 0 0.25rem;

  ${(props) => {
    if (props.$variant === "edit") {
      return `background-color:#fef3c7;color:#92400e; &:hover{background-color:#fde68a}`;
    } else if (props.$variant === "cancel") {
      return `background-color:#fee2e2;color:#991b1b; &:hover{background-color:#fecaca}`;
    } else if (props.$variant === "delete") {
      return `background-color:#fee2e2;color:#991b1b; &:hover{background-color:#fecaca}`;
    }
    return `background-color:#f3f4f6;color:#6b7280; &:hover{background-color:#e5e7eb}`;
  }}
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
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
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;

  span {
    color: #dc2626;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #1f2937;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #1f2937;
  background: white;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #1f2937;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const DoctorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DoctorName = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const DoctorContact = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

const DateTimeDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DateText = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const TimeText = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

/* ---------- Component ---------- */
const WorkSlotManage: React.FC = () => {
  const [workSlots, setWorkSlots] = useState<WorkSlotResponse[]>([]);
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [doctorFilter, setDoctorFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<WorkSlotResponse | null>(null);
  const [formData, setFormData] = useState<CreateWorkSlotRequest>({
    doctorId: 0,
    startTime: "",
    endTime: "",
    notes: "",
  });

  // Fetch work slots and doctors
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [workSlotsData, doctorsData] = await Promise.all([
        getAllWorkSlots(),
        getAvailableDoctors(true),
      ]);
      setWorkSlots(workSlotsData);
      setDoctors(doctorsData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Filter work slots
  const filteredWorkSlots = useMemo(() => {
    return workSlots.filter((slot) => {
      // Search filter
      const doctor = doctors.find((d) => d.userId === slot.doctorId);
      const matchesSearch =
        !searchQuery ||
        doctor?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor?.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "ALL" || slot.status === statusFilter;

      // Doctor filter
      const matchesDoctor = doctorFilter === "ALL" || slot.doctorId.toString() === doctorFilter;

      return matchesSearch && matchesStatus && matchesDoctor;
    });
  }, [workSlots, doctors, searchQuery, statusFilter, doctorFilter]);

  // Get doctor name by ID
  const getDoctorName = (doctorId: number) => {
    const doctor = doctors.find((d) => d.userId === doctorId);
    return doctor ? doctor.fullName : `Doctor #${doctorId}`;
  };

  const getDoctorEmail = (doctorId: number) => {
    const doctor = doctors.find((d) => d.userId === doctorId);
    return doctor?.email || "";
  };

  // Format date time
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  // Open modal for create
  const handleCreate = () => {
    setEditingSlot(null);
    setFormData({
      doctorId: doctors.length > 0 ? doctors[0].userId : 0,
      startTime: "",
      endTime: "",
      notes: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (slot: WorkSlotResponse) => {
    setEditingSlot(slot);
    setFormData({
      doctorId: slot.doctorId,
      startTime: slot.startTime.substring(0, 16), // Format for datetime-local input
      endTime: slot.endTime.substring(0, 16),
      notes: slot.notes || "",
    });
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSlot) {
        // Update
        const updateRequest: UpdateWorkSlotRequest = {
          startTime: formData.startTime ? new Date(formData.startTime).toISOString() : undefined,
          endTime: formData.endTime ? new Date(formData.endTime).toISOString() : undefined,
          notes: formData.notes,
        };
        await updateWorkSlot(editingSlot.workSlotId, updateRequest);
        toast.success("Cập nhật lịch làm việc thành công!");
      } else {
        // Create
        const createRequest: CreateWorkSlotRequest = {
          doctorId: formData.doctorId,
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
          notes: formData.notes,
        };
        await createWorkSlot(createRequest);
        toast.success("Tạo lịch làm việc thành công!");
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (error: any) {
      console.error("Error saving work slot:", error);
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  // Handle cancel
  const handleCancel = async (slotId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch làm việc này?")) {
      return;
    }

    try {
      await cancelWorkSlot(slotId);
      toast.success("Hủy lịch làm việc thành công!");
      await fetchData();
    } catch (error: any) {
      console.error("Error cancelling work slot:", error);
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  // Handle delete
  const handleDelete = async (slotId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch làm việc này?")) {
      return;
    }

    try {
      await deleteWorkSlot(slotId);
      toast.success("Xóa lịch làm việc thành công!");
      await fetchData();
    } catch (error: any) {
      console.error("Error deleting work slot:", error);
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  // Get status label
  const getStatusLabel = (status: WorkSlotStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "Có sẵn";
      case "BOOKED":
        return "Đã đặt";
      case "CANCELLED":
        return "Đã hủy";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner fullScreen text="Đang tải dữ liệu..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Toolbar>
        <SearchBox>
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bác sĩ hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>

        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value={WorkSlotStatusValues.AVAILABLE}>Có sẵn</option>
          <option value={WorkSlotStatusValues.BOOKED}>Đã đặt</option>
          <option value={WorkSlotStatusValues.CANCELLED}>Đã hủy</option>
          <option value={WorkSlotStatusValues.COMPLETED}>Hoàn thành</option>
        </FilterSelect>

        <FilterSelect
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
        >
          <option value="ALL">Tất cả bác sĩ</option>
          {doctors.map((doctor) => (
            <option key={doctor.userId} value={doctor.userId.toString()}>
              {doctor.fullName}
            </option>
          ))}
        </FilterSelect>

        <Button $variant="primary" onClick={handleCreate}>
          <FaPlus />
          Tạo lịch làm việc
        </Button>
      </Toolbar>

      <TableContainer>
        <TableWrapper>
          {filteredWorkSlots.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📅</EmptyIcon>
              <EmptyText>Không tìm thấy lịch làm việc nào</EmptyText>
            </EmptyState>
          ) : (
            <Table>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>Bác sĩ</TableHeaderCell>
                  <TableHeaderCell>Thời gian bắt đầu</TableHeaderCell>
                  <TableHeaderCell>Thời gian kết thúc</TableHeaderCell>
                  <TableHeaderCell>Trạng thái</TableHeaderCell>
                  <TableHeaderCell>Ghi chú</TableHeaderCell>
                  <TableHeaderCell>Thao tác</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {filteredWorkSlots.map((slot) => {
                  const startDateTime = formatDateTime(slot.startTime);
                  const endDateTime = formatDateTime(slot.endTime);
                  return (
                    <TableRow key={slot.workSlotId}>
                      <TableCell>#{slot.workSlotId}</TableCell>
                      <TableCell>
                        <DoctorInfo>
                          <DoctorName>{getDoctorName(slot.doctorId)}</DoctorName>
                          <DoctorContact>{getDoctorEmail(slot.doctorId)}</DoctorContact>
                        </DoctorInfo>
                      </TableCell>
                      <TableCell>
                        <DateTimeDisplay>
                          <DateText>{startDateTime.date}</DateText>
                          <TimeText>
                            <FaClock size={12} style={{ marginRight: "4px" }} />
                            {startDateTime.time}
                          </TimeText>
                        </DateTimeDisplay>
                      </TableCell>
                      <TableCell>
                        <DateTimeDisplay>
                          <DateText>{endDateTime.date}</DateText>
                          <TimeText>
                            <FaClock size={12} style={{ marginRight: "4px" }} />
                            {endDateTime.time}
                          </TimeText>
                        </DateTimeDisplay>
                      </TableCell>
                      <TableCell>
                        <StatusBadge $status={slot.status}>
                          {getStatusLabel(slot.status)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        {slot.notes ? (
                          <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {slot.notes}
                          </div>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {slot.status !== WorkSlotStatusValues.CANCELLED &&
                          slot.status !== WorkSlotStatusValues.COMPLETED && (
                            <>
                              <ActionButton $variant="edit" onClick={() => handleEdit(slot)} title="Chỉnh sửa">
                                <FaEdit />
                              </ActionButton>
                              <ActionButton $variant="cancel" onClick={() => handleCancel(slot.workSlotId)} title="Hủy">
                                <FaTimes />
                              </ActionButton>
                            </>
                          )}
                        <ActionButton
                          $variant="delete"
                          onClick={() => handleDelete(slot.workSlotId)}
                          title="Xóa"
                        >
                          <FaTrash />
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableWrapper>
      </TableContainer>

      {/* Create/Edit Modal */}
      <ModalOverlay $isOpen={isModalOpen} onClick={() => setIsModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{editingSlot ? "Chỉnh sửa lịch làm việc" : "Tạo lịch làm việc mới"}</ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                Bác sĩ <span>*</span>
              </Label>
              <Select
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: parseInt(e.target.value) })}
                required
                disabled={!!editingSlot}
              >
                <option value={0}>Chọn bác sĩ</option>
                {doctors.map((doctor) => (
                  <option key={doctor.userId} value={doctor.userId}>
                    {doctor.fullName} - {doctor.email}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                Thời gian bắt đầu <span>*</span>
              </Label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Thời gian kết thúc <span>*</span>
              </Label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Ghi chú</Label>
              <TextArea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Nhập ghi chú (nếu có)..."
              />
            </FormGroup>

            <ModalFooter>
              <Button type="button" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" $variant="primary">
                <FaCheck />
                {editingSlot ? "Cập nhật" : "Tạo mới"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalOverlay>
    </PageContainer>
  );
};

export default WorkSlotManage;


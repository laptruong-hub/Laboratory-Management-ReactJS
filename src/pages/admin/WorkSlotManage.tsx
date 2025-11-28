import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FaCalendarDay, FaCheck, FaSyncAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  createWorkSlot,
  deleteWorkSlot,
  getAvailableDoctors,
  getWorkSessions,
  getWorkSlotsByLabUserAndDate,
  type CreateWorkSlotRequest,
  type DoctorResponse,
  type WorkSessionResponse,
  type WorkSlotResponse,
} from "../../api/apiWorkSlot";
import LoadingSpinner from "../../components/common/LoadingSpinner";

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
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ControlsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background: white;
  color: #1f2937;
  flex: 1;
  min-width: 220px;
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  color: #1f2937;
  background: white;
  flex: 1;
  min-width: 200px;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  white-space: nowrap;
  ${(props) =>
    props.$variant === "primary"
      ? `background:#dc2626;color:white; &:hover{background:#b91c1c}`
      : `background:white;color:#374151;border:1px solid #e5e7eb;&:hover{background:#f9fafb;}`}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #6b7280;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const LegendColor = styled.span<{ $active?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: ${(p) => (p.$active ? "#dc2626" : "#e5e7eb")};
  border: 1px solid ${(p) => (p.$active ? "#b91c1c" : "#d1d5db")};
`;

const ScheduleGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DayCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.05);
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const DayTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
`;

const SessionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SessionButton = styled.button<{ $active?: boolean }>`
  padding: 0.65rem 1.1rem;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? "#dc2626" : "#d1d5db")};
  background: ${(p) => (p.$active ? "#fee2e2" : "white")};
  color: ${(p) => (p.$active ? "#b91c1c" : "#374151")};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  &:hover:not(:disabled) {
    background: ${(p) => (p.$active ? "#fecaca" : "#f3f4f6")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  border: 1px dashed #e5e7eb;
  border-radius: 0.75rem;
  background: white;
`;

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const InlineSpinner = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #6b7280;
`;

const WorkSlotManage: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const weekAhead = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [sessions, setSessions] = useState<WorkSessionResponse[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(weekAhead);
  const [schedule, setSchedule] = useState<Record<string, Record<number, WorkSlotResponse>>>({});
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [processingKey, setProcessingKey] = useState<string | null>(null);

  const dateRange = useMemo(() => getDateRangeArray(startDate, endDate), [startDate, endDate]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        setLoadingMeta(true);
        const [doctorData, sessionData] = await Promise.all([
          getAvailableDoctors(true),
          getWorkSessions(),
        ]);
        setDoctors(doctorData);
        setSessions(sessionData);
        if (doctorData.length > 0) {
          setSelectedDoctor(String(doctorData[0].userId));
        }
      } catch (error: any) {
        console.error("Failed to load work slot metadata", error);
        toast.error("Không thể tải danh sách bác sĩ/ca làm việc.");
      } finally {
        setLoadingMeta(false);
      }
    };

    loadMeta();
  }, []);

  useEffect(() => {
    if (!selectedDoctor || dateRange.length === 0) {
      setSchedule({});
      return;
    }

    const fetchSchedule = async () => {
      try {
        setLoadingSchedule(true);
        const requests = dateRange.map((date) =>
          getWorkSlotsByLabUserAndDate(Number(selectedDoctor), date)
        );
        const responses = await Promise.all(requests);
        const mapped: Record<string, Record<number, WorkSlotResponse>> = {};
        dateRange.forEach((date, index) => {
          mapped[date] = responses[index].reduce<Record<number, WorkSlotResponse>>((acc, slot) => {
            acc[slot.workSessionId] = slot;
            return acc;
          }, {});
        });
        setSchedule(mapped);
      } catch (error: any) {
        console.error("Failed to load work slots", error);
        toast.error("Không thể tải lịch làm việc.");
      } finally {
        setLoadingSchedule(false);
      }
    };

    fetchSchedule();
  }, [selectedDoctor, dateRange]);

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (!value) return;
    if (type === "start") {
      setStartDate(value);
      if (new Date(value) > new Date(endDate)) {
        setEndDate(value);
      }
    } else {
      if (new Date(value) < new Date(startDate)) {
        toast.warn("Ngày kết thúc phải sau ngày bắt đầu.");
        return;
      }
      setEndDate(value);
    }
  };

  const handleToggleSession = async (date: string, sessionId: number, enable: boolean) => {
    if (!selectedDoctor) {
      toast.warn("Vui lòng chọn bác sĩ trước.");
      return;
    }

    const key = `${date}-${sessionId}`;
    setProcessingKey(key);
    try {
      if (enable) {
        const payload: CreateWorkSlotRequest = {
          labUserId: Number(selectedDoctor),
          workSessionId: sessionId,
          date,
          quantity: 0,
        };
        await createWorkSlot(payload);
        const sessionName = sessions.find((s) => s.workSessionId === sessionId)?.workSession || "ca";
        toast.success(`Đã tạo ${sessionName.toLowerCase()} cho ${date}`);
      } else {
        const slot = schedule[date]?.[sessionId];
        if (slot) {
          await deleteWorkSlot(slot.workSlotId);
          toast.success("Đã hủy ca làm việc.");
        }
      }
      const refreshed = await getWorkSlotsByLabUserAndDate(Number(selectedDoctor), date);
      setSchedule((prev) => ({
        ...prev,
        [date]: refreshed.reduce<Record<number, WorkSlotResponse>>((acc, slot) => {
          acc[slot.workSessionId] = slot;
          return acc;
        }, {}),
      }));
    } catch (error: any) {
      console.error("Failed to update work slot", error);
      const message = error.response?.data?.message || "Không thể cập nhật ca làm việc.";
      toast.error(message);
    } finally {
      setProcessingKey(null);
    }
  };

  const renderContent = () => {
    if (!selectedDoctor) {
      return (
        <EmptyState>
          <EmptyIcon>🩺</EmptyIcon>
          Vui lòng chọn bác sĩ để xem và thiết lập lịch làm việc.
        </EmptyState>
      );
    }

    if (loadingSchedule) {
      return (
        <EmptyState>
          <InlineSpinner>
            <FaSyncAlt className="spin" /> Đang tải lịch làm việc...
          </InlineSpinner>
        </EmptyState>
      );
    }

    if (dateRange.length === 0) {
      return (
        <EmptyState>
          <EmptyIcon>📅</EmptyIcon>
          Khoảng ngày không hợp lệ. Vui lòng chọn lại.
        </EmptyState>
      );
    }

    return (
      <ScheduleGrid>
        {dateRange.map((date) => {
          const slotsForDay = schedule[date] || {};
          const formatted = formatDisplayDate(date);
          return (
            <DayCard key={date}>
              <DayHeader>
                <DayTitle>{formatted}</DayTitle>
                <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Ngày {date}</span>
              </DayHeader>
              <SessionButtons>
                {sessions.map((session) => {
                  const isActive = Boolean(slotsForDay[session.workSessionId]);
                  const isProcessing = processingKey === `${date}-${session.workSessionId}`;
                  return (
                    <SessionButton
                      key={session.workSessionId}
                      $active={isActive}
                      onClick={() => handleToggleSession(date, session.workSessionId, !isActive)}
                      disabled={isProcessing}
                    >
                      {isActive && <FaCheck size={12} />}
                      {session.workSession}
                    </SessionButton>
                  );
                })}
              </SessionButtons>
            </DayCard>
          );
        })}
      </ScheduleGrid>
    );
  };

  if (loadingMeta) {
    return (
      <PageContainer>
        <LoadingSpinner fullScreen text="Đang tải cấu hình lịch làm việc..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Lịch làm việc bác sĩ</PageTitle>
        <Breadcrumb>Quản lý lịch làm việc ▸ Phân ca theo ngày</Breadcrumb>
      </PageHeader>

      <Toolbar>
        <ControlsRow>
          <Select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
            {doctors.length === 0 && <option value="">Chưa có bác sĩ nào</option>}
            {doctors.map((doctor) => (
              <option key={doctor.userId} value={doctor.userId}>
                {doctor.fullName} ({doctor.email})
              </option>
            ))}
          </Select>

          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange("start", e.target.value)}
          />
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange("end", e.target.value)}
          />

          <Button
            $variant="secondary"
            onClick={() => {
              setStartDate(today);
              setEndDate(weekAhead);
            }}
          >
            <FaCalendarDay /> Đặt về tuần này
          </Button>
        </ControlsRow>

        <Legend>
          <LegendItem>
            <LegendColor $active /> Đã phân ca
          </LegendItem>
          <LegendItem>
            <LegendColor /> Chưa phân ca
          </LegendItem>
        </Legend>
      </Toolbar>

      {renderContent()}
    </PageContainer>
  );
};

const getDateRangeArray = (start: string, end: string): string[] => {
  if (!start || !end) return [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate > endDate) return [];
  const dates: string[] = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    dates.push(cursor.toISOString().split("T")[0]);
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
};

const formatDisplayDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default WorkSlotManage;

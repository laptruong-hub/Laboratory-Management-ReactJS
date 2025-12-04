import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FaCalendarDay, FaSyncAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getAvailableDoctors,
  getWorkSessions,
  getWorkSlotsByLabUserAndDate,
  type DoctorResponse,
  type WorkSessionResponse,
  type WorkSlotResponse,
} from "../../api/apiWorkSlot";
import LoadingSpinner from "../../components/common/LoadingSpinner";

/* ---------- Styled Components ---------- */

const PageContainer = styled.div`
  width: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden; /* ✅ Không scroll toàn trang, chỉ scroll trong các khối con */
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

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #f9fafb;
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

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: flex-start;
  min-height: 0;
  flex: 1; /* ✅ Chiếm toàn bộ chiều cao còn lại dưới header */
`;

const CalendarCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%; /* ✅ Co giãn theo chiều cao layout */
`;

const DetailsCard = styled(CalendarCard)`
  background: #f9fafb;
`;

const CardTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const MonthLabel = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.35rem;
  font-size: 0.8rem;
  user-select: none;
`;

const CalendarBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto; /* ✅ Nếu lịch cao hơn viewport, chỉ phần lịch tự scroll */
  padding-right: 0.25rem;
`;

const WeekdayCell = styled.div`
  text-align: center;
  font-weight: 600;
  color: #6b7280;
  padding-bottom: 0.25rem;
`;

const DayCell = styled.button<{
  $isToday?: boolean;
  $isSelected?: boolean;
  $hasSlots?: boolean;
}>`
  position: relative;
  height: 70px;
  border-radius: 0.6rem;
  border: 1px solid
    ${(p) =>
      p.$isSelected ? "#dc2626" : p.$hasSlots ? "#bbf7d0" : "#e5e7eb"};
  background: ${(p) =>
    p.$isSelected
      ? "#fee2e2"
      : p.$hasSlots
      ? "linear-gradient(135deg, #ecfdf3 0%, #dcfce7 100%)"
      : "white"};
  color: #111827;
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};
  padding: 0.35rem 0.4rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.15s ease;

  &:hover {
    ${(p) =>
      !p.disabled &&
      `box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
       transform: translateY(-1px);`}
  }
`;

const DayNumber = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
`;

const DayMeta = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #16a34a;
`;

const DetailsBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 0.25rem;
`;

const DetailHeader = styled.div`
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: #4b5563;
`;

const SessionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SessionCard = styled.div`
  background: white;
  border-radius: 0.6rem;
  border: 1px solid #e5e7eb;
  padding: 0.75rem 0.9rem;
`;

const SessionTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const SessionMeta = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
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

/* ---------- Component ---------- */

const LabUserWorkSchedule: React.FC = () => {
  const today = new Date();
  const currentMonthStr = today.toISOString().slice(0, 7); // yyyy-MM

  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [sessions, setSessions] = useState<WorkSessionResponse[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [workSlotsByDate, setWorkSlotsByDate] = useState<
    Record<string, WorkSlotResponse[]>
  >({});
  const [selectedDate, setSelectedDate] = useState<string | null>(
    today.toISOString().split("T")[0]
  );
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const monthInfo = useMemo(() => getMonthInfo(selectedMonth), [selectedMonth]);

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
    if (!selectedDoctor || monthInfo.days.length === 0) {
      setWorkSlotsByDate({});
      return;
    }

    const fetchSchedule = async () => {
      try {
        setLoadingSchedule(true);
        const requests = monthInfo.days.map((date) =>
          getWorkSlotsByLabUserAndDate(Number(selectedDoctor), date)
        );
        const responses = await Promise.all(requests);

        const map: Record<string, WorkSlotResponse[]> = {};
        monthInfo.days.forEach((date, index) => {
          map[date] = responses[index];
        });
        setWorkSlotsByDate(map);

        // Nếu selectedDate nằm ngoài tháng hiện tại, hoặc null → chọn ngày đầu tiên có ca
        if (!selectedDate || !monthInfo.days.includes(selectedDate)) {
          const firstWithSlots = monthInfo.days.find(
            (d) => map[d] && map[d].length > 0
          );
          setSelectedDate(firstWithSlots ?? monthInfo.days[0]);
        }
      } catch (error: any) {
        console.error("Failed to load work slots", error);
        toast.error("Không thể tải lịch làm việc.");
      } finally {
        setLoadingSchedule(false);
      }
    };

    void fetchSchedule();
    // ✅ Chỉ reload khi đổi bác sĩ hoặc tháng, KHÔNG reload khi click ngày
  }, [selectedDoctor, monthInfo]);

  const renderContent = () => {
    if (!selectedDoctor) {
      return (
        <EmptyState>
          <EmptyIcon>🩺</EmptyIcon>
          Vui lòng chọn bác sĩ để xem lịch làm việc.
        </EmptyState>
      );
    }

    const slotsForSelectedDay =
      (selectedDate && workSlotsByDate[selectedDate]) || [];

    return (
      <Layout>
        <CalendarCard>
          <CardTitle>Lịch làm việc theo tháng</CardTitle>
          <CalendarHeader>
            <MonthLabel>{monthInfo.label}</MonthLabel>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              Nhấn vào ngày được tô màu để xem chi tiết ca làm việc
            </span>
          </CalendarHeader>

          {loadingSchedule ? (
            <EmptyState>
              <InlineSpinner>
                <FaSyncAlt className="spin" /> Đang tải lịch làm việc...
              </InlineSpinner>
            </EmptyState>
          ) : (
            <CalendarBody>
              <CalendarGrid>
                {/* Weekday header */}
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                  <WeekdayCell key={d}>{d}</WeekdayCell>
                ))}

                {/* Calendar cells */}
                {monthInfo.cells.map((cell, idx) => {
                  if (!cell) {
                    return <div key={idx} />;
                  }
                  const hasSlots =
                    workSlotsByDate[cell] && workSlotsByDate[cell].length > 0;
                  const isSelected = selectedDate === cell;
                  const isToday = cell === today.toISOString().split("T")[0];
                  const dayNumber = parseInt(cell.slice(-2), 10);

                  return (
                    <DayCell
                      key={cell}
                      type="button"
                      $isToday={isToday}
                      $isSelected={isSelected}
                      $hasSlots={hasSlots}
                      disabled={!hasSlots}
                      onClick={() => hasSlots && setSelectedDate(cell)}
                    >
                      <DayNumber>
                        {dayNumber}
                        {isToday && (
                          <span
                            style={{
                              fontSize: "0.65rem",
                              color: "#dc2626",
                              marginLeft: 4,
                            }}
                          >
                            hôm nay
                          </span>
                        )}
                      </DayNumber>
                      <DayMeta>
                        {hasSlots ? (
                          <>
                            <Dot /> {workSlotsByDate[cell].length} ca
                          </>
                        ) : (
                          <span>Không có ca</span>
                        )}
                      </DayMeta>
                    </DayCell>
                  );
                })}
              </CalendarGrid>
            </CalendarBody>
          )}
        </CalendarCard>

        <DetailsCard>
          <CardTitle>Chi tiết ca làm việc</CardTitle>
          <DetailsBody>
            {!selectedDate ? (
              <EmptyState>
                <EmptyIcon>📅</EmptyIcon>
                Chọn một ngày trong lịch để xem chi tiết ca làm việc.
              </EmptyState>
            ) : slotsForSelectedDay.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📅</EmptyIcon>
                Không có ca làm việc trong ngày {selectedDate}.
              </EmptyState>
            ) : (
              <>
                <DetailHeader>
                  Ngày{" "}
                  {new Date(selectedDate).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  <br />
                  Tổng {slotsForSelectedDay.length} ca làm việc.
                </DetailHeader>
                <SessionList>
                  {slotsForSelectedDay.map((slot) => (
                    <SessionCard key={slot.workSlotId}>
                      <SessionTitle>{slot.workSessionName}</SessionTitle>
                      <SessionMeta>
                        {slot.startTime && slot.endTime && (
                          <div>
                            Thời gian: {slot.startTime} - {slot.endTime}
                          </div>
                        )}
                        <div>Số lượng tối đa: {slot.quantity}</div>
                        <div>
                          Trạng thái:{" "}
                          {slot.isActive ? "Đang mở nhận lịch" : "Đã khóa"}
                        </div>
                      </SessionMeta>
                    </SessionCard>
                  ))}
                </SessionList>
              </>
            )}
          </DetailsBody>
        </DetailsCard>
      </Layout>
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
        <PageDescription>
          Xem lịch làm việc theo tháng và chi tiết ca khám của từng ngày
        </PageDescription>
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
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />

          <Button
            onClick={() => {
              const now = new Date();
              const monthStr = now.toISOString().slice(0, 7);
              setSelectedMonth(monthStr);
              setSelectedDate(now.toISOString().split("T")[0]);
            }}
          >
            <FaCalendarDay /> Tháng hiện tại
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

const getMonthInfo = (monthStr: string) => {
  // monthStr: "yyyy-MM"
  const [yearStr, monthIndexStr] = monthStr.split("-");
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthIndexStr, 10) - 1; // 0-based

  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Monday-based index (0 = Mon, 6 = Sun)
  const startWeekday = (firstDay.getDay() + 6) % 7;

  const days: string[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, monthIndex, d);
    days.push(date.toISOString().split("T")[0]);
  }

  const cells: (string | null)[] = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push(null);
  }
  days.forEach((d) => cells.push(d));
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const label = firstDay.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  return { days, cells, label };
};

export default LabUserWorkSchedule;



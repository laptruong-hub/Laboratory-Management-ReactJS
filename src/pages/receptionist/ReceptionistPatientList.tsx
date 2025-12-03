import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FaSearch, FaMars, FaVenus } from "react-icons/fa";
import { getAllPatients, type PatientDto } from "../../api/apiPatient";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";

/* ---------- Types ---------- */

interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: boolean;
  dob?: string;
}

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

const PageDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
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
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
`;

const PatientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #dc2626;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const PatientDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PatientName = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const PatientContact = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const GenderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GenderIcon = styled.div<{ $isMale?: boolean }>`
  color: ${(p) => (p.$isMale ? "#3b82f6" : "#ec4899")};
  display: flex;
  align-items: center;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #6b7280;
`;

const adaptPatientFromDto = (dto: PatientDto): Patient => {
  return {
    id: String(dto.accountId || dto.patientId || ""),
    fullName: dto.fullName || "",
    email: dto.email || "",
    phone: dto.phoneNumber || dto.phone,
    gender: dto.gender,
    dob: dto.dob,
  };
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatGender = (gender?: boolean): string => {
  if (gender === undefined || gender === null) return "—";
  return gender ? "Nam" : "Nữ";
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("vi-VN");
  } catch {
    return "—";
  }
};

/* ---------- Component ---------- */

export default function ReceptionistPatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const patientData = await getAllPatients();
        const adapted = patientData.map(adaptPatientFromDto);
        setPatients(adapted);
      } catch (err: any) {
        console.error("Lỗi khi tải dữ liệu:", err);
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let result = [...patients];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [patients, search]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner fullScreen text="Đang tải danh sách bệnh nhân..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Danh sách bệnh nhân</PageTitle>
        <PageDescription>
          Xem thông tin và quản lý danh sách bệnh nhân trong hệ thống
        </PageDescription>
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

      <TableContainer>
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell style={{ width: "50px" }}>STT</TableHeaderCell>
                <TableHeaderCell>Bệnh nhân</TableHeaderCell>
                <TableHeaderCell style={{ width: "100px" }}>Giới tính</TableHeaderCell>
                <TableHeaderCell style={{ width: "120px" }}>Ngày sinh</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Số điện thoại</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <tr>
                  <TableCell colSpan={6}>
                    <EmptyState>Không tìm thấy bệnh nhân nào.</EmptyState>
                  </TableCell>
                </tr>
              ) : (
                filtered.map((patient, index) => (
                  <TableRow key={patient.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <PatientInfo>
                        <Avatar>{getInitials(patient.fullName)}</Avatar>
                        <PatientDetails>
                          <PatientName>{patient.fullName}</PatientName>
                        </PatientDetails>
                      </PatientInfo>
                    </TableCell>
                    <TableCell>
                      <GenderCell>
                        {patient.gender !== undefined && (
                          <GenderIcon $isMale={patient.gender === true}>
                            {patient.gender === true ? (
                              <FaMars size={12} />
                            ) : (
                              <FaVenus size={12} />
                            )}
                          </GenderIcon>
                        )}
                        <span>{formatGender(patient.gender)}</span>
                      </GenderCell>
                    </TableCell>
                    <TableCell>{formatDate(patient.dob)}</TableCell>
                    <TableCell>{patient.email || "—"}</TableCell>
                    <TableCell>{patient.phone || "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      </TableContainer>
    </PageContainer>
  );
}


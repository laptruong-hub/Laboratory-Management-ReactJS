import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaFilter,
  FaEdit,
  FaDownload,
  FaMars,
  FaVenus,
} from "react-icons/fa";
import { apiClient } from "../../api/apiClient";
import {
  getAllPatients,
  getPatientsFromIam,
  updatePatient,
  deletePatient,
  type PatientDto,
} from "../../api/apiPatient";
import { toast } from "react-toastify";

/* ---------- Types ---------- */
type PatientStatus = "active" | "pending" | "inactive";

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: boolean; // true = Nam, false = Nữ
  dob?: string;
  bloodType?: string;
  rhFactor?: string;
  status: PatientStatus;
  medicalHistory?: string;
}

// Interface cho dữ liệu từ API
// Khi fetch từ /api/patients: dùng PatientDto từ apiPatient
// Khi fetch từ /api/users (fallback): dùng interface này
interface PatientDtoFromUsers {
  id?: number; // ID khi fetch từ /api/users (fallback)
  fullName: string;
  email: string;
  phone?: string; // /api/users dùng phone
  gender?: boolean; // /api/users dùng boolean
  dob?: string;
  bloodType?: string;
  rhFactor?: string;
  isActive: boolean;
  medicalHistory?: string;
  userId?: number;
  roleName?: string;
  roleId?: number;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
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
  ${(props) =>
    props.$variant === "primary"
      ? `background-color:#2563eb;color:white; &:hover{background-color:#1d4ed8}`
      : `background:white;color:#4b5563;border:1px solid #e5e7eb; &:hover{background:#f9fafb}`}
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
    width: 8rem;
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

const PatientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
`;

const PatientDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  flex: 1;
`;

const PatientName = styled.div`
  font-weight: 600;
  color: #1f2937;
  word-break: break-word;
`;

const PatientContact = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  word-break: break-word;
`;

const GenderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
`;

const GenderIcon = styled.div<{ $isMale: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: ${(props) => (props.$isMale ? "#dbeafe" : "#fce7f3")};
  color: ${(props) => (props.$isMale ? "#2563eb" : "#db2777")};
  flex-shrink: 0;
`;

const BloodGroupBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #fee2e2;
  color: #dc2626;
  white-space: nowrap;
`;

const StatusBadge = styled.span<{ $status: PatientStatus }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  background: ${(props) => {
    switch (props.$status) {
      case "active":
        return "#d1fae5";
      case "pending":
        return "#fed7aa";
      case "inactive":
        return "#f3f4f6";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "active":
        return "#059669";
      case "pending":
        return "#d97706";
      case "inactive":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  }};
`;

const ActionButtonsCell = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  background: white;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #dc2626;
    color: #dc2626;
  }

  &:first-child:hover {
    border-color: #2563eb;
    color: #2563eb;
  }
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  flex-shrink: 0;
`;

const PaginationInfo = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: white;
  color: #4b5563;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ---------- Modal Styled Components ---------- */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
  overflow-y: auto;
  box-sizing: border-box;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 36rem;
  max-height: calc(100vh - 2rem);
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: auto;
`;

const ModalHeader = styled.div`
  padding: 1rem 1.25rem;
  font-weight: 800;
  border-bottom: 1px solid #eef2f6;
  font-size: 1.1rem;
  color: #111827;
  flex-shrink: 0;
`;

const ModalBody = styled.div`
  padding: 1rem 1.25rem;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  box-sizing: border-box;

  scrollbar-width: thin;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 0.25rem;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 0.25rem;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #eef2f6;
  flex-shrink: 0;
  background: white;
  box-sizing: border-box;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-shrink: 0;
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #2563eb;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;
  background: white;
  cursor: pointer;

  &:focus {
    border-color: #2563eb;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;
  resize: vertical;
  min-height: 4rem;

  &:focus {
    border-color: #2563eb;
  }
`;

/* ---------- Helper Functions ---------- */
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "—";
  try {
    // Backend trả về LocalDate format "YYYY-MM-DD" (không có time)
    // Nếu có format "YYYY-MM-DD", parse trực tiếp để tránh timezone issues
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    }

    // Nếu có format khác (ISO 8601 với time), dùng Date object
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";

    const day = String(date.getDate()).padStart(2, "0");
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");
    const yearStr = date.getFullYear();
    return `${day}/${monthStr}/${yearStr}`;
  } catch {
    return "—";
  }
};

const formatGender = (gender?: boolean): string => {
  if (gender === true) return "Nam";
  if (gender === false) return "Nữ";
  return "—";
};

const formatBloodGroup = (bloodType?: string, rhFactor?: string): string => {
  if (!bloodType) return "—";
  const rh = rhFactor || "";
  return `${bloodType}${rh}`;
};

const formatStatus = (status: PatientStatus): string => {
  switch (status) {
    case "active":
      return "Đang hoạt động";
    case "pending":
      return "Chờ xác nhận";
    case "inactive":
      return "Không hoạt động";
    default:
      return "—";
  }
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length === 0) return "?";
  const lastPart = parts[parts.length - 1];
  return lastPart[0]?.toUpperCase() || "?";
};

const adaptPatientFromDto = (dto: PatientDto): Patient => {
  // Convert gender string to boolean for UI
  let genderBoolean: boolean | undefined = undefined;
  if (dto.gender === "Nam") {
    genderBoolean = true;
  } else if (dto.gender === "Nữ") {
    genderBoolean = false;
  }

  return {
    id: dto.accountId.toString(),
    fullName: dto.fullName,
    email: dto.email,
    phone: dto.phoneNumber,
    gender: genderBoolean,
    dob: dto.dob, // Map ngày sinh từ DTO
    bloodType: undefined, // Not in API
    rhFactor: undefined, // Not in API
    status: dto.isActive ? "active" : "pending",
    medicalHistory: undefined, // Not in API
  };
};

// Adapt từ PatientDtoFromUsers (từ /api/users fallback)
const adaptPatientFromUsers = (dto: PatientDtoFromUsers): Patient => {
  const accountId = dto.id || dto.userId || 0;

  return {
    id: accountId.toString(),
    fullName: dto.fullName,
    email: dto.email,
    phone: dto.phone,
    gender: dto.gender,
    dob: dto.dob,
    bloodType: dto.bloodType,
    rhFactor: dto.rhFactor,
    status: dto.isActive ? "active" : "pending",
    medicalHistory: dto.medicalHistory,
  };
};

/* ---------- Main Component ---------- */
const PatientManage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const searchRef = useRef<HTMLInputElement>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editData, setEditData] = useState({
    phone: "",
    gender: "",
    dob: "",
    bloodType: "",
    rhFactor: "",
    medicalHistory: "",
  });

  /* ---------- Fetch Data ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Luồng mới: Backend đã tự động sync accounts từ iam-service vào bảng Patient
        // 1. Gọi endpoint sync - backend sẽ tự động sync accounts từ iam-service vào bảng Patient
        // 2. Sau khi sync thành công, gọi API lấy tất cả patients từ bảng Patient để hiển thị
        try {
          // Bước 1: Gọi endpoint sync để đồng bộ accounts từ iam-service vào bảng Patient
          await getPatientsFromIam();

          // Bước 2: Sau khi sync thành công, lấy tất cả patients từ bảng Patient để hiển thị
          const patientData = await getAllPatients();
          const adapted = patientData.map(adaptPatientFromDto);
          setPatients(adapted);
        } catch (syncErr: any) {
          // Fallback: Nếu endpoint sync không khả dụng, thử lấy trực tiếp từ bảng Patient
          console.warn(
            "API /api/patients/sync-from-iam không khả dụng, thử lấy từ bảng Patient:",
            syncErr
          );

          try {
            // Fallback: Lấy trực tiếp từ bảng Patient (không sync)
            const patientData = await getAllPatients();
            const adapted = patientData.map(adaptPatientFromDto);
            setPatients(adapted);
          } catch (patientApiErr: any) {
            // Fallback cuối: Lấy từ users và filter role="Patient"
            console.warn(
              "API /api/patients không khả dụng, sử dụng /api/users làm fallback:",
              patientApiErr
            );

            const response = await apiClient.get("/api/users");
            const data: PatientDtoFromUsers[] = response.data;

            // Lọc chỉ lấy những người có role "Patient"
            const patientData = data.filter((user) => {
              if (!user.roleName) return false;
              const roleName = user.roleName.trim().toUpperCase();
              return roleName === "PATIENT";
            });

            const adapted = patientData.map(adaptPatientFromUsers);
            setPatients(adapted);
          }
        }
      } catch (err: any) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------- Filter & Search ---------- */
  const filtered = useMemo(() => {
    let result = [...patients];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [patients, query]);

  const pages = Math.ceil(filtered.length / pageSize);
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  /* ---------- Handlers ---------- */
  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setEditData({
      phone: patient.phone || "",
      gender:
        patient.gender === true
          ? "true"
          : patient.gender === false
            ? "false"
            : "",
      dob: patient.dob ? patient.dob.split("T")[0] : "",
      bloodType: patient.bloodType || "",
      rhFactor: patient.rhFactor || "Không rõ",
      medicalHistory: patient.medicalHistory || "",
    });
    setShowEditModal(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingPatient) return;

    try {
      const accountId = parseInt(editingPatient.id);

      // Prepare update request for API patient (uses phoneNumber and gender string)
      const patientUpdateRequest: {
        fullName: string;
        email: string;
        phoneNumber?: string;
        gender?: string; //  
        dob?: string | Date;
        isActive?: boolean;
      } = {
        fullName: editingPatient.fullName,
        email: editingPatient.email,
        phoneNumber: editData.phone || undefined,
        gender:
          editData.gender === "true"
            ? "Nam"
            : editData.gender === "false"
              ? "Nữ"
              : undefined,
        dob: editData.dob ? editData.dob : undefined,
        isActive: editingPatient.status === "active",
      };

      // Prepare update request for users API (fallback)
      const userUpdateRequest = {
        fullName: editingPatient.fullName,
        email: editingPatient.email,
        phone: editData.phone || null,
        gender:
          editData.gender === "true"
            ? true
            : editData.gender === "false"
              ? false
              : null,
        dob: editData.dob ? new Date(editData.dob) : null,
        bloodType:
          editData.bloodType &&
            editData.bloodType !== "" &&
            editData.bloodType !== "—"
            ? editData.bloodType
            : null,
        rhFactor:
          editData.rhFactor &&
            editData.rhFactor !== "" &&
            editData.rhFactor !== "Không rõ"
            ? editData.rhFactor
            : null,
        medicalHistory:
          editData.medicalHistory && editData.medicalHistory !== ""
            ? editData.medicalHistory
            : null,
        isActive: editingPatient.status === "active",
      };

      try {
        await updatePatient(accountId, patientUpdateRequest);
      } catch (patientApiErr: any) {
        // Fallback: nếu API patient chưa có, update qua users API
        console.warn(
          "API /api/patients không khả dụng, sử dụng /api/users làm fallback:",
          patientApiErr
        );

        const userDetailResponse = await apiClient.get(
          `/api/users/${editingPatient.id}`
        );
        const userDetail: PatientDtoFromUsers = userDetailResponse.data;

        let roleId: number | null = null;
        try {
          const rolesResponse = await apiClient.get("/api/roles");
          const roles = rolesResponse.data;
          const patientRole = roles.find(
            (r: any) => r.name?.trim().toUpperCase() === "PATIENT"
          );
          roleId = patientRole ? patientRole.id : userDetail.roleId || null;
        } catch (roleErr) {
          console.warn(
            "Không thể lấy roles, sử dụng roleId từ user detail:",
            roleErr
          );
          roleId = userDetail.roleId || (userDetail as any).role?.id || null;
        }

        await apiClient.put(`/api/users/${editingPatient.id}`, {
          ...userUpdateRequest,
          roleId: roleId,
        });
      }
      // Update state trực tiếp với dữ liệu mới từ form
      setPatients((prev) => {
        return prev.map((p) => {
          if (p.id === editingPatient.id) {
            return {
              ...p,
              phone: editData.phone || undefined,
              gender:
                editData.gender === "true"
                  ? true
                  : editData.gender === "false"
                    ? false
                    : undefined,
              dob: editData.dob || undefined,
              bloodType:
                editData.bloodType &&
                  editData.bloodType !== "" &&
                  editData.bloodType !== "—"
                  ? editData.bloodType
                  : undefined,
              rhFactor:
                editData.rhFactor &&
                  editData.rhFactor !== "" &&
                  editData.rhFactor !== "Không rõ"
                  ? editData.rhFactor
                  : undefined,
              medicalHistory:
                editData.medicalHistory && editData.medicalHistory !== ""
                  ? editData.medicalHistory
                  : undefined,
            };
          }
          return p;
        });
      });

      setShowEditModal(false);
      setEditingPatient(null);

      toast.success("Cập nhật thông tin bệnh nhân thành công!");

      // Fetch lại dữ liệu từ server sau một khoảng thời gian ngắn để đảm bảo đồng bộ
      setTimeout(async () => {
        try {
          // Sync từ iam-service trước, sau đó lấy tất cả từ bảng Patient
          try {
            await getPatientsFromIam(); // Sync trước
            const patientData = await getAllPatients(); // Sau đó lấy từ DB
            const adapted = patientData.map(adaptPatientFromDto);
            setPatients(adapted);
          } catch (syncErr: any) {
            // Fallback: thử lấy trực tiếp từ bảng Patient (không sync)
            try {
              const patientData = await getAllPatients();
              const adapted = patientData.map(adaptPatientFromDto);
              setPatients(adapted);
            } catch (patientApiErr: any) {
              console.error("Lỗi khi refresh dữ liệu:", patientApiErr);
            }
          }
        } catch (err) {
          console.error("Lỗi khi refresh dữ liệu:", err);
        }
      }, 500);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Lỗi khi cập nhật thông tin";
      toast.error(errorMessage);
      console.error("Lỗi khi cập nhật:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa bệnh nhân này?")) return;

    try {
      const accountId = parseInt(id);


      try {
        await deletePatient(accountId);
      } catch (patientApiErr: any) {
        // Fallback: nếu API patient chưa có, xóa qua users API
        console.warn(
          "API /api/patients không khả dụng, sử dụng /api/users làm fallback:",
          patientApiErr
        );
        await apiClient.delete(`/api/users/${id}`);
      }

      setPatients((prev) => prev.filter((p) => p.id !== id));
      toast.success("Xóa bệnh nhân thành công!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Lỗi khi xóa";
      toast.error(errorMessage);
    }
  };

  /* ---------- Loading / Error ---------- */
  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Đang tải...</PageTitle>
        </PageHeader>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle style={{ color: "red" }}>Lỗi: {error}</PageTitle>
        </PageHeader>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Quản lý bệnh nhân</PageTitle>
        <Breadcrumb>
          Đang hiển thị {paged.length}/{filtered.length} bệnh nhân
        </Breadcrumb>
      </PageHeader>

      <Toolbar>
        <SearchBox>
          <FaSearch />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email hoặc số điện thoại…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setQuery(search.trim());
                setPage(1);
              }
            }}
          />
        </SearchBox>

      </Toolbar>

      <TableContainer>
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>STT</TableHeaderCell>
                <TableHeaderCell>Bệnh nhân</TableHeaderCell>
                <TableHeaderCell>Giới tính</TableHeaderCell>
                <TableHeaderCell>Ngày sinh</TableHeaderCell>
                <TableHeaderCell>Nhóm máu</TableHeaderCell>
                <TableHeaderCell>Trạng thái</TableHeaderCell>
                <TableHeaderCell>Thao tác</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <tr>
                  <TableCell colSpan={7}>
                    <EmptyState>Không tìm thấy bệnh nhân nào.</EmptyState>
                  </TableCell>
                </tr>
              ) : (
                paged.map((patient, index) => (
                  <TableRow key={patient.id}>
                    <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                    <TableCell>
                      <PatientInfo>
                        <Avatar>{getInitials(patient.fullName)}</Avatar>
                        <PatientDetails>
                          <PatientName>{patient.fullName}</PatientName>
                          <PatientContact>
                            {patient.email}
                            {patient.phone && ` • ${patient.phone}`}
                          </PatientContact>
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
                    <TableCell>
                      {patient.bloodType ? (
                        <BloodGroupBadge>
                          {formatBloodGroup(
                            patient.bloodType,
                            patient.rhFactor
                          )}
                        </BloodGroupBadge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge $status={patient.status}>
                        {formatStatus(patient.status)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <ActionButtonsCell>
                        <IconButton
                          title="Chỉnh sửa"
                          onClick={() => handleEdit(patient)}
                        >
                          <FaEdit size={14} />
                        </IconButton>
                        <IconButton
                          title="Xóa"
                          onClick={() => handleDelete(patient.id)}
                        >
                          <FaTrash size={14} />
                        </IconButton>
                      </ActionButtonsCell>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableWrapper>

        <Pagination>
          <PaginationInfo>
            Hiển thị {(page - 1) * pageSize + 1} -{" "}
            {Math.min(page * pageSize, filtered.length)} / {filtered.length}{" "}
            bệnh nhân
          </PaginationInfo>
          <PaginationButtons>
            <PaginationButton
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Trước
            </PaginationButton>
            <PaginationInfo>
              Trang {page}/{pages}
            </PaginationInfo>
            <PaginationButton
              disabled={page === pages || pages === 0}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              Tiếp →
            </PaginationButton>
          </PaginationButtons>
        </Pagination>
      </TableContainer>

      {/* Edit Modal */}
      {showEditModal && editingPatient && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              Chỉnh sửa thông tin bệnh nhân - {editingPatient.fullName}
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <FormLabel>Số điện thoại</FormLabel>
                <FormInput
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  placeholder="Nhập số điện thoại"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Giới tính</FormLabel>
                <FormSelect
                  name="gender"
                  value={editData.gender}
                  onChange={handleEditChange}
                >
                  <option value="">[Chưa chọn]</option>
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Ngày sinh</FormLabel>
                <FormInput
                  type="date"
                  name="dob"
                  value={editData.dob}
                  onChange={handleEditChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Nhóm máu</FormLabel>
                <FormSelect
                  name="bloodType"
                  value={editData.bloodType}
                  onChange={handleEditChange}
                >
                  <option value="">[Chưa chọn]</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Yếu tố Rh</FormLabel>
                <FormSelect
                  name="rhFactor"
                  value={editData.rhFactor}
                  onChange={handleEditChange}
                >
                  <option value="Không rõ">Không rõ</option>
                  <option value="Rh+">Rh+</option>
                  <option value="Rh-">Rh-</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Tiền sử bệnh</FormLabel>
                <FormTextarea
                  name="medicalHistory"
                  value={editData.medicalHistory}
                  onChange={handleEditChange}
                  placeholder="Nhập tiền sử bệnh (nếu có)"
                  rows={4}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                $variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPatient(null);
                }}
              >
                Hủy
              </Button>
              <Button $variant="primary" onClick={handleSaveEdit}>
                Lưu thay đổi
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default PatientManage;

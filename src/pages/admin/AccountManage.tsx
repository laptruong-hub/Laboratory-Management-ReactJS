import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaFilter,
  FaEdit,
  FaSave,
  FaTimes,
  FaDownload,
} from "react-icons/fa";
import "../../components/admin/account-manage.css"; // (File CSS gốc)
import { apiClient } from "../../api/apiClient";
import { toast } from "react-toastify";

/* ---------- Types ---------- */
type Role = "ADMIN" | "LAB MANAGER" | "SERVICE" | "LAB USER";
type Status = "active" | "pending" | "inactive" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joinedAt?: string;
  phone?: string;
  dob?: string;
  gender?: boolean;
  rhFactor?: string;
  bloodType?: string;
  medicalHistory?: string;
}

interface UserDtoFromApi {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
  roleName: string;
  createdAt: string;
  phone?: string;
  dob?: string;
  gender?: boolean;
  rhFactor?: string;
  bloodType?: string;
  medicalHistory?: string;
}

/* --- Styles for LIGHT LAYOUT --- */
const LayoutStyles = () => (
  <style>{`
    /* ------------------------------ */
    /* Filter Popup Styles (Light) */
    /* ------------------------------ */
    .am-filter-container {
      position: relative;
      display: inline-block;
    }
    .am-filter-popup {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 320px;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 16px;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .am-filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .am-filter-group label {
      font-size: 14px;
      font-weight: 500;
      color: #334155;
    }
    .am-filter-daterange {
      display: flex;
      gap: 8px;
    }
    .am-filter-daterange input {
      width: 100%;
    }
    .am-filter-footer {
      display: flex;
      justify-content: flex-end; /* (Chỉ còn nút Xoá) */
      gap: 8px;
      padding-top: 8px;
      border-top: 1px solid #f1f5f9;
    }
    .am-form-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 14px;
      background: #fff;
      color: #1e293b;
    }
    select.am-form-input {
      appearance: none;
    }
    .am-filter-footer .btn.text {
      background: transparent;
      border: none;
      color: #475569;
      font-weight: 600;
      padding: 8px 12px;
    }
    .am-filter-footer .btn.text:hover {
      background: #f1f5f9;
    }

    /* ------------------------------ */
    /* List/Detail Layout Styles (Light) */
    /* ------------------------------ */
    .card {
      border: none;
      box-shadow: none;
      background: transparent;
      padding: 0;
    }
    .am-layout-wrapper {
      display: flex;
      flex-direction: row;
      gap: 24px;
      margin-top: 16px;
      flex: 1;
      min-height: 0;
      overflow: hidden;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .am-table, .am-pagination {
      display: none; /* (Ẩn table và pagination cũ) */
    }

    @media (max-width: 1024px) {
      .am-layout-wrapper {
        flex-direction: column;
        gap: 16px;
      }
      .am-list-pane {
        width: 100%;
        height: 300px;
        min-height: 300px;
        max-height: 300px;
      }
      .am-detail-pane {
        height: auto;
        flex: 1;
        min-height: 0;
        overflow: hidden;
      }
      .am-detail-card {
        padding: 20px;
      }
      .am-detail-grid {
        gap: 14px 16px;
      }
      .am-detail-header {
        margin-bottom: 16px;
        padding-bottom: 16px;
      }
      .am-detail-avatar {
        width: 80px;
        height: 80px;
        font-size: 36px;
        margin-bottom: 10px;
      }
      .am-detail-name {
        font-size: 20px;
      }
      .am-detail-email {
        font-size: 14px;
      }
    }

    @media (max-width: 768px) {
      .am-layout-wrapper {
        gap: 12px;
        margin-top: 12px;
      }
      .am-list-pane {
        height: 250px;
        min-height: 250px;
        max-height: 250px;
      }
      .am-detail-card {
        padding: 16px;
      }
      .am-detail-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .am-detail-header {
        margin-bottom: 12px;
        padding-bottom: 12px;
      }
      .am-detail-avatar {
        width: 70px;
        height: 70px;
        font-size: 32px;
        margin-bottom: 8px;
      }
      .am-detail-name {
        font-size: 18px;
      }
      .am-detail-email {
        font-size: 13px;
      }
      .am-detail-field label {
        font-size: 12px;
      }
      .am-detail-field .value {
        font-size: 14px;
      }
      .am-detail-actions {
        flex-wrap: wrap;
        margin-top: 12px;
        padding-top: 12px;
        gap: 8px;
      }
      .am-detail-actions button {
        flex: 1;
        min-width: 120px;
      }
    }

    @media (max-width: 480px) {
      .am-layout-wrapper {
        gap: 8px;
        margin-top: 8px;
      }
      .am-list-pane {
        height: 200px;
        min-height: 200px;
        max-height: 200px;
      }
      .am-detail-card {
        padding: 12px;
      }
      .am-detail-grid {
        gap: 10px;
      }
      .am-detail-header {
        margin-bottom: 10px;
        padding-bottom: 10px;
      }
      .am-detail-avatar {
        width: 60px;
        height: 60px;
        font-size: 28px;
        margin-bottom: 6px;
      }
      .am-detail-name {
        font-size: 16px;
      }
      .am-detail-email {
        font-size: 12px;
      }
      .am-detail-field label {
        font-size: 11px;
      }
      .am-detail-field .value {
        font-size: 13px;
      }
      .am-detail-actions {
        margin-top: 10px;
        padding-top: 10px;
        flex-direction: column;
      }
      .am-detail-actions button {
        width: 100%;
        min-width: auto;
      }
    }

    /* Cột danh sách (bên trái) */
    .am-list-pane {
      width: 350px;
      min-width: 280px;
      max-width: 350px;
      flex-shrink: 0;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      box-sizing: border-box;
    }
    
    .am-list-scroller {
      padding: 8px;
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      
      /* Ẩn scrollbar nhưng vẫn cho phép scroll */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
    }
    
    .am-list-scroller::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }

    .am-list-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: background-color 0.2s;
    }
    .am-list-item:hover {
      background-color: #f8fafc;
    }
    .am-list-item.active {
      background-color: #eef2ff;
      border-color: #c7d2fe;
    }

    .am-list-item-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #e0e7ff;
      color: #4f46e5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
      flex-shrink: 0;
      overflow: hidden;
      position: relative;
    }
    .am-list-item-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .am-list-item-info {
      flex-grow: 1;
      min-width: 0;
    }
    .am-list-item-name {
      font-weight: 600;
      color: #1e293b;
    }
    .am-list-item-email {
      font-size: 13px;
      color: #64748b;
    }
    .am-list-item-badges {
      display: flex;
      gap: 4px;
      margin-top: 4px;
    }
    .badge-pill {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
    }

    /* Pagination (mới) */
    .am-list-pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-top: 1px solid #f1f5f9;
      background: #fdfdff;
    }
    .am-list-pagination .muted {
      color: #64748b;
    }

    /* Cột chi tiết (bên phải) */
    .am-detail-pane {
      flex: 1;
      flex-grow: 1;
      min-width: 0;
      min-height: 0;
      height: 100%;
      max-height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .am-detail-card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      padding: 24px;
      height: 100%;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      
      /* Ẩn scrollbar nhưng vẫn cho phép scroll */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
    }
    
    .am-detail-card::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
    
    .am-detail-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 400px;
      border: 2px dashed #e2e8f0;
      border-radius: 12px;
      color: #64748b;
    }

    .am-detail-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #f1f5f9;
      flex-shrink: 0;
      min-height: 0;
    }
    .am-detail-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #e0e7ff;
      color: #4f46e5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 48px;
      margin-bottom: 16px;
      overflow: hidden;
      position: relative;
    }
    .am-detail-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .am-detail-name {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .am-detail-email {
      font-size: 16px;
      color: #64748b;
      margin-top: 4px;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    /* Grid chi tiết */
    .am-detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 20px;
      flex: 1;
      min-height: 0;
      align-content: start;
      box-sizing: border-box;
    }
    
    .am-detail-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      word-break: break-word;
    }
    
    .am-detail-field label {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
    }
    .am-detail-field .value {
      font-size: 15px;
      color: #1e293b;
      font-weight: 500;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .am-detail-field .badge-pill {
      align-self: flex-start;
    }
    
    /* Nút bấm (dưới grid) */
    .am-detail-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
      flex-shrink: 0;
      min-height: 0;
    }
  `}</style>
);

/* ---------- Helpers / UI ---------- */
const formatDate = (iso?: string) =>
  iso ? new Intl.DateTimeFormat("vi-VN").format(new Date(iso)) : "—";

const formatGender = (g?: boolean) =>
  g === true ? "Nam" : g === false ? "Nữ" : "Không rõ";

const tone = {
  primary: { bg: "#eef2ff", fg: "#4f46e5" },
  info: { bg: "#e6f4ff", fg: "#0284c7" },
  success: { bg: "#eaf7ee", fg: "#16a34a" },
  warning: { bg: "#fff7ed", fg: "#d97706" },
  danger: { bg: "#ffeaea", fg: "#dc2626" },
  secondary: { bg: "#f1f5f9", fg: "#475569" },
};

const roleTone = (role: Role) =>
  ((
    {
      ADMIN: tone.primary,
      MANAGER: tone.info,
      Manager: tone.info,
      USER: tone.success,
      User: tone.success,
      Service: tone.warning,
      "Read-only": tone.secondary,
    } as Record<string, typeof tone.secondary>
  )[role] ?? tone.secondary);

const statusText = (s: Status) =>
  ({
    active: "Hoạt động",

    pending: "Chờ duyệt",
    inactive: "Ngưng",
    suspended: "Tạm ngưng",
  }[s] ?? "—");

const statusTone = (s: Status) =>
  ({
    active: tone.success,
    pending: tone.warning,
    inactive: tone.secondary,
    suspended: tone.danger,
  }[s] ?? tone.secondary);

const Badge = ({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: { bg: string; fg: string };
}) => (
  <span
    className="badge-pill"
    style={{ backgroundColor: colors.bg, color: colors.fg }}
  >
    {children}
  </span>
);

const DetailField = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <div className="am-detail-field">
    <label>{label}</label>
    {children ? children : <div className="value">{value || "—"}</div>}
  </div>
);

/* ---------- Component ---------- */
export default function AccountManage() {
  /* ---------- State ---------- */
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editDetailData, setEditDetailData] = useState({
    phone: "",
    roleId: "",
    rhFactor: "",
    status: "",
    gender: "",
    bloodType: "",
    medicalHistory: "",
  });

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    roleId: "",
    phone: "",
    gender: "",
    dob: "",
  });
  const [allRoles, setAllRoles] = useState<{ id: number; name: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadReport, setUploadReport] = useState<string>(""); // (Để hiển thị báo cáo)
  const [showImportModal, setShowImportModal] = useState(false); // (Thêm dòng này)

  /* --- Filter State --- */
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  // const [tempFilters, setTempFilters] = useState({ ... }); // <-- ĐÃ XOÁ

  /* --- UPDATED: Chỉ dùng 'appliedFilters' --- */
  const [appliedFilters, setAppliedFilters] = useState({
    role: "all",
    status: "all",
    startDate: "",
    endDate: "",
  });

  /* ---------- Helpers ---------- */
  // Helper function to get avatar from localStorage
  const getAvatarFromStorage = (userId: string | number): string | null => {
    try {
      const avatar = localStorage.getItem(`avatar_${userId}`);
      return avatar;
    } catch (error) {
      console.error("Error loading avatar from localStorage:", error);
      return null;
    }
  };

  const adaptUser = (dto: UserDtoFromApi): User => {
    // Backend trả về isActive boolean, nhưng chúng ta cần map sang Status
    // Mặc định: isActive = false => pending (tài khoản mới tạo)
    // Sau khi được activate thì isActive = true => active
    let status: Status;
    if (dto.isActive) {
      status = "active";
    } else {
      // Nếu tài khoản mới tạo (isActive = false), mặc định là pending
      status = "pending";
    }

    return {
      id: dto.id.toString(),
      name: dto.fullName,
      email: dto.email,
      role: dto.roleName as Role,
      status: status,
      joinedAt: dto.createdAt,
      phone: dto.phone,
      dob: dto.dob,
      gender: dto.gender,
      rhFactor: dto.rhFactor || "Không rõ",
      bloodType: dto.bloodType || "—",
      medicalHistory: dto.medicalHistory || "—",
    };
  };

  /* ---------- Fetch Data ---------- */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get("/api/users");
      const usersData: UserDtoFromApi[] = response.data;
      setRows(usersData.map(adaptUser));
      const roleResponse = await apiClient.get("/api/roles");
      const rolesData = roleResponse.data.map((r: any) => ({
        id: r.id,
        name: r.name,
      }));
      setAllRoles(rolesData);
    } catch (err) {
      console.error("Lỗi khi fetch users:", err);
      setError("Không thể tải danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* --- Click outside to close filter --- */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  /* ---------- Filtering ---------- */
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filtered = useMemo(() => {
    const kw = normalize(query);
    const { role, status, startDate, endDate } = appliedFilters;
    const start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    // 1. Lọc danh sách trước
    const filteredRows = rows.filter((u) => {
      if (kw && !normalize(`${u.name} ${u.email} ${u.role}`).includes(kw))
        return false;
      if (role !== "all" && u.role !== role) return false;
      if (status !== "all" && u.status !== status) return false;
      if (u.joinedAt) {
        const joinedDate = new Date(u.joinedAt);
        if (start && joinedDate < start) return false;
        if (end && joinedDate > end) return false;
      } else if (start || end) return false;
      return true;
    });

    // 2. Sắp xếp danh sách đã lọc theo vai trò (quyền)
    filteredRows.sort((a, b) => a.role.localeCompare(b.role));

    return filteredRows;
  }, [rows, query, appliedFilters]);
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const selectedUser = useMemo(
    () => rows.find((u) => u.id === selectedId),
    [rows, selectedId]
  );

  useEffect(() => {
    if (!selectedId && filtered.length > 0) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  /* --- Handlers --- */
  const handleSelectUser = (id: string) => {
    setSelectedId(id);
    setIsEditing(false);
  };

  /* ---------- Delete ---------- */
  function handleDelete(id: string) {
    const u = rows.find((r) => r.id === id);
    if (!u) return;
    setDeleteTarget({ id: u.id, name: u.name });
  }

  function closeDeleteConfirm() {
    setDeleteTarget(null);
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/api/users/${deleteTarget.id}`);
      closeDeleteConfirm();
      await fetchData();
      toast.success("Xóa người dùng thành công!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Lỗi khi xóa";
      toast.error(errorMessage);
      closeDeleteConfirm();
    }
  };

  /* ---------- Edit ---------- */

  const handleStartEdit = () => {
    if (!selectedUser) return;
    const currentRole = allRoles.find((r) => r.name === selectedUser.role);
    setEditDetailData({
      phone: selectedUser.phone || "",
      roleId: currentRole ? currentRole.id.toString() : "",
      rhFactor: selectedUser.rhFactor || "Không rõ",
      status: selectedUser.status,
      gender:
        selectedUser.gender === true
          ? "true"
          : selectedUser.gender === false
          ? "false"
          : "",
      bloodType: selectedUser.bloodType || "—",
      medicalHistory: selectedUser.medicalHistory || "—",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditDetailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!selectedId) return;
    try {
      const updateRequest = {
        fullName: selectedUser?.name,
        dob: selectedUser?.dob ? new Date(selectedUser.dob) : null,
        phone: editDetailData.phone || null,
        roleId: editDetailData.roleId ? Number(editDetailData.roleId) : null,
        gender:
          editDetailData.gender === "true"
            ? true
            : editDetailData.gender === "false"
            ? false
            : null,
        rhFactor: editDetailData.rhFactor,
        bloodType: editDetailData.bloodType,
        medicalHistory: editDetailData.medicalHistory,
        isActive: editDetailData.status === "active",
      };
      await apiClient.put(`/api/users/${selectedId}`, updateRequest);
      setIsEditing(false);
      await fetchData();
      toast.success("Cập nhật tài khoản thành công!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Lỗi khi cập nhật";
      toast.error(errorMessage);
    }
  };

  /* --- Create Modal --- */
  const openCreateModal = () => {
    // Tìm role "readonly" để set làm mặc định
    const readonlyRole = allRoles.find(
      (r) =>
        r.name.trim().toUpperCase() === "READONLY" ||
        r.name.trim().toUpperCase() === "READ-ONLY"
    );
    const defaultRoleId = readonlyRole ? readonlyRole.id.toString() : "";

    setCreateFormData({
      fullName: "",
      email: "",
      password: "",
      roleId: defaultRoleId,
      phone: "",
      gender: "",
      dob: "",
    });
    setShowCreateModal(true);
  };

  const handleCreateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
    try {
      // Tìm role "readonly" hoặc "Read-only" để làm mặc định
      let defaultRoleId = createFormData.roleId;
      if (!defaultRoleId || defaultRoleId === "") {
        const readonlyRole = allRoles.find(
          (r) =>
            r.name.trim().toUpperCase() === "READONLY" ||
            r.name.trim().toUpperCase() === "READ-ONLY"
        );
        if (readonlyRole) {
          defaultRoleId = readonlyRole.id.toString();
        } else if (allRoles.length > 0) {
          // Fallback: chọn role đầu tiên nếu không tìm thấy readonly
          defaultRoleId = allRoles[0].id.toString();
        }
      }

      const createRequest = {
        fullName: createFormData.fullName,
        email: createFormData.email,
        password: createFormData.password,
        roleId: Number(defaultRoleId),
        phone: createFormData.phone || null,
        gender:
          createFormData.gender === "true"
            ? true
            : createFormData.gender === "false"
            ? false
            : null,
        dob: createFormData.dob ? new Date(createFormData.dob) : null,
        // Set status mặc định là pending (isActive = false cho pending status)
        isActive: false,
      };
      const response = await apiClient.post("/api/users", createRequest);
      let newUserDto = response.data;

      // Đảm bảo trạng thái của tài khoản mới tạo là "pending" (chờ duyệt)
      // Nếu backend tự động set isActive = true, cập nhật lại thành false
      if (newUserDto.isActive === true) {
        try {
          // Tìm roleId từ roleName nếu backend không trả về roleId
          const userRoleId =
            newUserDto.roleId ||
            allRoles.find((r) => r.name === newUserDto.roleName)?.id ||
            Number(defaultRoleId);

          const updateResponse = await apiClient.put(
            `/api/users/${newUserDto.id}`,
            {
              fullName: newUserDto.fullName,
              email: newUserDto.email,
              phone: newUserDto.phone || null,
              dob: newUserDto.dob ? new Date(newUserDto.dob) : null,
              roleId: userRoleId,
              gender: newUserDto.gender,
              isActive: false, // Đặt về pending (chờ duyệt)
            }
          );
          newUserDto = updateResponse.data;
        } catch (updateErr) {
          console.warn(
            "Không thể cập nhật trạng thái user sau khi tạo:",
            updateErr
          );
          // Nếu không thể cập nhật, vẫn tiếp tục với dữ liệu từ response tạo user
        }
      }

      setShowCreateModal(false);
      const newUserForUI = adaptUser(newUserDto);
      setRows((prevRows) => [newUserForUI, ...prevRows]);
      toast.success("Tạo người dùng thành công!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Lỗi khi tạo";
      toast.error(errorMessage);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn một file Excel (.xlsx) trước.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    setUploadReport(""); // (Reset báo cáo cũ)

    try {
      const response = await apiClient.post("/api/users/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const report = response.data;

      if (report.failureCount > 0) {
        toast.warning(
          `Hoàn thành: ${report.successCount} thành công, ${report.failureCount} thất bại.`
        );
      } else {
        toast.success(`Upload thành công ${report.successCount} user!`);
      }

      setUploadReport(report.errors.join("\n"));

      await fetchData();
    } catch (err: any) {
      console.error("Lỗi khi upload file:", err);
      const errorMessage =
        err.response?.data?.errors?.[0] || "Upload thất bại nghiêm trọng";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setSelectedFile(null); // Reset file
    }
  };

  /* --- UPDATED: Filter Handlers --- */
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Cập nhật thẳng vào 'appliedFilters'
    setAppliedFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset về trang 1
  };

  // (handleApplyFilter đã bị xoá)

  const handleClearFilter = () => {
    const defaultFilters = {
      role: "all",
      status: "all",
      startDate: "",
      endDate: "",
    };
    setAppliedFilters(defaultFilters); // Chỉ cần reset state này
    setPage(1);
    // (Không đóng popup)
  };

  const toggleFilter = () => {
    // (Không cần đồng bộ state nữa)
    setIsFilterOpen((prev) => !prev);
  };

  /* ---------- Loading / Error ---------- */
  if (loading) {
    return (
      <div className="am-page">
        <div className="am-toolbar">
          <div className="am-title">
            <h1 className="title">Đang tải...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="am-page">
        <div className="am-toolbar">
          <div className="am-title">
            <h1 className="title" style={{ color: "red" }}>
              Lỗi: {error}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="am-page">
      <LayoutStyles />

      {/* Toolbar */}
      <div className="am-toolbar">
        <div className="am-title">
          <h1 className="title">Quản lý tài khoản</h1>
          <div className="muted">
            {/* Đang hiển thị {paged.length}/{total} người dùng */}
          </div>
        </div>

        <div className="am-tools">
          <div className="am-search-input">
            <FaSearch />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, email hoặc vai trò…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setQuery(search.trim());
                  setPage(1);
                }
              }}
            />
          </div>
          <div className="am-actions">
            {/* Filter Popup */}
            <div className="am-filter-container" ref={filterRef}>
              <button className="btn outline" onClick={toggleFilter}>
                <FaFilter /> &nbsp;Lọc
              </button>

              {/* --- UPDATED: Filter Popup JSX --- */}
              {isFilterOpen && (
                <div className="am-filter-popup">
                  <div className="am-filter-group">
                    <label>Vai trò</label>
                    <select
                      name="role"
                      value={appliedFilters.role} /* (Đọc từ appliedFilters) */
                      onChange={handleFilterChange} /* (Dùng handler mới) */
                      className="am-form-input"
                    >
                      <option value="all">Tất cả vai trò</option>
                      {allRoles.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="am-filter-group">
                    <label>Trạng thái</label>
                    <select
                      name="status"
                      value={
                        appliedFilters.status
                      } /* (Đọc từ appliedFilters) */
                      onChange={handleFilterChange}
                      className="am-form-input"
                    >
                      <option value="all">Tất cả</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Ngưng</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="suspended">Tạm ngưng</option>
                    </select>
                  </div>
                  <div className="am-filter-group">
                    <label>Ngày tham gia</label>
                    <div className="am-filter-daterange">
                      <input
                        type="date"
                        name="startDate"
                        value={
                          appliedFilters.startDate
                        } /* (Đọc từ appliedFilters) */
                        onChange={handleFilterChange}
                        className="am-form-input"
                      />
                      <input
                        type="date"
                        name="endDate"
                        value={
                          appliedFilters.endDate
                        } /* (Đọc từ appliedFilters) */
                        onChange={handleFilterChange}
                        className="am-form-input"
                      />
                    </div>
                  </div>
                  <div className="am-filter-footer">
                    <button className="btn text" onClick={handleClearFilter}>
                      Xoá
                    </button>
                    {/* (Nút Áp dụng đã bị xoá) */}
                  </div>
                </div>
              )}
            </div>

            <button className="btn primary" onClick={openCreateModal}>
              <FaPlus /> &nbsp;Thêm người dùng
            </button>
            <button
              className="btn outline"
              onClick={() => setShowImportModal(true)} // (Mở Modal mới)
            >
              <FaDownload /> &nbsp;Thêm nhiều người dùng
            </button>
          </div>
        </div>
      </div>

      {/* --- NEW LAYOUT WRAPPER --- */}
      <div className="am-layout-wrapper">
        {/* --- Cột 1: Danh sách User --- */}
        <div className="am-list-pane">
          <div className="am-list-scroller">
            {paged.map((u) => (
              <div
                key={u.id}
                className={`am-list-item ${
                  u.id === selectedId ? "active" : ""
                }`}
                onClick={() => handleSelectUser(u.id)}
              >
                <div className="am-list-item-avatar">
                  {getAvatarFromStorage(u.id) ? (
                    <img
                      src={getAvatarFromStorage(u.id)!}
                      alt={u.name}
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.textContent =
                            u.name
                              .split(" ")
                              .slice(-1)[0]?.[0]
                              ?.toUpperCase() ?? "U";
                        }
                      }}
                    />
                  ) : (
                    u.name.split(" ").slice(-1)[0]?.[0]?.toUpperCase() ?? "U"
                  )}
                </div>
                <div className="am-list-item-info">
                  <div className="am-list-item-name">{u.name}</div>
                  <div className="am-list-item-email">{u.email}</div>
                  <div className="am-list-item-badges">
                    <Badge colors={roleTone(u.role)}>{u.role}</Badge>
                    <Badge colors={statusTone(u.status)}>
                      {statusText(u.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {!paged.length && (
              <div
                style={{ padding: 24, textAlign: "center", color: "#64748b" }}
              >
                Không tìm thấy kết quả.
              </div>
            )}
          </div>

          {/* Pagination (Mới) */}
          <div className="am-list-pagination">
            <button
              className="btn outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Trước
            </button>
            <div className="muted">
              Trang {page}/{pages}
            </div>
            <button
              className="btn outline"
              disabled={page === pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              Tiếp →
            </button>
          </div>
        </div>

        {/* --- Cột 2: Chi tiết User --- */}
        <div className="am-detail-pane">
          {!selectedUser ? (
            <div className="am-detail-card">
              <div className="am-detail-placeholder">
                Chọn một người dùng từ danh sách để xem chi tiết
              </div>
            </div>
          ) : (
            <div className="am-detail-card">
              {/* Header chi tiết */}
              <div className="am-detail-header">
                {/* <div className="am-detail-avatar">
                  {getAvatarFromStorage(selectedUser.id) ? (
                    <img
                      src={getAvatarFromStorage(selectedUser.id)!}
                      alt={selectedUser.name}
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.textContent =
                            selectedUser.name
                              .split(" ")
                              .slice(-1)[0]?.[0]
                              ?.toUpperCase() ?? "U";
                        }
                      }}
                    />
                  ) : (
                    selectedUser.name
                      .split(" ")
                      .slice(-1)[0]?.[0]
                      ?.toUpperCase() ?? "U"
                  )}
                </div> */}
                <div className="am-detail-name">{selectedUser.name}</div>
                <div className="am-detail-email">{selectedUser.email}</div>
              </div>

              <div className="am-detail-grid">

                <DetailField label="Họ và Tên" value={selectedUser.name} />


                <DetailField
                  label="Ngày sinh"
                  value={formatDate(selectedUser.dob)}
                />


                <DetailField label="Giới tính">
                  {isEditing ? (
                    <select
                      name="gender"
                      value={editDetailData.gender}
                      onChange={handleEditFormChange}
                      className="am-form-input"
                    >
                      <option value="">[Chưa chọn]</option>
                      <option value="true">Nam</option>
                      <option value="false">Nữ</option>
                    </select>
                  ) : (
                    <div className="value">
                      {formatGender(selectedUser.gender)}
                    </div>
                  )}
                </DetailField>

                {/* 4. Nhóm máu (Đổi thành input) */}
                <DetailField label="Nhóm máu">
                  {isEditing ? (
                    <select
                      name="bloodType"
                      value={editDetailData.bloodType}
                      onChange={handleEditFormChange}
                      className="am-form-input"
                    >
                      <option value="—">[Chưa chọn]</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  ) : (
                    <div className="value">{selectedUser.bloodType}</div>
                  )}
                </DetailField>

                {/* 5. Yếu tố Rh (Đổi thành input) */}
                <DetailField label="Yếu tố Rh">
                  {isEditing ? (
                    <select
                      name="rhFactor"
                      value={editDetailData.rhFactor}
                      onChange={handleEditFormChange}
                      className="am-form-input"
                    >
                      <option value="Không rõ">Không rõ</option>
                      <option value="Rh+">Rh+</option>
                      <option value="Rh-">Rh-</option>
                    </select>
                  ) : (
                    <div className="value">{selectedUser.rhFactor}</div>
                  )}
                </DetailField>

                {/* 6. Vai trò (Đổi thành input) */}
                <DetailField label="Vai trò">
                  {isEditing ? (
                    <select
                      name="roleId"
                      value={editDetailData.roleId}
                      onChange={handleEditFormChange}
                      className="am-form-input"
                    >
                      <option value="">[Chọn vai trò]</option>
                      {allRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge colors={roleTone(selectedUser.role)}>
                      {selectedUser.role}
                    </Badge>
                  )}
                </DetailField>

                {/* 7. Email (Luôn tĩnh) */}
                <DetailField label="Email" value={selectedUser.email} />

                {/* 8. Số điện thoại (Đổi thành input) */}
                <DetailField label="Số điện thoại">
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={editDetailData.phone}
                      onChange={handleEditFormChange}
                      className="am-form-input"
                    />
                  ) : (
                    <div className="value">{selectedUser.phone || "—"}</div>
                  )}
                </DetailField>

                {/* 9. Trạng thái (Đổi thành input) */}
                <DetailField label="Trạng thái">
                  {isEditing ? (
                    <select
                      name="status"
                      value={editDetailData.status}
                      onChange={handleEditFormChange}
                      className="am-form-input"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="inactive">Ngưng</option>
                      <option value="suspended">Tạm ngưng</option>
                    </select>
                  ) : (
                    <Badge colors={statusTone(selectedUser.status)}>
                      {statusText(selectedUser.status)}
                    </Badge>
                  )}
                </DetailField>

                {/* 10. Tiền sử bệnh (Đổi thành textarea) */}
                <DetailField label="Ghi chú'">
                  {isEditing ? (
                    <textarea
                      name="medicalHistory"
                      value={editDetailData.medicalHistory}
                      onChange={handleEditFormChange}
                      className="am-form-input"
                      rows={3}
                    />
                  ) : (
                    <div className="value">
                      {selectedUser.medicalHistory || "—"}
                    </div>
                  )}
                </DetailField>
              </div>
              {/* --- END Grid --- */}

              {/* Nút bấm (dưới grid) */}
              <div className="am-detail-actions">
                {!isEditing ? (
                  <>
                    <button className="btn primary" onClick={handleStartEdit}>
                      <FaEdit /> &nbsp;Chỉnh sửa
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => handleDelete(selectedUser.id)}
                    >
                      <FaTrash /> &nbsp;Xoá
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn outline" onClick={handleCancelEdit}>
                      <FaTimes /> &nbsp;Huỷ
                    </button>
                    <button className="btn primary" onClick={handleSaveEdit}>
                      <FaSave /> &nbsp;Lưu
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}
      {deleteTarget && (
        <div className="am-modal-overlay">
          <div className="am-modal am-confirm">
            <div className="am-modal__header">
              <h2 className="title">Xác nhận xoá</h2>
            </div>
            <div className="am-modal__body">
              <p className="am-confirm-text">
                Bạn có chắc muốn xoá người dùng Văn
                <strong>{deleteTarget.name}</strong>?
              </p>
            </div>
            <div className="am-modal__footer">
              <button className="btn outline" onClick={closeDeleteConfirm}>
                Huỷ
              </button>
              <button className="btn danger" onClick={confirmDelete}>
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
      {showCreateModal && (
        <div
          className="am-modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="am-modal am-confirm"
            style={{ maxWidth: "700px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="am-modal__header">
              <h2 className="title">Thêm người dùng mới</h2>
            </div>
            <div className="am-modal__body">
              <div className="am-form-grid">
                <div className="am-form-group">
                  <label>Họ và Tên (*)</label>
                  <input
                    type="text"
                    name="fullName"
                    value={createFormData.fullName}
                    onChange={handleCreateFormChange}
                    className="am-form-input"
                    required
                  />
                </div>
                <div className="am-form-group">
                  <label>Email (*)</label>
                  <input
                    type="email"
                    name="email"
                    value={createFormData.email}
                    onChange={handleCreateFormChange}
                    className="am-form-input"
                    required
                  />
                </div>
                <div className="am-form-group">
                  <label>Mật khẩu (*)</label>
                  <input
                    type="password"
                    name="password"
                    value={createFormData.password}
                    onChange={handleCreateFormChange}
                    className="am-form-input"
                    required
                  />
                </div>
                <div className="am-form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={createFormData.phone}
                    onChange={handleCreateFormChange}
                    className="am-form-input"
                  />
                </div>
                <div className="am-form-group">
                  <label>Vai trò (Role) (*)</label>
                  <select
                    name="roleId"
                    value={createFormData.roleId}
                    onChange={handleCreateFormChange}
                    className="am-form-input"
                    required
                  >
                    {allRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="am-form-group">
                  <label>Giới tính</label>
                  <select
                    name="gender"
                    value={createFormData.gender}
                    onChange={handleCreateFormChange}
                    className="am-form-input"
                  >
                    <option value="">[Chưa chọn]</option>
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
                <div className="am-form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    name="dob"
                    value={createFormData.dob}
                    onChange={handleCreateFormChange}
                    className="am-form-input"
                  />
                </div>
              </div>
            </div>
            <div className="am-modal__footer">
              <button
                className="btn outline"
                onClick={() => setShowCreateModal(false)}
              >
                Huỷ
              </button>
              <button className="btn primary" onClick={handleCreateUser}>
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
      {showImportModal && (
        <div
          className="am-modal-overlay"
          onClick={() => setShowImportModal(false)}
        >
          <div
            className="am-modal am-confirm" // (Tái sử dụng style modal)
            style={{ maxWidth: "600px" }} // (Cho nó rộng hơn 1 chút)
            onClick={(e) => e.stopPropagation()}
          >
            <div className="am-modal__header">
              <h2 className="title">Thêm người dùng (Upload Excel)</h2>
            </div>

            <div className="am-modal__body">
              <div className="am-form-group">
                <label>Bước 1: Tải file mẫu</label>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#6b7280",
                    margin: "4px 0",
                  }}
                >
                  Tải file mẫu về, điền thông tin user và lưu lại. (Lưu ý: Role
                  để trống sẽ tự động gán là "USER")
                </p>
                <a
                  href="/files/Template-add-user.xlsx"
                  download="Mau_Nhap_Lieu_Nguoi_Dung.xlsx"
                  className="btn outline"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <FaDownload /> &nbsp;Tải file mẫu (.xlsx)
                </a>
              </div>

              {/* Bước 2: Upload */}
              <div className="am-form-group" style={{ marginTop: "1.5rem" }}>
                <label>Bước 2: Upload file của bạn</label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="am-form-input" // (Tái sử dụng style input)
                />
                <button
                  className="btn primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  {loading ? "Đang xử lý..." : "Upload và Tạo Users"}
                </button>
              </div>

              {/* Bước 3: Báo cáo lỗi (Như bạn yêu cầu) */}
              {/* (Nó chỉ hiển thị nếu 'uploadReport' có nội dung) */}
              {uploadReport && (
                <div
                  className="am-import-report"
                  style={{ marginTop: "1.5rem" }}
                >
                  <strong>Chi tiết lỗi (từ file Excel):</strong>
                  <pre>{uploadReport}</pre>
                </div>
              )}
            </div>

            <div className="am-modal__footer">
              <button
                className="btn outline"
                onClick={() => setShowImportModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

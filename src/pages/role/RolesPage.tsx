import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaDownload, FaCheck, FaChevronDown } from "react-icons/fa";

// 1. IMPORT TRẠM API
import { apiClient } from "../../api/apiClient";
import { translateRole } from "../../utils/translations";
import { useAuth } from "../../context/AuthContext";

// --- (STYLED-COMPONENTS CỦA BẠN) ---
// (Tôi sẽ rút gọn, bạn hãy giữ nguyên code của bạn)
const PageContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 1.5rem;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: 0;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
  flex-shrink: 0;
  min-height: 0;
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

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  background: white;
  flex-shrink: 0;
  min-height: 0;
  input background: white;
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
`;

const FilterWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const FilterDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.08);
  padding: 0.5rem;
  min-width: 13.75rem;
  z-index: 60;
`;

const FilterItem = styled.div<{ $active?: boolean }>`
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.95rem;
  color: ${(p) => (p.$active ? "#dc2626" : "#111827")};
  background: ${(p) => (p.$active ? "#fee2e2" : "transparent")};

  &:hover {
    background: #f9fafb;
  }
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
      ? `background-color:#dc2626;color:white; &:hover{background-color:#b91c1c}`
      : `background:white;color:#4b5563;border:1px solid #e5e7eb; &:hover{background:#f9fafb}`}
`;

const FlexLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: stretch;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
`;

const Sidebar = styled.aside`
  width: 20rem;
  min-width: 17.5rem;
  max-width: 20rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  align-items: stretch;

  @media (max-width: 1024px) {
    width: 17.5rem;
    min-width: 16.25rem;
    max-width: 17.5rem;
    gap: 0.75rem;
  }

  @media (max-width: 768px) {
    width: 15rem;
    min-width: 13.75rem;
    max-width: 15rem;
    gap: 0.6rem;
  }

  @media (max-width: 480px) {
    width: 12.5rem;
    min-width: 11.25rem;
    max-width: 12.5rem;
    gap: 0.5rem;
  }
`;

const SidebarSection = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.06);
  padding: 0.75rem;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-weight: 700;
  color: #374151;
  border-bottom: 1px solid #eef2f6;
  flex-shrink: 0;
  min-height: 0;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.35rem 0.5rem;
    font-size: 0.85rem;
  }
`;

const AddRoleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #b91c1c;
  }

  svg {
    font-size: 0.75rem;
  }
`;

const CountBadge = styled.span`
  background: #f3f4f6;
  color: #374151;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;

  @media (max-width: 768px) {
    padding: 0.1rem 0.4rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.08rem 0.35rem;
    font-size: 0.75rem;
  }
`;

const RoleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.75rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;

  /* Ẩn scrollbar nhưng vẫn cho phép scroll */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

// RoleList cho Default Roles - không cho phép scroll
const DefaultRoleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.75rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;

  @media (max-width: 768px) {
    gap: 0.2rem;
    margin-top: 0.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.15rem;
    margin-top: 0.5rem;
  }
`;

// SidebarSection cho Default Roles - responsive
const DefaultRolesSection = styled(SidebarSection)`
  flex: 1 1 auto;
  min-height: 0;
  max-height: 100%;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.4rem;
  }
`;

const RoleItem = styled.div<{ $active?: boolean; roleColor?: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.12s ease, transform 0.08s ease;
  background: ${(props) => (props.$active ? "#f8fafc" : "transparent")};
  flex-shrink: 0;
  min-width: 0;
  width: 100%;

  &:hover {
    background: #f9fafb;
    transform: translateY(-0.0625rem);
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.4rem;
  }

  @media (max-width: 480px) {
    gap: 0.4rem;
    padding: 0.35rem;
    border-radius: 0.375rem;
  }
`;

const RoleLeftStripe = styled.div`
  width: 0.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 0.375rem;
    height: 2.25rem;
  }

  @media (max-width: 480px) {
    width: 0.3125rem;
    height: 2rem;
    border-radius: 0.25rem;
  }
`;

const RoleLabel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const RoleName = styled.div`
  font-weight: 700;
  color: #111827;
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  font-size: 0.95rem;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const RoleMeta = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eef2f6;
  flex-shrink: 0;
  min-height: 0;
`;

const PaginationButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0.5rem;
`;

const Content = styled.main`
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.06);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;

  /* Ẩn scrollbar nhưng vẫn cho phép scroll */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
  min-height: 0;
`;

const Panel = styled.section`
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #eef2f6;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  max-height: 100%;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #111827;
  font-weight: 700;
  flex-shrink: 0;
  min-height: 0;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;

  /* Ẩn scrollbar nhưng vẫn cho phép scroll */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const MemberRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: background 0.12s ease;
  flex-shrink: 0;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: break-word;

  &:hover {
    background: #f9fafb;
  }
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  font-weight: 700;
  flex-shrink: 0;
  font-size: 1rem;
`;

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
  max-width: 57.5rem;
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

  /* Custom scrollbar styling */
  scrollbar-width: thin; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

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

const PermissionsColumn = styled.div`
  width: 100%;
  min-height: 0;
  max-height: none;
  overflow: visible;
  padding-right: 0;
  box-sizing: border-box;
`;

const PermissionGroup = styled.div`
  margin-bottom: 1rem;
`;

const GroupDropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const GroupDropdownButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #dc2626;
  }

  svg {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
  }

  &[data-open="true"] svg {
    transform: rotate(180deg);
  }
`;

const GroupDropdownContent = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  max-height: 12.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;

  /* Custom scrollbar styling */
  scrollbar-width: thin; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    width: 0.375rem;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 0.1875rem;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 0.1875rem;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const GroupTitle = styled.div`
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #374151;
  font-size: 0.95rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const PermissionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #4b5563;

  &:hover {
    background: #f9fafb;
  }
`;

const ToggleSwitch = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;

  input {
    display: none;
  }

  span {
    width: 2.75rem;
    height: 1.5rem;
    background: #e5e7eb;
    border-radius: 999px;
    position: relative;
    transition: background 0.12s ease;
  }

  span::after {
    content: "";
    position: absolute;
    top: 0.1875rem;
    left: 0.1875rem;
    width: 1.125rem;
    height: 1.125rem;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.06);
    transition: transform 0.12s ease;
  }

  input:checked + span {
    background: #ef4444;
  }

  input:checked + span::after {
    transform: translateX(1.25rem);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #eef2f6;
  flex-shrink: 0;
  background: white;
  box-sizing: border-box;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
  flex-shrink: 0;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-shrink: 0;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #dc2626;
  }
`;

const ColorInput = styled.input`
  width: 80px;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
`;

// --- HẾT STYLED-COMPONENTS ---

// --- 2. ĐỊNH NGHĨA "KIỂU" (TYPES) DỮ LIỆU ---

// (Interface DTO từ BE)
interface PermissionFromApi {
  id: number;
  action: string;
  name: string;
  description?: string;
}
interface RoleDtoFromApi {
  id: number;
  name: string; // Tên thật từ BE (vd: "ADMIN")
  isActive: boolean;
  userCount: number;
  permissions: PermissionFromApi[];
  createdAt?: string;
  created_at?: string;
}
// (Interface mà GIAO DIỆN của bạn cần)
interface RoleForUI {
  id: number;
  name: string;
  color: string;
  members: number; // (chính là userCount)
  isDefault: boolean;
  permissions: PermissionFromApi[]; // (Giữ lại list quyền)
  createdAt?: string | null;
}
// (Interface Member - Vẫn dùng giả)
interface Member {
  id: number;
  fullName: string;
  email?: string;
}

// (Các hằng số)
const MEMBERS_PER_PAGE = 5;
// Default roles sẽ hiển thị tất cả, không phân trang
// ROLES_PER_PAGE sẽ được tính động dựa trên không gian có sẵn
const DEFAULT_ROLE_NAMES = new Set(["ADMIN", "LAB MANAGER", "SERVICE", "LAB USER", "READONLY"]);
const ROLE_COLORS = ["#5865F2", "#43B581", "#FAA61A", "#EB459E", "#1ABC9C", "#E91E63", "#F1C40F"];

type CustomRoleFilter = "all" | "createdAsc" | "createdDesc" | "membersDesc";

const CUSTOM_ROLE_FILTER_OPTIONS: {
  value: CustomRoleFilter;
  label: string;
}[] = [
  { value: "all", label: "Mặc định" },
  { value: "createdDesc", label: "Ngày tạo gần đây" },
  { value: "createdAsc", label: "Ngày tạo xa nhất" },
  { value: "membersDesc", label: "Số lượng thành viên" },
];

const RolesPage: React.FC = () => {
  const { user } = useAuth();
  // --- 3. STATE (TRẠNG THÁI) ---
  const [rolesState, setRolesState] = useState<RoleForUI[]>([]); // Dữ liệu thật (đã chuyển đổi)
  const [allPermissions, setAllPermissions] = useState<PermissionFromApi[]>([]); // Dữ liệu thật
  const [loadingRoles, setLoadingRoles] = useState(true); // (Đổi tên: loading cho Roles)
  const [error, setError] = useState("");

  // (Dữ liệu giả cho Member - Tạm thời giữ lại)
  const [currentMembers, setCurrentMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false); // State loading riêng cho Members

  // (Các state về UI)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [customRoleFilter, setCustomRoleFilter] = useState<CustomRoleFilter>("all");

  // (State cho Modal Create)
  const [roleNameInput, setRoleNameInput] = useState("");
  const [roleColorInput, setRoleColorInput] = useState("#5865F2"); // (Chỉ dùng cho UI)
  const [newRolePermissions, setNewRolePermissions] = useState<Set<number>>(new Set());

  // (State cho Modal Edit)
  const [editRoleName, setEditRoleName] = useState("");
  const [modalPermissions, setModalPermissions] = useState<Set<number>>(new Set());
  const [openPermissionGroups, setOpenPermissionGroups] = useState<Set<string>>(new Set());

  // (State cho Pagination)
  const [customRolesPage, setCustomRolesPage] = useState(0);
  const [membersPage, setMembersPage] = useState(0);
  const [customRolesPerPage, setCustomRolesPerPage] = useState(3); // PageSize động

  // (Các Ref)
  const filterRef = useRef<HTMLDivElement | null>(null);
  const memberListRef = useRef<HTMLDivElement | null>(null);
  const defaultRolesRef = useRef<HTMLDivElement | null>(null);
  const customRolesRef = useRef<HTMLDivElement | null>(null);
  const customRoleListRef = useRef<HTMLDivElement | null>(null);

  // --- 4. HÀM FETCH DỮ LIỆU (READ) ---
  const fetchData = async () => {
    try {
      if (!rolesState.length) setLoadingRoles(true);
      setError("");
      const [rolesResponse, permsResponse] = await Promise.all([
        apiClient.get("/api/roles"),
        apiClient.get("/api/permissions"),
      ]);
      const rolesData: RoleDtoFromApi[] = rolesResponse.data;
      setAllPermissions(permsResponse.data);

      const adaptedRoles = rolesData.map((dto, index) => {
        // Normalize role name: trim whitespace and convert to uppercase for comparison
        const normalizedName = dto.name.trim().toUpperCase();
        const isDefault = DEFAULT_ROLE_NAMES.has(normalizedName);
        const createdAt = dto.createdAt ?? (dto as any).created_at ?? null;

        return {
          id: dto.id,
          name: dto.name,
          members: dto.userCount,
          isDefault: isDefault,
          color: ROLE_COLORS[index % ROLE_COLORS.length],
          permissions: dto.permissions ?? [],
          createdAt,
        };
      });
      setRolesState(adaptedRoles);

      // Lọc ra các role không phải READONLY để chọn
      const visibleRoles = adaptedRoles.filter((r) => {
        const normalizedName = r.name.trim().toUpperCase();
        return normalizedName !== "READONLY" && normalizedName !== "READ-ONLY";
      });

      // Tự động chọn Role đầu tiên (hoặc giữ nguyên selection, nhưng không chọn READONLY)
      const currentSelectedRole = adaptedRoles.find((r) => r.id === selectedRoleId);
      const isCurrentSelectedReadOnly = currentSelectedRole
        ? currentSelectedRole.name.trim().toUpperCase() === "READONLY" ||
          currentSelectedRole.name.trim().toUpperCase() === "READ-ONLY"
        : false;

      if (selectedRoleId === null && visibleRoles.length > 0) {
        setSelectedRoleId(visibleRoles[0].id);
      } else if (
        (isCurrentSelectedReadOnly || !adaptedRoles.some((r) => r.id === selectedRoleId)) &&
        visibleRoles.length > 0
      ) {
        setSelectedRoleId(visibleRoles[0].id);
      } else if (visibleRoles.length === 0) {
        setSelectedRoleId(null);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoadingRoles(false);
    }
  };
  useEffect(() => {
    const fetchMembers = async () => {
      // Nếu không có role nào được chọn, set list rỗng
      if (!selectedRoleId) {
        setCurrentMembers([]);
        return;
      }

      try {
        setLoadingMembers(true); // Bật loading cho bảng Members

        // GỌI API MỚI (đã thêm ở Backend)
        const response = await apiClient.get(`/api/users?roleId=${selectedRoleId}`);

        // (Backend trả về UserDto, chúng ta cần "chuyển đổi" nó)
        const adaptedMembers = response.data.map((user: any) => ({
          id: user.id,
          fullName: user.fullName, // (UserDto của bạn có 'fullName')
          email: user.email,
        }));

        setCurrentMembers(adaptedMembers);
        setMembersPage(0); // Reset về trang 1
      } catch (err) {
        console.error(`Lỗi khi fetch members cho Role ${selectedRoleId}:`, err);
        setCurrentMembers([]); // Set rỗng nếu lỗi
      } finally {
        setLoadingMembers(false); // Tắt loading cho bảng Members
      }
    };

    fetchData(); // (Gọi hàm fetch Roles/Permissions chung)
    fetchMembers(); // (Gọi hàm fetch Members)
  }, [selectedRoleId]); // <-- HÀM NÀY SẼ CHẠY LẠI KHI "selectedRoleId" THAY ĐỔI

  // --- 5. HÀM NGHIỆP VỤ (CREATE, UPDATE, DELETE) ---

  // Helper function to group permissions by category
  const groupPermissionsByCategory = (permissions: PermissionFromApi[]) => {
    const categories: {
      [key: string]: { name: string; permissions: PermissionFromApi[] };
    } = {
      readonly: { name: "Truy cập cơ bản", permissions: [] },
      user: { name: "Quản lý người dùng", permissions: [] },
      role: { name: "Quản lý vai trò", permissions: [] },
      config: { name: "Quản lý cấu hình", permissions: [] },
      comment: { name: "Quản lý bình luận", permissions: [] },
      testrequest: { name: "Quản lý đơn xét nghiệm", permissions: [] },
      other: { name: "Khác", permissions: [] },
    };

    permissions.forEach((perm) => {
      const action = perm.action.toLowerCase();
      if (action === "readonly") {
        categories.readonly.permissions.push(perm);
      } else if (action.startsWith("user:")) {
        categories.user.permissions.push(perm);
      } else if (action.startsWith("role:")) {
        categories.role.permissions.push(perm);
      } else if (action.startsWith("config:")) {
        categories.config.permissions.push(perm);
      } else if (action.startsWith("comment:")) {
        categories.comment.permissions.push(perm);
      } else if (action.startsWith("testrequest:") || action.startsWith("test:")) {
        categories.testrequest.permissions.push(perm);
      } else {
        categories.other.permissions.push(perm);
      }
    });

    // Return only categories that have permissions, in specific order
    const order = ["readonly", "user", "role", "config", "comment", "testrequest", "other"];
    return order.map((key) => categories[key]).filter((cat) => cat.permissions.length > 0);
  };

  // --- CREATE ---
  const handleOpenCreateModal = () => {
    // Reset state
    setRoleNameInput("");
    setRoleColorInput("#5865F2");

    // Tự động gán quyền "readonly" (bắt buộc)
    const readOnlyPerm = allPermissions.find((p) => p.action.toLowerCase() === "readonly");
    if (readOnlyPerm) {
      setNewRolePermissions(new Set([readOnlyPerm.id]));
    } else {
      setNewRolePermissions(new Set());
    }

    setShowCreateModal(true);
  };

  const handleCreateRole = async () => {
    if (!roleNameInput.trim()) {
      alert("Tên vai trò không được để trống.");
      return;
    }
    try {
      // Đảm bảo readonly luôn có trong danh sách
      const readOnlyPerm = allPermissions.find((p) => p.action.toLowerCase() === "readonly");
      const permissionIds = Array.from(newRolePermissions);
      if (readOnlyPerm && !permissionIds.includes(readOnlyPerm.id)) {
        permissionIds.push(readOnlyPerm.id);
      }

      const createRequest = {
        name: roleNameInput.trim(),
        permissionIds,
      };
      await apiClient.post("/api/roles", createRequest);
      setShowCreateModal(false);
      setCustomRolesPage(0); // Reset về trang đầu khi tạo role mới
      await fetchData(); // Tải lại
    } catch (err: any) {
      console.error("Lỗi khi tạo role:", err);
      alert("Lỗi khi tạo: " + (err.response?.data?.message || err.message));
    }
  };

  // --- UPDATE ---
  const openEditModal = () => {
    const roleData = rolesState.find((r) => r.id === selectedRoleId);
    if (!roleData) return;

    setEditRoleName(roleData.name); // Dùng state riêng cho "edit name"

    // Lấy ID quyền hiện tại của Role
    const currentPermissionIds = new Set((roleData.permissions ?? []).map((p) => p.id));

    // Đảm bảo readonly luôn được thêm vào
    const readOnlyPerm = allPermissions.find((p) => p.action.toLowerCase() === "readonly");
    if (readOnlyPerm) {
      currentPermissionIds.add(readOnlyPerm.id);
    }

    setModalPermissions(currentPermissionIds);
    // Mở tất cả các group khi mở modal
    const groups = groupPermissionsByCategory(allPermissions);
    setOpenPermissionGroups(new Set(groups.map((g) => g.name)));

    setShowModal(true);
  };

  const togglePermissionGroup = (groupName: string) => {
    setOpenPermissionGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const handleUpdateRole = async () => {
    if (!selectedRoleId) return;
    if (!user?.id) {
      alert("Không xác định được người cập nhật. Vui lòng đăng nhập lại.");
      return;
    }
    try {
      // Đảm bảo readonly luôn có trong danh sách
      const readOnlyPerm = allPermissions.find((p) => p.action.toLowerCase() === "readonly");
      const permissionIds = Array.from(modalPermissions);
      if (readOnlyPerm && !permissionIds.includes(readOnlyPerm.id)) {
        permissionIds.push(readOnlyPerm.id);
      }

      const updateRequest = {
        name: editRoleName.trim(),
        permissionIds,
        updatedBy: user.id,
      };
      await apiClient.put(`/api/roles/${selectedRoleId}`, updateRequest);
      setShowModal(false);
      await fetchData(); // Tải lại
    } catch (err: any) {
      console.error("Lỗi khi cập nhật role:", err);
      alert("Lỗi khi cập nhật: " + (err.response?.data?.message || err.message));
    }
  };

  const handleModalPermissionToggle = (permissionId: number) => {
    const permission = allPermissions.find((p) => p.id === permissionId);
    // Không cho phép tắt quyền readonly
    if (permission && permission.action.toLowerCase() === "readonly") {
      return;
    }
    setModalPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  // --- DELETE ---
  const handleDeleteRole = async () => {
    if (!selectedRoleId) return;

    // Lấy role từ state để đảm bảo có dữ liệu mới nhất
    const roleToDelete = rolesState.find((r) => r.id === selectedRoleId);
    if (!roleToDelete) {
      alert("Không tìm thấy role để xóa.");
      setShowDeleteConfirm(false);
      return;
    }

    // Kiểm tra lại trước khi xóa - chỉ check default roles
    if (!canDeleteRole(roleToDelete)) {
      const normalizedName = roleToDelete.name.trim().toUpperCase();
      const isDefault = DEFAULT_ROLE_NAMES.has(normalizedName) || roleToDelete.isDefault;

      if (isDefault) {
        alert("Không thể xóa role mặc định.");
      }
      setShowDeleteConfirm(false);
      return;
    }

    try {
      // Trước khi xóa, kiểm tra xem role có users không
      // Nếu có, chuyển tất cả users về role "read only"
      let usersToUpdate: any[] = [];

      try {
        // Lấy danh sách users có role này
        const usersResponse = await apiClient.get(`/api/users`);
        const allUsers = usersResponse.data || [];

        // Lọc users có role trùng với role đang xóa
        usersToUpdate = allUsers.filter((user: any) => {
          // Kiểm tra nhiều trường hợp để đảm bảo tìm đúng users
          const userRoleId = user.roleId || (user.role && user.role.id) || null;
          const userRoleName = user.roleName || (user.role && user.role.name) || null;

          // So sánh bằng ID
          if (userRoleId === selectedRoleId || userRoleId === roleToDelete.id) {
            return true;
          }

          // So sánh bằng tên (case-insensitive)
          if (userRoleName) {
            const normalizedUserRoleName = userRoleName.trim().toUpperCase();
            const normalizedRoleToDeleteName = roleToDelete.name.trim().toUpperCase();
            if (normalizedUserRoleName === normalizedRoleToDeleteName) {
              return true;
            }
          }

          return false;
        });
      } catch (usersErr) {
        console.warn("Không thể lấy danh sách users:", usersErr);
        // Tiếp tục xóa role dù không lấy được users
      }

      // Tìm role "read only" (READONLY hoặc READ-ONLY)
      const readOnlyRole = rolesState.find((r) => {
        const normalizedName = r.name.trim().toUpperCase();
        return normalizedName === "READONLY" || normalizedName === "READ-ONLY";
      });

      if (!readOnlyRole) {
        alert("Không tìm thấy role 'Read Only'. Vui lòng đảm bảo role này tồn tại trong hệ thống.");
        setShowDeleteConfirm(false);
        return;
      }

      // Nếu có users, chuyển tất cả về role "read only"
      if (usersToUpdate.length > 0) {
        try {
          // Cập nhật role của từng user về "read only"
          const updatePromises = usersToUpdate.map(async (user: any) => {
            try {
              // Lấy thông tin đầy đủ của user
              const userDetailResponse = await apiClient.get(`/api/users/${user.id}`);
              const userDetail = userDetailResponse.data;

              // Cập nhật user với roleId = readOnlyRole.id
              return apiClient.put(`/api/users/${user.id}`, {
                fullName: userDetail.fullName || user.fullName,
                email: userDetail.email || user.email,
                phone: userDetail.phone || null,
                dob: userDetail.dob ? new Date(userDetail.dob) : null,
                roleId: readOnlyRole.id, // Chuyển về read only
                gender: userDetail.gender,
                rhFactor: userDetail.rhFactor || null,
                bloodType: userDetail.bloodType || null,
                medicalHistory: userDetail.medicalHistory || null,
                isActive: userDetail.isActive !== undefined ? userDetail.isActive : true,
              });
            } catch (detailErr: any) {
              // Nếu không lấy được detail, thử cập nhật với thông tin có sẵn
              console.warn(`Không thể lấy chi tiết user ${user.id}, thử cập nhật với thông tin có sẵn`);
              return apiClient.put(`/api/users/${user.id}`, {
                fullName: user.fullName,
                email: user.email,
                phone: user.phone || null,
                dob: user.dob ? new Date(user.dob) : null,
                roleId: readOnlyRole.id, // Chuyển về read only
                gender: user.gender,
                rhFactor: user.rhFactor || null,
                bloodType: user.bloodType || null,
                medicalHistory: user.medicalHistory || null,
                isActive: user.isActive !== undefined ? user.isActive : true,
              });
            }
          });

          await Promise.all(updatePromises);
        } catch (updateErr: any) {
          console.error("Lỗi khi cập nhật users:", updateErr);
          alert(
            "Lỗi khi chuyển role của các tài khoản về 'Read Only': " +
              (updateErr.response?.data?.message || updateErr.message)
          );
          setShowDeleteConfirm(false);
          return;
        }
      }

      // Sau khi cập nhật users (nếu có), xóa role
      await apiClient.delete(`/api/roles/${selectedRoleId}`);

      setShowDeleteConfirm(false);
      setSelectedRoleId(null); // Reset selection

      if (usersToUpdate.length > 0) {
        alert(`Đã chuyển ${usersToUpdate.length} tài khoản về role 'Read Only' và xóa role thành công.`);
      } else {
        alert("Xóa role thành công.");
      }

      await fetchData(); // Tải lại
    } catch (err: any) {
      console.error("Lỗi khi xóa role:", err);
      const errorMessage = err.response?.data?.message || err.message || "Lỗi không xác định";
      alert("Lỗi khi xóa role: " + errorMessage);
      setShowDeleteConfirm(false);
    }
  };

  // --- 6. GỌI FETCHDATA LẦN ĐẦU (useEffect) ---
  useEffect(() => {
    fetchData(); // Gọi hàm fetch
  }, []); // [] = Chỉ chạy 1 lần

  // --- 7. LOGIC LỌC VÀ HIỂN THỊ ---
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const isReadonlyRole = (role: RoleForUI) => {
    const normalizedName = role.name.trim().toUpperCase();
    return normalizedName === "READONLY" || normalizedName === "READ-ONLY";
  };

  const defaultRolesRaw = rolesState.filter((role) => {
    if (isReadonlyRole(role)) return false;
    if (role.isDefault) return true;
    const normalizedName = role.name.trim().toUpperCase();
    return DEFAULT_ROLE_NAMES.has(normalizedName);
  });

  const customRolesRaw = rolesState.filter((role) => {
    if (isReadonlyRole(role)) return false;
    const normalizedName = role.name.trim().toUpperCase();
    return !DEFAULT_ROLE_NAMES.has(normalizedName);
  });

  const customRolesFiltered = customRolesRaw.filter((role) =>
    normalizedSearch ? role.name.toLowerCase().includes(normalizedSearch) : true
  );

  const sortedDefaultRoles = [...defaultRolesRaw].sort((a, b) =>
    a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
  );

  // Default roles hiển thị tất cả, không phân trang

  const processedCustomRoles = (() => {
    const list = [...customRolesFiltered];
    const toTime = (role: RoleForUI) => (role.createdAt ? new Date(role.createdAt).getTime() : Number.MIN_SAFE_INTEGER);

    switch (customRoleFilter) {
      case "createdAsc":
        return list.sort((a, b) => toTime(a) - toTime(b));
      case "createdDesc":
        return list.sort((a, b) => toTime(b) - toTime(a));
      case "membersDesc":
        return list.sort((a, b) => b.members - a.members);
      case "all":
      default:
        return list.sort((a, b) => a.name.localeCompare(b.name, "vi", { sensitivity: "base" }));
    }
  })();

  const visibleRolesForSelection = [...sortedDefaultRoles, ...processedCustomRoles];

  const selectedRoleData =
    visibleRolesForSelection.find((r) => r.id === selectedRoleId) ??
    (visibleRolesForSelection.length > 0 ? visibleRolesForSelection[0] : null);
  const members = currentMembers;

  // Helper function để kiểm tra role có thể xóa hay không
  const canDeleteRole = (role: RoleForUI | null): boolean => {
    if (!role) return false;

    // Không thể xóa role mặc định (bao gồm READONLY)
    const normalizedName = role.name.trim().toUpperCase();
    if (DEFAULT_ROLE_NAMES.has(normalizedName)) {
      return false;
    }

    // Kiểm tra isDefault từ API
    if (role.isDefault) {
      return false;
    }

    return true;
  };
  const totalCustomPages = Math.max(1, Math.ceil(processedCustomRoles.length / Math.max(1, customRolesPerPage)));
  // Đảm bảo customRolesPage không vượt quá totalCustomPages
  const safeCustomRolesPage = Math.min(customRolesPage, Math.max(0, totalCustomPages - 1));
  const paginatedCustomRoles = processedCustomRoles.slice(
    safeCustomRolesPage * customRolesPerPage,
    (safeCustomRolesPage + 1) * customRolesPerPage
  );

  const totalMemberPages = Math.ceil(members.length / MEMBERS_PER_PAGE);
  const paginatedMembers = members.slice(membersPage * MEMBERS_PER_PAGE, (membersPage + 1) * MEMBERS_PER_PAGE);

  const handleRoleSelect = (roleId: number) => {
    setSelectedRoleId(roleId);
    setMembersPage(0);
    if (memberListRef.current) {
      memberListRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Reset custom roles page when filtered/sorted list changes or when page size changes
  useEffect(() => {
    const maxPage = Math.max(0, totalCustomPages - 1);
    if (customRolesPage > maxPage && totalCustomPages > 0) {
      setCustomRolesPage(Math.max(0, maxPage));
    } else if (totalCustomPages === 0 && customRolesPage > 0) {
      setCustomRolesPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCustomPages, customRolesPerPage, processedCustomRoles.length]);

  // Tính toán pageSize động cho Custom Roles dựa trên không gian có sẵn
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let previousPageSize = customRolesPerPage;

    const calculatePageSize = () => {
      if (!customRoleListRef.current) return;

      const listElement = customRoleListRef.current;
      const availableHeight = listElement.clientHeight;

      // Nếu không có không gian, giữ nguyên giá trị hiện tại
      if (availableHeight <= 0) return;

      // Chiều cao của một RoleItem (khoảng 48px + gap 4px = ~52px)
      // Lấy từ một item mẫu nếu có, hoặc dùng giá trị mặc định
      const sampleItem = listElement.querySelector("[data-role-item]") as HTMLElement;
      let itemHeight = 52; // Giá trị mặc định

      if (sampleItem) {
        // Lấy chiều cao thực tế của item
        const computedStyle = window.getComputedStyle(sampleItem);
        const marginTop = parseFloat(computedStyle.marginTop) || 0;
        const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
        itemHeight = sampleItem.offsetHeight + marginTop + marginBottom;
      }

      // Gap giữa các items (0.25rem = 4px)
      const gap = 4;

      // Tính số lượng items có thể fit (trừ đi một chút để đảm bảo không bị cắt)
      // Công thức: (availableHeight - gap) / (itemHeight + gap)
      const itemsPerPage = Math.max(1, Math.floor((availableHeight - gap) / (itemHeight + gap)));

      // Nếu page size thay đổi, reset về trang đầu để tránh glitch
      if (itemsPerPage !== previousPageSize && previousPageSize > 0) {
        setCustomRolesPage(0);
      }

      previousPageSize = itemsPerPage;
      setCustomRolesPerPage(itemsPerPage);
    };

    const debouncedCalculate = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(calculatePageSize, 150);
    };

    // Delay một chút để đảm bảo DOM đã render
    debouncedCalculate();

    const resizeObserver = new ResizeObserver(() => {
      debouncedCalculate();
    });

    if (customRoleListRef.current) {
      resizeObserver.observe(customRoleListRef.current);
    }

    // Cũng observe window resize
    window.addEventListener("resize", debouncedCalculate);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedCalculate);
    };
  }, [customRolesFiltered.length]); // Recalculate when list changes

  // Reset to page 0 when search term or sort option changes
  useEffect(() => {
    setCustomRolesPage(0);
  }, [searchTerm, customRoleFilter]);

  // Removed calculateHeight - using flexbox layout instead

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!filterRef.current) return;
      if (filterRef.current.contains(e.target as Node)) return;
      setShowFilterDropdown(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowFilterDropdown(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // --- 8. RENDER (HIỂN THỊ) ---
  if (loadingRoles) {
    // (Chỉ loading khi tải Roles)
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Đang tải trang...</PageTitle>
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
      <ControlBar>
        <SearchBox>
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm vai trò" // (Chỉ tìm role, vì member ta chưa fetch)
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        <ActionButtons>
          {/* (Filter Dropdown giữ nguyên) */}
          <FilterWrapper ref={filterRef}>
            <Button $variant="secondary" onClick={() => setShowFilterDropdown((s) => !s)}>
              <FaFilter />
              {CUSTOM_ROLE_FILTER_OPTIONS.find((item) => item.value === customRoleFilter)?.label ?? "Lọc custom role"}
            </Button>
            {showFilterDropdown && (
              <FilterDropdown>
                {CUSTOM_ROLE_FILTER_OPTIONS.map((option) => (
                  <FilterItem
                    key={option.value}
                    $active={customRoleFilter === option.value}
                    onClick={() => {
                      setCustomRoleFilter(option.value);
                      setShowFilterDropdown(false);
                    }}
                  >
                    <span>{option.label}</span>
                    {customRoleFilter === option.value && <FaCheck size={12} />}
                  </FilterItem>
                ))}
              </FilterDropdown>
            )}
          </FilterWrapper>
          <Button $variant="secondary">
            <FaDownload /> Xuất
          </Button>
        </ActionButtons>
      </ControlBar>

      <FlexLayout>
        <Sidebar>
          {/* --- DEFAULT ROLES --- */}
          <DefaultRolesSection ref={defaultRolesRef}>
            <SidebarHeader>
              Vai Trò Mặc Định
              <CountBadge>{sortedDefaultRoles.length}</CountBadge>
            </SidebarHeader>
            <DefaultRoleList>
              {sortedDefaultRoles.map((role) => (
                <RoleItem
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  $active={role.id === selectedRoleId}
                  title={`${role.name} — ${role.members} thành viên`}
                >
                  <RoleLeftStripe style={{ backgroundColor: role.color }} />
                  <RoleLabel>
                    <RoleName>{translateRole(role.name)}</RoleName>
                    <RoleMeta>{role.members} thành viên</RoleMeta>
                  </RoleLabel>
                </RoleItem>
              ))}
            </DefaultRoleList>
          </DefaultRolesSection>

          {/* --- CUSTOM ROLES --- */}
          <SidebarSection ref={customRolesRef}>
            <SidebarHeader>
              Vai Trò Tùy Chỉnh
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <CountBadge>{customRolesFiltered.length}</CountBadge>
                <AddRoleButton onClick={handleOpenCreateModal}>
                  <FaPlus />
                </AddRoleButton>
              </div>
            </SidebarHeader>
            <RoleList ref={customRoleListRef}>
              {customRolesFiltered.length === 0 ? (
                <EmptyState>Chưa có vai trò tùy chỉnh</EmptyState>
              ) : (
                paginatedCustomRoles.map((role) => (
                  <RoleItem
                    key={role.id}
                    data-role-item
                    onClick={() => handleRoleSelect(role.id)}
                    $active={role.id === selectedRoleId}
                    title={`${role.name} — ${role.members} thành viên`}
                  >
                    <RoleLeftStripe style={{ backgroundColor: role.color }} />
                    <RoleLabel>
                      <RoleName>{translateRole(role.name)}</RoleName>
                      <RoleMeta>{role.members} thành viên</RoleMeta>
                    </RoleLabel>
                  </RoleItem>
                ))
              )}
            </RoleList>

            {customRolesFiltered.length > 0 && totalCustomPages > 1 && (
              <PaginationControls>
                <PaginationButton
                  onClick={() => setCustomRolesPage((p) => Math.max(0, p - 1))}
                  disabled={safeCustomRolesPage === 0}
                >
                  ← Trước
                </PaginationButton>
                <PageInfo>
                  Trang {safeCustomRolesPage + 1}/{totalCustomPages}
                </PageInfo>
                <PaginationButton
                  onClick={() => setCustomRolesPage((p) => Math.min(totalCustomPages - 1, p + 1))}
                  disabled={safeCustomRolesPage >= totalCustomPages - 1}
                >
                  Tiếp →
                </PaginationButton>
              </PaginationControls>
            )}
          </SidebarSection>
        </Sidebar>

        {/* --- CONTENT (Bên phải) - ĐÃ SỬA LẠI ĐẦY ĐỦ --- */}
        <Content ref={memberListRef}>
          {selectedRoleData ? (
            <>
              <ContentHeader>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>{selectedRoleData.name}</h2>
                  <div style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
                    {selectedRoleData.members} thành viên
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {/* NÚT NÀY LUÔN HIỂN THỊ */}
                  <Button $variant="secondary" onClick={openEditModal}>
                    <FaEdit /> Chỉnh sửa quyền
                  </Button>

                  {/* NÚT "XÓA" CHỈ HIỆN KHI ROLE CÓ THỂ XÓA ĐƯỢC */}
                  {canDeleteRole(selectedRoleData) && (
                    <Button $variant="secondary" onClick={() => setShowDeleteConfirm(true)}>
                      <FaTrash /> Xóa
                    </Button>
                  )}
                </div>
              </ContentHeader>
              {/* --- HẾT PHẦN BỊ THIẾU --- */}
              {/* 2. PHẦN "THÀNH VIÊN" (BẠN ĐÃ CÓ) */}
              <Panel>
                <SectionTitle>Thành viên</SectionTitle>
                {loadingMembers ? (
                  <EmptyState>Đang tải thành viên...</EmptyState>
                ) : (
                  <MemberList>
                    {members.length === 0 && <EmptyState>Không có thành viên</EmptyState>}
                    {paginatedMembers.map((m) => (
                      <MemberRow key={m.id}>
                        <Avatar>{m.fullName.split(" ").pop()?.charAt(0) ?? m.fullName.charAt(0)}</Avatar>
                        <div>
                          <div style={{ fontWeight: 600 }}>{m.fullName}</div>
                          {m.email && <div style={{ color: "#6b7280", fontSize: 13 }}>{m.email}</div>}
                        </div>
                      </MemberRow>
                    ))}
                  </MemberList>
                )}

                {/* Member Pagination */}
                {totalMemberPages > 1 && (
                  <PaginationControls>
                    <PaginationButton
                      onClick={() => setMembersPage((p) => Math.max(0, p - 1))}
                      disabled={membersPage === 0}
                    >
                      ← Trước
                    </PaginationButton>
                    <PageInfo>
                      Trang {membersPage + 1}/{totalMemberPages}
                    </PageInfo>
                    <PaginationButton
                      onClick={() => setMembersPage((p) => Math.min(totalMemberPages - 1, p + 1))}
                      disabled={membersPage >= totalMemberPages - 1}
                    >
                      Tiếp →
                    </PaginationButton>
                  </PaginationControls>
                )}
              </Panel>
            </>
          ) : (
            // (Nếu không có role nào được chọn)
            <EmptyState>Vui lòng chọn một vai trò để xem chi tiết.</EmptyState>
          )}
        </Content>
      </FlexLayout>

      {/* --- MODAL CHỈNH SỬA QUYỀN (UPDATE) --- */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>Chỉnh sửa quyền hạn - {selectedRoleData?.name}</ModalHeader>
            <ModalBody>
              {/* (Sửa: Dùng state 'editRoleName') */}
              <FormGroup>
                <Label>Tên vai trò</Label>
                <Input
                  value={editRoleName}
                  onChange={(e) => setEditRoleName(e.target.value)}
                  placeholder="Nhập tên vai trò"
                />
              </FormGroup>

              <FormGroup>
                <Label>Quyền hạn</Label>
                <PermissionsColumn>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    {groupPermissionsByCategory(allPermissions).map((category) => {
                      const isOpen = openPermissionGroups.has(category.name);
                      const selectedCount = category.permissions.filter((p) => modalPermissions.has(p.id)).length;
                      return (
                        <PermissionGroup key={category.name}>
                          <GroupDropdownWrapper>
                            <GroupDropdownButton
                              type="button"
                              onClick={() => togglePermissionGroup(category.name)}
                              data-open={isOpen}
                            >
                              <span>
                                {category.name}
                                {selectedCount > 0 && (
                                  <span
                                    style={{
                                      marginLeft: "0.5rem",
                                      color: "#dc2626",
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    ({selectedCount}/{category.permissions.length})
                                  </span>
                                )}
                              </span>
                              <FaChevronDown />
                            </GroupDropdownButton>
                            <GroupDropdownContent $isOpen={isOpen}>
                              {category.permissions.map((item) => {
                                const isReadOnly = item.action.toLowerCase() === "readonly";
                                return (
                                  <PermissionRow key={item.id}>
                                    <div>
                                      {item.name} ({item.action})
                                    </div>
                                    <ToggleSwitch>
                                      <input
                                        type="checkbox"
                                        checked={modalPermissions.has(item.id)}
                                        onChange={() => handleModalPermissionToggle(item.id)}
                                        disabled={isReadOnly}
                                      />
                                      <span />
                                    </ToggleSwitch>
                                  </PermissionRow>
                                );
                              })}
                            </GroupDropdownContent>
                          </GroupDropdownWrapper>
                        </PermissionGroup>
                      );
                    })}
                  </div>
                </PermissionsColumn>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button $variant="secondary" onClick={() => setShowModal(false)}>
                Hủy
              </Button>
              <Button $variant="primary" onClick={handleUpdateRole}>
                Cập nhật
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* --- MODAL XÁC NHẬN XÓA (DELETE) --- */}
      {showDeleteConfirm && selectedRoleData && canDeleteRole(selectedRoleData) && (
        <ModalOverlay onClick={() => setShowDeleteConfirm(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>Xác nhận xóa</ModalHeader>
            <ModalBody>
              <div style={{ marginBottom: 12 }}>Bạn có chắc muốn xóa vai trò "{selectedRoleData?.name}"?</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <Button $variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Hủy
                </Button>
                <Button $variant="primary" onClick={handleDeleteRole}>
                  Xóa
                </Button>
              </div>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* --- MODAL TẠO MỚI (CREATE) --- */}
      {showCreateModal && (
        <ModalOverlay onClick={() => setShowCreateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>Tạo vai trò tùy chỉnh</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Tên vai trò</Label>
                <Input
                  value={roleNameInput}
                  onChange={(e) => setRoleNameInput(e.target.value)}
                  placeholder="Nhập tên vai trò"
                />
              </FormGroup>

              {/* (Phần chọn màu (UI-only) giữ nguyên) */}
              <FormGroup>
                <Label>Màu vai trò</Label>
                <ColorInput type="color" value={roleColorInput} onChange={(e) => setRoleColorInput(e.target.value)} />
              </FormGroup>

              {/* (Sửa: Hiển thị Permissions thật) */}
              <FormGroup>
                <Label>Quyền hạn</Label>
                <PermissionsColumn>
                  {groupPermissionsByCategory(allPermissions).map((category) => (
                    <PermissionGroup key={category.name}>
                      <GroupTitle>{category.name}</GroupTitle>
                      {category.permissions.map((item) => {
                        const isReadOnly = item.action.toLowerCase() === "readonly";
                        return (
                          <PermissionRow key={item.id}>
                            <div>
                              {item.name} ({item.action})
                            </div>
                            <ToggleSwitch>
                              <input
                                type="checkbox"
                                checked={newRolePermissions.has(item.id)}
                                onChange={() => {
                                  // (Không cho phép bỏ check 'readonly')
                                  if (!isReadOnly) {
                                    setNewRolePermissions((prev) => {
                                      const newSet = new Set(prev);
                                      if (newSet.has(item.id)) newSet.delete(item.id);
                                      else newSet.add(item.id);
                                      return newSet;
                                    });
                                  }
                                }}
                                disabled={isReadOnly}
                              />
                              <span />
                            </ToggleSwitch>
                          </PermissionRow>
                        );
                      })}
                    </PermissionGroup>
                  ))}
                </PermissionsColumn>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button $variant="secondary" onClick={() => setShowCreateModal(false)}>
                Hủy
              </Button>
              <Button $variant="primary" onClick={handleCreateRole}>
                Tạo
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default RolesPage;

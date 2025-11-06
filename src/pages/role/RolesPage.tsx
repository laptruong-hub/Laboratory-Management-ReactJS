import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaDownload,
  FaCheck,
} from "react-icons/fa";

// 1. IMPORT TRẠM API
import { apiClient } from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";

// --- (STYLED-COMPONENTS CỦA BẠN) ---
// (Tôi sẽ rút gọn, bạn hãy giữ nguyên code của bạn)
const PageContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
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
  input background: white;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  flex: 1;
  max-width: 400px;

  input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 0.9rem;
    margin-left: 0.5rem;
    background: #ffffff;
    color: #1f2937;

    &::placeholder {
      color: #94a3b8;
    }
  }
  svg {
    color: #9ca3af;
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
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 0.5rem;
  min-width: 220px;
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
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  ${(props) =>
    props.$variant === "primary"
      ? `background-color:#dc2626;color:white; &:hover{background-color:#b91c1c}`
      : `background:white;color:#4b5563;border:1px solid #e5e7eb; &:hover{background:#f9fafb}`}
`;

const FlexLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
`;

const Sidebar = styled.aside`
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SidebarSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 0.75rem;
  height: auto;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-weight: 700;
  color: #374151;
  border-bottom: 1px solid #eef2f6;
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
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

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
`;

const RoleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.75rem;
  min-height: 240px;
`;

const RoleItem = styled.div<{ $active?: boolean; roleColor?: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s ease, transform 0.08s ease;
  background: ${(props) => (props.$active ? "#f8fafc" : "transparent")};

  &:hover {
    background: #f9fafb;
    transform: translateY(-1px);
  }
`;

const RoleLeftStripe = styled.div`
  width: 8px;
  height: 40px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const RoleLabel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const RoleName = styled.div`
  font-weight: 700;
  color: #111827;
`;

const RoleMeta = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eef2f6;
`;

const PaginationButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #4b5563;
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

const PageInfo = styled.span`
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0.5rem;
`;

const Content = styled.main`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: auto;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Panel = styled.section`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #eef2f6;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #111827;
  font-weight: 700;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MemberRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background 0.12s ease;

  &:hover {
    background: #f9fafb;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  font-weight: 700;
  flex-shrink: 0;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 50;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 920px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1rem 1.25rem;
  font-weight: 800;
  border-bottom: 1px solid #eef2f6;
  font-size: 1.1rem;
  color: #111827;
`;

const ModalBody = styled.div`
  padding: 1rem 1.25rem 1.5rem 1.25rem;
`;

const PermissionsColumn = styled.div`
  flex: 2;
  max-height: 420px;
  overflow: auto;
  padding-right: 0.5rem;
`;

const PermissionGroup = styled.div`
  margin-bottom: 1.5rem;
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

  input {
    display: none;
  }

  span {
    width: 44px;
    height: 24px;
    background: #e5e7eb;
    border-radius: 999px;
    position: relative;
    transition: background 0.12s ease;
  }

  span::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    transition: transform 0.12s ease;
  }

  input:checked + span {
    background: #ef4444;
  }

  input:checked + span::after {
    transform: translateX(20px);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
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
const ROLES_PER_PAGE = 3;
const MEMBERS_PER_PAGE = 5;
const DEFAULT_ROLE_NAMES = new Set([
  "ADMIN",
  "LAB MANAGER",
  "SERVICE",
  "LAB USER",
  "READONLY",
]);
const ROLE_COLORS = [
  "#5865F2",
  "#43B581",
  "#FAA61A",
  "#EB459E",
  "#1ABC9C",
  "#E91E63",
  "#F1C40F",
];

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
  const [customRoleFilter, setCustomRoleFilter] =
    useState<CustomRoleFilter>("all");

  // (State cho Modal Create)
  const [roleNameInput, setRoleNameInput] = useState("");
  const [roleColorInput, setRoleColorInput] = useState("#5865F2"); // (Chỉ dùng cho UI)
  const [newRolePermissions, setNewRolePermissions] = useState<Set<number>>(
    new Set()
  );

  // (State cho Modal Edit)
  const [editRoleName, setEditRoleName] = useState("");
  const [modalPermissions, setModalPermissions] = useState<Set<number>>(
    new Set()
  );

  // (State cho Pagination)
  const [customRolesPage, setCustomRolesPage] = useState(0);
  const [membersPage, setMembersPage] = useState(0);

  // (Các Ref)
  const filterRef = useRef<HTMLDivElement | null>(null);
  const memberListRef = useRef<HTMLDivElement | null>(null);
  const defaultRolesRef = useRef<HTMLDivElement | null>(null);
  const customRolesRef = useRef<HTMLDivElement | null>(null);
  const [memberListHeight, setMemberListHeight] = useState("auto");

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
      const currentSelectedRole = adaptedRoles.find(
        (r) => r.id === selectedRoleId
      );
      const isCurrentSelectedReadOnly = currentSelectedRole
        ? currentSelectedRole.name.trim().toUpperCase() === "READONLY" ||
          currentSelectedRole.name.trim().toUpperCase() === "READ-ONLY"
        : false;

      if (selectedRoleId === null && visibleRoles.length > 0) {
        setSelectedRoleId(visibleRoles[0].id);
      } else if (
        (isCurrentSelectedReadOnly ||
          !adaptedRoles.some((r) => r.id === selectedRoleId)) &&
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
        const response = await apiClient.get(
          `/api/users?roleId=${selectedRoleId}`
        );

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
      } else if (
        action.startsWith("testrequest:") ||
        action.startsWith("test:")
      ) {
        categories.testrequest.permissions.push(perm);
      } else {
        categories.other.permissions.push(perm);
      }
    });

    // Return only categories that have permissions, in specific order
    const order = [
      "readonly",
      "user",
      "role",
      "config",
      "comment",
      "testrequest",
      "other",
    ];
    return order
      .map((key) => categories[key])
      .filter((cat) => cat.permissions.length > 0);
  };

  // --- CREATE ---
  const handleOpenCreateModal = () => {
    // Reset state
    setRoleNameInput("");
    setRoleColorInput("#5865F2");

    // Tự động gán quyền "readonly" (bắt buộc)
    const readOnlyPerm = allPermissions.find(
      (p) => p.action.toLowerCase() === "readonly"
    );
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
      const readOnlyPerm = allPermissions.find(
        (p) => p.action.toLowerCase() === "readonly"
      );
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
    const currentPermissionIds = new Set(
      (roleData.permissions ?? []).map((p) => p.id)
    );

    // Đảm bảo readonly luôn được thêm vào
    const readOnlyPerm = allPermissions.find(
      (p) => p.action.toLowerCase() === "readonly"
    );
    if (readOnlyPerm) {
      currentPermissionIds.add(readOnlyPerm.id);
    }

    setModalPermissions(currentPermissionIds);

    setShowModal(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedRoleId) return;
    if (!user?.id) {
      alert("Không xác định được người cập nhật. Vui lòng đăng nhập lại.");
      return;
    }
    try {
      // Đảm bảo readonly luôn có trong danh sách
      const readOnlyPerm = allPermissions.find(
        (p) => p.action.toLowerCase() === "readonly"
      );
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
      alert(
        "Lỗi khi cập nhật: " + (err.response?.data?.message || err.message)
      );
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

    // Kiểm tra lại trước khi xóa
    if (!canDeleteRole(roleToDelete)) {
      const normalizedName = roleToDelete.name.trim().toUpperCase();
      const isDefault = DEFAULT_ROLE_NAMES.has(normalizedName);

      if (isDefault) {
        alert("Không thể xóa role mặc định.");
      } else if (roleToDelete.members >= 1) {
        alert(`Không thể xóa role có ${roleToDelete.members} thành viên.`);
      }
      setShowDeleteConfirm(false);
      return;
    }

    try {
      await apiClient.delete(`/api/roles/${selectedRoleId}`);
      setShowDeleteConfirm(false);
      setSelectedRoleId(null); // Reset selection
      await fetchData(); // Tải lại
    } catch (err: any) {
      console.error("Lỗi khi xóa role:", err);

      // Nếu lỗi do role đang được sử dụng, tự động chuyển role của users về unassigned
      const errorMessage = err.response?.data?.message || err.message || "";
      const isRoleInUse =
        errorMessage.toLowerCase().includes("role") &&
        (errorMessage.toLowerCase().includes("đang") ||
          errorMessage.toLowerCase().includes("được") ||
          errorMessage.toLowerCase().includes("in use") ||
          errorMessage.toLowerCase().includes("used") ||
          err.response?.status === 400 ||
          err.response?.status === 409);

      if (isRoleInUse) {
        try {
          // Lấy danh sách users có role này
          const usersResponse = await apiClient.get(
            `/api/users?roleId=${selectedRoleId}`
          );
          const users = usersResponse.data || [];

          // Cập nhật role của từng user về null (unassigned)
          if (users.length > 0) {
            // Fetch đầy đủ thông tin của từng user trước khi cập nhật
            const updatePromises = users.map(async (user: any) => {
              try {
                // Lấy thông tin đầy đủ của user
                const userDetailResponse = await apiClient.get(
                  `/api/users/${user.id}`
                );
                const userDetail = userDetailResponse.data;

                // Cập nhật user với roleId = null
                return apiClient.put(`/api/users/${user.id}`, {
                  fullName: userDetail.fullName || user.fullName,
                  email: userDetail.email || user.email,
                  phone: userDetail.phone || null,
                  dob: userDetail.dob ? new Date(userDetail.dob) : null,
                  roleId: null, // Set về unassigned
                  gender: userDetail.gender,
                  rhFactor: userDetail.rhFactor || null,
                  bloodType: userDetail.bloodType || null,
                  medicalHistory: userDetail.medicalHistory || null,
                  isActive:
                    userDetail.isActive !== undefined
                      ? userDetail.isActive
                      : true,
                });
              } catch (detailErr: any) {
                // Nếu không lấy được detail, thử cập nhật với thông tin có sẵn
                console.warn(
                  `Không thể lấy chi tiết user ${user.id}, thử cập nhật với thông tin có sẵn`
                );
                return apiClient.put(`/api/users/${user.id}`, {
                  fullName: user.fullName,
                  email: user.email,
                  phone: user.phone || null,
                  dob: user.dob ? new Date(user.dob) : null,
                  roleId: null,
                  gender: user.gender,
                  rhFactor: user.rhFactor || null,
                  bloodType: user.bloodType || null,
                  medicalHistory: user.medicalHistory || null,
                  isActive: user.isActive !== undefined ? user.isActive : true,
                });
              }
            });

            await Promise.all(updatePromises);

            // Sau khi cập nhật xong, thử xóa role lại
            await apiClient.delete(`/api/roles/${selectedRoleId}`);

            alert(
              `Đã chuyển ${users.length} tài khoản về trạng thái unassigned và xóa role thành công.`
            );
            setShowDeleteConfirm(false);
            setSelectedRoleId(null);
            await fetchData();
          } else {
            // Không có user nào nhưng vẫn lỗi, có thể do lỗi khác
            alert("Lỗi khi xóa: " + errorMessage);
            setShowDeleteConfirm(false);
          }
        } catch (updateErr: any) {
          console.error("Lỗi khi cập nhật users:", updateErr);
          alert(
            "Lỗi khi cập nhật role của các tài khoản: " +
              (updateErr.response?.data?.message || updateErr.message)
          );
          setShowDeleteConfirm(false);
        }
      } else {
        // Lỗi khác, không phải do role đang được sử dụng
        alert("Lỗi khi xóa: " + errorMessage);
        setShowDeleteConfirm(false);
      }
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

  const processedCustomRoles = (() => {
    const list = [...customRolesFiltered];
    const toTime = (role: RoleForUI) =>
      role.createdAt
        ? new Date(role.createdAt).getTime()
        : Number.MIN_SAFE_INTEGER;

    switch (customRoleFilter) {
      case "createdAsc":
        return list.sort((a, b) => toTime(a) - toTime(b));
      case "createdDesc":
        return list.sort((a, b) => toTime(b) - toTime(a));
      case "membersDesc":
        return list.sort((a, b) => b.members - a.members);
      case "all":
      default:
        return list.sort((a, b) =>
          a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
        );
    }
  })();

  const visibleRolesForSelection = [
    ...sortedDefaultRoles,
    ...processedCustomRoles,
  ];

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

    // Không thể xóa role có từ 1 thành viên trở lên
    if (role.members >= 1) {
      return false;
    }

    return true;
  };
  const totalCustomPages = Math.ceil(
    processedCustomRoles.length / ROLES_PER_PAGE
  );
  const paginatedCustomRoles = processedCustomRoles.slice(
    customRolesPage * ROLES_PER_PAGE,
    (customRolesPage + 1) * ROLES_PER_PAGE
  );

  const totalMemberPages = Math.ceil(members.length / MEMBERS_PER_PAGE);
  const paginatedMembers = members.slice(
    membersPage * MEMBERS_PER_PAGE,
    (membersPage + 1) * MEMBERS_PER_PAGE
  );

  const handleRoleSelect = (roleId: number) => {
    setSelectedRoleId(roleId);
    setMembersPage(0);
    if (memberListRef.current) {
      memberListRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Reset custom roles page when filtered/sorted list changes
  useEffect(() => {
    if (customRolesPage >= totalCustomPages && totalCustomPages > 0) {
      setCustomRolesPage(0);
    }
  }, [totalCustomPages, customRolesPage]);

  // Reset to page 0 when search term or sort option changes
  useEffect(() => {
    setCustomRolesPage(0);
  }, [searchTerm, customRoleFilter]);

  useEffect(() => {
    const calculateHeight = () => {
      if (defaultRolesRef.current && customRolesRef.current) {
        const defaultHeight = defaultRolesRef.current.offsetHeight;
        const customHeight = customRolesRef.current.offsetHeight;
        const totalHeight = defaultHeight + customHeight + 16;
        setMemberListHeight(`${totalHeight}px`);
      }
    };
    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [sortedDefaultRoles.length, processedCustomRoles.length, customRolesPage]);

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
      <PageHeader>
        <PageTitle>Danh sách vai trò</PageTitle>
        <Breadcrumb>
          Dashboard <span>/</span> Vai trò
        </Breadcrumb>
      </PageHeader>

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
            <Button
              $variant="secondary"
              onClick={() => setShowFilterDropdown((s) => !s)}
            >
              <FaFilter />
              {CUSTOM_ROLE_FILTER_OPTIONS.find(
                (item) => item.value === customRoleFilter
              )?.label ?? "Lọc custom role"}
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
          <SidebarSection ref={defaultRolesRef}>
            <SidebarHeader>
              Default Roles
              <CountBadge>{sortedDefaultRoles.length}</CountBadge>
            </SidebarHeader>
            <RoleList>
              {sortedDefaultRoles.map((role) => (
                <RoleItem
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  $active={role.id === selectedRoleId}
                  title={`${role.name} — ${role.members} thành viên`}
                >
                  <RoleLeftStripe style={{ backgroundColor: role.color }} />
                  <RoleLabel>
                    <RoleName>{role.name}</RoleName>
                    <RoleMeta>{role.members} thành viên</RoleMeta>
                  </RoleLabel>
                </RoleItem>
              ))}
            </RoleList>
          </SidebarSection>

          {/* --- CUSTOM ROLES --- */}
          <SidebarSection ref={customRolesRef}>
            <SidebarHeader>
              Custom Roles
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <CountBadge>{customRolesFiltered.length}</CountBadge>
                <AddRoleButton onClick={handleOpenCreateModal}>
                  <FaPlus />
                </AddRoleButton>
              </div>
            </SidebarHeader>
            <RoleList>
              {customRolesFiltered.length === 0 ? (
                <EmptyState>Chưa có vai trò tùy chỉnh</EmptyState>
              ) : (
                <>
                  {paginatedCustomRoles.map((role) => (
                    <RoleItem
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      $active={role.id === selectedRoleId}
                      title={`${role.name} — ${role.members} thành viên`}
                    >
                      <RoleLeftStripe style={{ backgroundColor: role.color }} />
                      <RoleLabel>
                        <RoleName>{role.name}</RoleName>
                        <RoleMeta>{role.members} thành viên</RoleMeta>
                      </RoleLabel>
                    </RoleItem>
                  ))}
                  {/* Pagination Controls cho Custom Roles */}
                  {totalCustomPages > 1 && (
                    <PaginationControls>
                      <PaginationButton
                        onClick={() =>
                          setCustomRolesPage((p) => Math.max(0, p - 1))
                        }
                        disabled={customRolesPage === 0}
                      >
                        ← Trước
                      </PaginationButton>
                      <PageInfo>
                        Trang {customRolesPage + 1}/{totalCustomPages}
                      </PageInfo>
                      <PaginationButton
                        onClick={() =>
                          setCustomRolesPage((p) =>
                            Math.min(totalCustomPages - 1, p + 1)
                          )
                        }
                        disabled={customRolesPage >= totalCustomPages - 1}
                      >
                        Tiếp →
                      </PaginationButton>
                    </PaginationControls>
                  )}
                </>
              )}
            </RoleList>
          </SidebarSection>
        </Sidebar>

        {/* --- CONTENT (Bên phải) - ĐÃ SỬA LẠI ĐẦY ĐỦ --- */}
        <Content ref={memberListRef} style={{ maxHeight: memberListHeight }}>
          {selectedRoleData ? (
            <>
              <ContentHeader>
                <div>
                  <h2
                    style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}
                  >
                    {selectedRoleData.name}
                  </h2>
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
                    <Button
                      $variant="secondary"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
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
                    {members.length === 0 && (
                      <EmptyState>Không có thành viên</EmptyState>
                    )}
                    {paginatedMembers.map((m) => (
                      <MemberRow key={m.id}>
                        <Avatar>
                          {m.fullName.split(" ").pop()?.charAt(0) ??
                            m.fullName.charAt(0)}
                        </Avatar>
                        <div>
                          <div style={{ fontWeight: 600 }}>{m.fullName}</div>
                          {m.email && (
                            <div style={{ color: "#6b7280", fontSize: 13 }}>
                              {m.email}
                            </div>
                          )}
                        </div>
                      </MemberRow>
                    ))}
                  </MemberList>
                )}

                {/* (Member Pagination giữ nguyên) */}
                {totalMemberPages > 1 && (
                  <PaginationControls>
                    {/* ... (Các nút Pagination) ... */}
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
            <ModalHeader>
              Chỉnh sửa quyền hạn - {selectedRoleData?.name}
            </ModalHeader>
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
                <PermissionsColumn style={{ flex: 1 }}>
                  {groupPermissionsByCategory(allPermissions).map(
                    (category) => (
                      <PermissionGroup key={category.name}>
                        <GroupTitle>{category.name}</GroupTitle>
                        {category.permissions.map((item) => {
                          const isReadOnly =
                            item.action.toLowerCase() === "readonly";
                         return (
                            <PermissionRow key={item.id}>
                              <div>
                                {item.name} ({item.action})
                              </div>
                              <ToggleSwitch>
                                <input
                                  type="checkbox"
                                  checked={modalPermissions.has(item.id)}
                                  onChange={() =>
                                    handleModalPermissionToggle(item.id)
                                  }
                                  disabled={isReadOnly}
                                />
                                <span />
                              </ToggleSwitch>
                            </PermissionRow>
                          );
                        })}
                      </PermissionGroup>
                    )
                  )}
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
      {showDeleteConfirm &&
        selectedRoleData &&
        canDeleteRole(selectedRoleData) && (
          <ModalOverlay onClick={() => setShowDeleteConfirm(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>Xác nhận xóa</ModalHeader>
              <ModalBody>
                <div style={{ marginBottom: 12 }}>
                  Bạn có chắc muốn xóa vai trò "{selectedRoleData?.name}"?
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <Button
                    $variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
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
                <ColorInput
                  type="color"
                  value={roleColorInput}
                  onChange={(e) => setRoleColorInput(e.target.value)}
                />
              </FormGroup>

              {/* (Sửa: Hiển thị Permissions thật) */}
              <FormGroup>
                <Label>Quyền hạn</Label>
                <PermissionsColumn>
                  {groupPermissionsByCategory(allPermissions).map(
                    (category) => (
                      <PermissionGroup key={category.name}>
                        <GroupTitle>{category.name}</GroupTitle>
                        {category.permissions.map((item) => {
                          const isReadOnly =
                            item.action.toLowerCase() === "readonly";
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
                                        if (newSet.has(item.id))
                                          newSet.delete(item.id);
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
                    )
                  )}
                </PermissionsColumn>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                $variant="secondary"
                onClick={() => setShowCreateModal(false)}
              >
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

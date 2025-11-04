import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaPlus, FaTrash, FaFilter, FaDownload, FaEye } from "react-icons/fa";
import "../../components/admin/account-manage.css";
import AccountDetailModal, {
  type AccountDetailData,
  type UserStatus,
} from "../../components/admin/AccountDetailModal";
import { apiClient } from "../../api/apiClient";

/* ---------- Types ---------- */
type Role = "User" | "Read-only" | "ADMIN" | "MANAGER";
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
}

/* ---------- Helpers / UI ---------- */
const formatDate = (iso?: string) =>
  iso ? new Intl.DateTimeFormat("vi-VN").format(new Date(iso)) : "—";

const tone = {
  primary: { bg: "#eef2ff", fg: "#4f46e5" },
  info: { bg: "#e6f4ff", fg: "#0284c7" },
  success: { bg: "#eaf7ee", fg: "#16a34a" },
  warning: { bg: "#fff7ed", fg: "#d97706" },
  danger: { bg: "#ffeaea", fg: "#dc2626" },
  secondary: { bg: "#f1f5f9", fg: "#475569" },
};

const roleTone = (role: Role) =>
  (
    {
      ADMIN: tone.primary,
      MANAGER: tone.info,
      Manager: tone.info,
      USER: tone.success,
      User: tone.success,
      Service: tone.warning,
      "Read-only": tone.secondary,
    } as Record<string, typeof tone.secondary>
  )[role] ?? tone.secondary;

const statusText = (s: Status) =>
(
  {
    active: "Hoạt động",
    pending: "Chờ duyệt",
    inactive: "Ngưng",
    suspended: "Tạm ngưng",
  }[s] ?? "—"
);

const statusTone = (s: Status) =>
(
  {
    active: tone.success,
    pending: tone.warning,
    inactive: tone.secondary,
    suspended: tone.danger,
  }[s] ?? tone.secondary
);

const Badge = ({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: { bg: string; fg: string };
}) => (
  <span className="badge-pill" style={{ backgroundColor: colors.bg, color: colors.fg }}>
    {children}
  </span>
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
  const pageSize = 8;

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<AccountDetailData | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    fullName: string;
    roleId: number | null;
    phone: string;
    gender: string; // (Dùng string cho <select>)
    dob: string;            // (Dùng string cho <input type="date">)
  }>({
    fullName: '',
    roleId: null,
    phone: '',
    gender: '', // (Khởi tạo là string rỗng)
    dob: '',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    roleId: '',
    phone: '',
    gender: '',
    dob: '',
  });
  const [allRoles, setAllRoles] = useState<{ id: number; name: string }[]>([]);

  /* ---------- Helpers ---------- */
  const adaptUser = (dto: UserDtoFromApi): User => {
    let status: Status;
    if (dto.isActive) {
      status = "active";
    } else {
      status = "inactive";
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
      const rolesData = roleResponse.data.map((r: any) => ({ id: r.id, name: r.name }));
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

  /* ---------- Filtering ---------- */
  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filtered = useMemo(() => {
    const kw = normalize(query);
    if (!kw) return rows;
    return rows.filter((u) => normalize(`${u.name} ${u.email} ${u.role}`).includes(kw));
  }, [rows, query]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* ---------- Detail ---------- */
  function openDetail(u: User) {
    setSelectedId(u.id);
    const statusMap: Record<Status, UserStatus> = {
      active: "active",
      pending: "pending",
      inactive: "suspended",
      suspended: "suspended",
    };
    setDetailUser({
      fullName: u.name,
      email: u.email,
      role: u.role,
      status: statusMap[u.status],
      phone: u.phone,
      dob: u.dob,
      gender: u.gender,

      rhFactor: "Không rõ",
      bloodType: "—",
      medicalHistory: "—"
    });
    setDetailOpen(true);
  }

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
    } catch (err: any) {
      console.error("Lỗi khi xóa user:", err);
      alert("Lỗi khi xóa: " + (err.response?.data?.message || err.message));
      closeDeleteConfirm();
    }
  };

  /* ---------- Status Change ---------- */
  const handleStatusChange = async (id: string, next: UserStatus) => {
    const oldRows = [...rows];
    const nextStatus: Status = next === "active" ? "active" : "inactive";
    setRows((prev) => prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)));

    const isLocking = next === "suspended";
    const apiPath = `/api/users/${id}/${isLocking ? "lock" : "unlock"}`;

    try {
      await apiClient.post(apiPath);
      setDetailOpen(false);
    } catch (err: any) {
      console.error("Lỗi khi cập nhật trạng thái user:", err);
      alert("Lỗi: " + (err.response?.data?.message || err.message));
      setRows(oldRows);
    }
  };

  /* ---------- Edit ---------- */

  const openEditModal = () => {
    const currentUser = rows.find(u => u.id === selectedId);
    if (!currentUser) return;

    const currentRole = allRoles.find(r => r.name === currentUser.role);

    // --- TẢI DỮ LIỆU THẬT VÀO FORM ---
    setEditFormData({
      fullName: currentUser.name,
      roleId: currentRole ? currentRole.id : null,
      phone: currentUser.phone || '',
      // (Xử lý 'gender' (boolean) sang 'string' cho <select>)
      gender: currentUser.gender === true ? 'true' : currentUser.gender === false ? 'false' : '',
      // (Xử lý 'dob' (ISO string) sang 'YYYY-MM-DD' cho <input type="date">)
      dob: currentUser.dob ? currentUser.dob.split('T')[0] : '',
    });

    setDetailOpen(false);
    setShowEditModal(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async () => {
    if (!selectedId) return;

    try {
      // 1. Chuẩn bị DTO (UserUpdateRequest)
      const updateRequest = {
        fullName: editFormData.fullName,
        roleId: editFormData.roleId ? Number(editFormData.roleId) : null,
        phone: editFormData.phone || null,
        // (Chuyển 'string' ("true"/"false") về 'boolean')
        gender: editFormData.gender === 'true' ? true : editFormData.gender === 'false' ? false : null,
        // (Chuyển 'string' (date) về 'Date' (hoặc null))
        dob: editFormData.dob ? new Date(editFormData.dob) : null,
      };

      // 2. GỌI API PUT
      await apiClient.put(`/api/users/${selectedId}`, updateRequest);

      // 3. Xong! Đóng modal và TẢI LẠI DỮ LIỆU (FIX LỖI)
      setShowEditModal(false);
      await fetchData(); // <-- THÊM DÒNG NÀY (FIX LỖI KHÔNG TỰ LÀM MỚI)

    } catch (err: any) {
      console.error("Lỗi khi cập nhật user:", err);
      alert("Lỗi khi cập nhật: " + (err.response?.data?.message || err.message));
    }
  };

  const openCreateModal = () => {
    setCreateFormData({
      fullName: '',
      email: '',
      password: '',
      roleId: '',
      phone: '',
      gender: '',
      dob: '',
    });
    setShowCreateModal(true);
  };

  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCreateUser = async () => {
    try {
      const createRequest = {
        fullName: createFormData.fullName,
        email: createFormData.email,
        password: createFormData.password,
        roleId: Number(createFormData.roleId),

        phone: createFormData.phone || null,
        gender: createFormData.gender === 'true' ? true : createFormData.gender === 'false' ? false : null,
        dob: createFormData.dob ? new Date(createFormData.dob) : null,
      };

      const response = await apiClient.post('/api/users', createRequest);

      const newUserDto = response.data;

      setShowCreateModal(false);
      const newUserForUI = adaptUser(newUserDto);
      setRows(prevRows => [newUserForUI, ...prevRows]);

    } catch (err: any) {
      console.error("Lỗi khi tạo user:", err);
      alert("Lỗi khi tạo: " + (err.response?.data?.message || err.message));
    }
  };
  /* ---------- Loading / Error ---------- */
  if (loading) {
    return (
      <div className="am-page">
        <div className="am-toolbar">
          <div className="am-title">
            <h1 className="title">Đang tải danh sách tài khoản...</h1>
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

  /* ---------- Render ---------- */
  return (
    <div className="am-page">
      {/* Toolbar */}
      <div className="am-toolbar">
        <div className="am-title">
          <h1 className="title">Danh sách tài khoản</h1>
          <div className="muted">
            Đang hiển thị {paged.length}/{total} người dùng
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
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                  e.preventDefault();
                  searchRef.current?.focus();
                }
              }}
            />
          </div>
          <div className="am-actions">
            <button className="btn outline">
              <FaFilter /> &nbsp;Lọc
            </button>
            <button className="btn primary" onClick={openCreateModal}>
              <FaPlus /> &nbsp;Thêm người dùng
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="am-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>STT</th>
              <th>Người dùng</th>
              <th style={{ width: 180 }}>Vai trò</th>
              <th style={{ width: 160 }}>Trạng thái</th>
              <th style={{ width: 150 }}>Ngày tham gia</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((u, idx) => (
              <tr key={u.id}>
                <td>{(page - 1) * pageSize + idx + 1}</td>
                <td>
                  <div className="am-user-cell">
                    <div className="am-avatar">
                      {u.name.split(" ").slice(-1)[0]?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div>
                      <div className="am-user-name">{u.name}</div>
                      <div className="am-user-email">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge colors={roleTone(u.role)}>{u.role}</Badge>
                </td>
                <td>
                  <Badge colors={statusTone(u.status)}>{statusText(u.status)}</Badge>
                </td>
                <td>{formatDate(u.joinedAt)}</td>
                <td>
                  <div className="am-actions-inline">
                    <button className="icon-btn" title="Xem chi tiết" onClick={() => openDetail(u)}>
                      <FaEye />
                    </button>
                    <button
                      className="icon-btn danger"
                      title="Xoá"
                      onClick={() => handleDelete(u.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!paged.length && (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: "center" }}>
                  Không tìm thấy kết quả cho <strong>{query}</strong>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="am-pagination">
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

      {/* Detail Modal */}
      <AccountDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        user={detailUser}
        userId={selectedId}
        onStatusChange={handleStatusChange}
        onEdit={openEditModal}
      />

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="am-modal-overlay">
          <div className="am-modal am-confirm">
            <div className="am-modal__header">
              <h2 className="title">Xác nhận xoá</h2>
            </div>
            <div className="am-modal__body">
              <p className="am-confirm-text">
                Bạn có chắc muốn xoá người dùng <strong>{deleteTarget.name}</strong>?
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="am-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="am-modal am-confirm" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="am-modal__header">
              <h2 className="title">Chỉnh sửa tài khoản</h2>
            </div>
            <div className="am-modal__body">

              <div className="am-form-group">
                <label>Họ và Tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={editFormData.fullName}
                  onChange={handleEditFormChange}
                  className="am-form-input"
                />
              </div>

              <div className="am-form-group">
                <label>Vai trò (Role)</label>
                <select
                  name="roleId"
                  value={editFormData.roleId || ''}
                  onChange={handleEditFormChange}
                  className="am-form-input"
                >
                  <option value="">[Chưa chọn]</option>
                  {allRoles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="am-form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditFormChange}
                  className="am-form-input"
                />
              </div>

              {/* --- THÊM 2 TRƯỜNG MỚI VÀO FORM --- */}
              <div className="am-form-group">
                <label>Giới tính</label>
                <select
                  name="gender"
                  value={editFormData.gender}
                  onChange={handleEditFormChange}
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
                  value={editFormData.dob}
                  onChange={handleEditFormChange}
                  className="am-form-input"
                />
              </div>
              {/* --- HẾT PHẦN THÊM --- */}

            </div>
            <div className="am-modal__footer">
              <button className="btn outline" onClick={() => setShowEditModal(false)}>Huỷ</button>
              <button className="btn primary" onClick={handleUpdateUser}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
      {showCreateModal && (
        <div className="am-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="am-modal am-confirm" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}> {/* (Tăng chiều rộng modal) */}
            <div className="am-modal__header">
              <h2 className="title">Thêm người dùng mới</h2>
            </div>
            <div className="am-modal__body">

              {/* 1. BỌC CÁC TRƯỜNG BẰNG "am-form-grid" */}
              <div className="am-form-grid">

                {/* --- CỘT BÊN TRÁI --- */}
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

                {/* --- CỘT BÊN PHẢI --- */}
                <div className="am-form-group">
                  <label>Vai trò (Role) (*)</label>
                  <select
                    name="roleId"
                    value={createFormData.roleId}
                    onChange={handleCreateFormChange}
                    className="am-form-input"
                    required
                  >
                    <option value="">[Chọn một vai trò]</option>
                    {allRoles.map(role => (
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
              {/* --- HẾT PHẦN BỌC --- */}

            </div>
            <div className="am-modal__footer">
              <button className="btn outline" onClick={() => setShowCreateModal(false)}>Huỷ</button>
              <button className="btn primary" onClick={handleCreateUser}>Tạo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


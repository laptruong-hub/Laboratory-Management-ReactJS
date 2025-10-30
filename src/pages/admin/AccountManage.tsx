import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaPlus, FaTrash, FaFilter, FaDownload, FaEye } from "react-icons/fa";
import "../../components/admin/account-manage.css";
import AccountDetailModal, {
  type AccountDetailData,
  type UserStatus,
} from "../../components/admin/AccountDetailModal";

/* ---------- Types ---------- */
type Role =
  | "Administrator"
  | "Lab Manager"
  | "Laboratory Manager"
  | "Lab User"
  | "Service"
  | "User";
type Status = "active" | "pending" | "inactive" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joinedAt?: string;
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
  ({
    Administrator: tone.primary,
    "Lab Manager": tone.info,
    "Laboratory Manager": tone.info,
    "Lab User": tone.success,
    Service: tone.warning,
    User: tone.secondary,
  } as Record<string, typeof tone.secondary>)[role] ?? tone.secondary;
const statusText = (s: Status) =>
  ({ active: "Hoạt động", pending: "Chờ duyệt", inactive: "Ngưng", suspended: "Tạm ngưng" }[s] ??
    "—");
const statusTone = (s: Status) =>
  ({ active: tone.success, pending: tone.warning, inactive: tone.secondary, suspended: tone.danger }[
    s
  ] ?? tone.secondary);

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

/* ---------- Demo data ---------- */
const DEMO: User[] = [
  {
    id: "U001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@lab.com",
    role: "Administrator",
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: "U002",
    name: "Trần Thị B",
    email: "tranthib@lab.com",
    role: "Lab Manager",
    status: "active",
    joinedAt: "2024-02-20",
  },
  {
    id: "U003",
    name: "Lê Văn C",
    email: "levanc@lab.com",
    role: "Lab User",
    status: "active",
    joinedAt: "2024-03-10",
  },
  {
    id: "U004",
    name: "Phạm Thị D",
    email: "phamd@lab.com",
    role: "Service",
    status: "suspended",
    joinedAt: "2024-01-25",
  },
  {
    id: "U005",
    name: "Hoàng Văn E",
    email: "hoange@lab.com",
    role: "User",
    status: "pending",
    joinedAt: "2024-04-05",
  },
];

/* ---------- Component ---------- */
export default function AccountManage() {
  // nguồn dữ liệu bảng
  const [rows, setRows] = useState<User[]>(DEMO);

  // tìm kiếm: gõ (search) và Enter để áp dụng (query)
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // modal chi tiết
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<AccountDetailData | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // modal xác nhận xoá
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const confirmRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const d = confirmRef.current;
    if (!d) return;
    if (confirmOpen && !d.open) d.showModal();
    if (!confirmOpen && d.open) d.close();
  }, [confirmOpen]);

  // normalize VN text
  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // filter áp dụng khi nhấn Enter
  const filtered = useMemo(() => {
    const kw = normalize(query);
    if (!kw) return rows;
    return rows.filter((u) => normalize(`${u.name} ${u.email} ${u.role}`).includes(kw));
  }, [rows, query]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

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
      rhFactor: "unknown",
    });
    setDetailOpen(true);
  }

  // nhận status từ modal chi tiết → cập nhật vào bảng
  function handleStatusChange(id: string, next: UserStatus) {
    setRows((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status:
                next === "active" ? "active" : next === "pending" ? "pending" : "suspended",
            }
          : u
      )
    );
  }

  // mở pop-up xác nhận xoá
  function handleDelete(id: string) {
    const u = rows.find((r) => r.id === id);
    if (!u) return;
    setDeleteTarget({ id: u.id, name: u.name });
    setConfirmOpen(true);
  }
  function closeDeleteConfirm() {
    setConfirmOpen(false);
    setDeleteTarget(null);
  }
  function confirmDelete() {
    if (!deleteTarget) return;
    // TODO: gọi API xoá thật tại đây
    setRows((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    closeDeleteConfirm();
  }

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
            <button className="btn primary">
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
                    <button
                      className="icon-btn"
                      title="Xem chi tiết"
                      onClick={() => openDetail(u)}
                    >
                      <FaEye />
                    </button>
                    <button className="icon-btn danger"  title="Xoá"  onClick={() => handleDelete(u.id)}>
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
      />

      {/* Confirm Delete Modal */}
<dialog
  ref={confirmRef}
  className="am-modal am-confirm"
  onCancel={(e) => {
    e.preventDefault();
    closeDeleteConfirm();
  }}
>
  <div className="am-modal__header">
    <h2 className="title">Xác nhận xoá</h2>
  </div>

  {/* BODY — luôn hiển thị câu hỏi */}
  <div className="am-modal__body">
   <p className="am-confirm-text">
  Bạn có chắc muốn xoá{deleteTarget && <> người dùng <strong>{deleteTarget.name}</strong></>}?
</p>
  </div>

  <div className="am-modal__footer">
    <button className="btn outline" onClick={closeDeleteConfirm}>Huỷ</button>
    <button className="btn danger" onClick={confirmDelete}>Xoá</button>
  </div>
</dialog>
    </div>
  );
}

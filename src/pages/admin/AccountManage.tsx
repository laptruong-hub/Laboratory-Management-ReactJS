// pages/admin/AccountManage.tsx
import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaDownload,
  FaEye,
} from "react-icons/fa";

// style + modal
import "../../components/admin/account-manage.css";
import AccountDetailModal, { type AccountDetailData } from "../../components/admin/AccountDetailModal";

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
  joinedAt?: string; // ISO
}

/* ---------- Helpers ---------- */
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
  <span
    className="badge-pill"
    style={{ backgroundColor: colors.bg, color: colors.fg }}
  >
    {children}
  </span>
);

/* ---------- Demo data (replace with API) ---------- */
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
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Modal state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<AccountDetailData | undefined>(undefined);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return DEMO;
    return DEMO.filter(
      (u) =>
        u.name.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword) ||
        u.role.toLowerCase().includes(keyword)
    );
  }, [q]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function openDetail(u: User) {
    // map sang dữ liệu cho modal
    const statusMap: Record<Status, "active" | "pending" | "suspended"> = {
      active: "active",
      pending: "pending",
      inactive: "suspended",
      suspended: "suspended",
    };
    const data: AccountDetailData = {
      fullName: u.name,
      email: u.email,
      role: u.role,
      status: statusMap[u.status],
      dob: undefined,
      gender: undefined,
      bloodGroup: undefined,
      rhFactor: "unknown",
      phone: undefined,
      medicalHistory: undefined,
    };
    setDetailUser(data);
    setDetailOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Xóa tài khoản này?")) {
      console.log("Delete", id);
    }
  }

  return (
    <div className="am-page">
      {/* Toolbar (title + search + actions) */}
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
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên, email hoặc vai trò…"
            />
          </div>

          <div className="am-actions">
            <button className="btn outline">
              <FaFilter />
              &nbsp;Lọc
            </button>
            <button className="btn outline">
              <FaDownload />
              &nbsp;Xuất Excel
            </button>
            <button className="btn primary">
              <FaPlus />
              &nbsp;Thêm người dùng
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
              <th style={{ width: 140 }}>Thao tác</th>
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
                    <button
                      className="icon-btn"
                      title="Chỉnh sửa"
                      onClick={() => openDetail(u)} // cũng mở modal
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn danger"
                      title="Xóa"
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
                <td colSpan={6} style={{ padding: 16 }}>
                  Không có dữ liệu.
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
      />
    </div>
  );
}

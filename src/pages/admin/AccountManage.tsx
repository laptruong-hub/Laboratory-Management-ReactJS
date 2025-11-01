import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import "../../components/admin/account-manage.css";

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
  phone?: string;
  medicalHistory?: string;
  rhFactor?: string;
  bloodGroup?: string;
  note?: string;
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
  ((
    {
      Administrator: tone.primary,
      "Lab Manager": tone.info,
      "Laboratory Manager": tone.info,
      "Lab User": tone.success,
      Service: tone.warning,
      User: tone.secondary,
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
    name: "Nguyễn Văn A",
    email: "nguyenvana@lab.com",
    role: "Administrator",
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: "U003",
    name: "Nguyễn Văn A",
    email: "nguyenvana@lab.com",
    role: "Administrator",
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: "U004",
    name: "Nguyễn Văn A",
    email: "nguyenvana@lab.com",
    role: "Administrator",
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: "U005",
    name: "Nguyễn Văn A",
    email: "nguyenvana@lab.com",
    role: "Administrator",
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: "U006",
    name: "Nguyễn Văn A",
    email: "nguyenvana@lab.com",
    role: "Administrator",
    status: "active",
    joinedAt: "2024-01-15",
  },

  {
    id: "U007",
    name: "Trần Thị B",
    email: "tranthib@lab.com",
    role: "Lab Manager",
    status: "active",
    joinedAt: "2024-02-20",
  },
  {
    id: "U008",
    name: "Lê Văn C",
    email: "levanc@lab.com",
    role: "Lab User",
    status: "active",
    joinedAt: "2024-03-10",
  },
  {
    id: "U009",
    name: "Phạm Thị D",
    email: "phamd@lab.com",
    role: "Service",
    status: "suspended",
    joinedAt: "2024-01-25",
  },
  {
    id: "U010",
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
  const pageSize = 4;

  // filter dropdown state
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [filterRole, setFilterRole] = useState<Role | "all">("all");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [filterJoinedFrom, setFilterJoinedFrom] = useState<string>("");
  const [filterJoinedTo, setFilterJoinedTo] = useState<string>("");

  // modal chi tiết
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // inline edit state (edit fields appear in right detail panel)
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [editPhone, setEditPhone] = useState<string>("");
  const [editMedicalHistory, setEditMedicalHistory] = useState<string>("");
  const [editRhFactor, setEditRhFactor] = useState<string>("");
  const [editBloodGroup, setEditBloodGroup] = useState<string>("");
  const [editStatus, setEditStatus] = useState<Status>("active");
  // note textarea for the selected user (replaces the role/status badges under name/email)
  const [editNote, setEditNote] = useState<string>("");
  const [noteSaving, setNoteSaving] = useState<boolean>(false);

  // modal xác nhận xoá
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const confirmRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const d = confirmRef.current;
    if (!d) return;
    if (confirmOpen && !d.open) d.showModal();
    if (!confirmOpen && d.open) d.close();
  }, [confirmOpen]);

  // Add-user modal state and form
  const [addOpen, setAddOpen] = useState(false);
  const addRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const d = addRef.current;
    if (!d) return;
    if (addOpen && !d.open) d.showModal();
    if (!addOpen && d.open) d.close();
  }, [addOpen]);

  const [newName, setNewName] = useState("");
  const [newDob, setNewDob] = useState("");
  const [newGender, setNewGender] = useState<"male" | "female" | "other" | "">(
    ""
  );
  const [newBloodGroup, setNewBloodGroup] = useState<string>("");
  const [newRhFactor, setNewRhFactor] = useState<string>("");
  const [newRole, setNewRole] = useState<Role>("User");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStatus, setNewStatus] = useState<Status>("pending");

  function resetAddForm() {
    setNewName("");
    setNewDob("");
    setNewGender("");
    setNewBloodGroup("");
    setNewRhFactor("");
    setNewRole("User");
    setNewEmail("");
    setNewPhone("");
    setNewStatus("pending");
  }

  function closeAdd() {
    setAddOpen(false);
    // small timeout to allow dialog to close animation, then reset
    setTimeout(() => resetAddForm(), 200);
  }

  function createUser() {
    // basic required validation: name, dob, gender, email, phone
    if (
      !newName.trim() ||
      !newDob ||
      !newGender ||
      !newEmail.trim() ||
      !newPhone.trim()
    ) {
      return;
    }

    // generate next numeric id based on existing rows (U001 style)
    const nums = rows.map((r) => {
      const m = (r.id || "").match(/\d+/);
      return m ? parseInt(m[0], 10) : 0;
    });
    const max = nums.length ? Math.max(...nums) : 0;
    const nextId = "U" + String(max + 1).padStart(3, "0");

    const user: User = {
      id: nextId,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      status: newStatus,
      joinedAt: newDob,
      phone: newPhone.trim(),
      bloodGroup: newBloodGroup || undefined,
      rhFactor: newRhFactor || undefined,
    };

    setRows((prev) => [user, ...prev]);
    closeAdd();
    // select the newly created user
    setSelectedId(nextId);
  }

  // close filter dropdown on outside click or Esc
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!filterRef.current) return;
      if (filterRef.current.contains(e.target as Node)) return;
      setShowFilter(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowFilter(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // normalize VN text
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // filter áp dụng khi nhấn Enter + dropdown filters
  const filtered = useMemo(() => {
    const kw = normalize(query);

    // start from all rows
    let list = rows.slice();

    // apply keyword search when provided
    if (kw) {
      list = list.filter((u) =>
        normalize(`${u.name} ${u.email} ${u.role}`).includes(kw)
      );
    }

    // role filter
    if (filterRole !== "all") {
      list = list.filter((u) => u.role === filterRole);
    }

    // status filter
    if (filterStatus !== "all") {
      list = list.filter((u) => u.status === filterStatus);
    }

    // joined date filter (inclusive)
    if (filterJoinedFrom) {
      const from = new Date(filterJoinedFrom);
      list = list.filter((u) =>
        u.joinedAt ? new Date(u.joinedAt) >= from : false
      );
    }
    if (filterJoinedTo) {
      const to = new Date(filterJoinedTo);
      list = list.filter((u) =>
        u.joinedAt ? new Date(u.joinedAt) <= to : false
      );
    }

    return list;
  }, [rows, query, filterRole, filterStatus, filterJoinedFrom, filterJoinedTo]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  // const pageUsers = filtered.slice(startIndex, startIndex + pageSize);
  // const visibleCount = pageUsers.length;
 
  // build exactly pageSize slots referencing the filtered array (may be null)
  const paged: (User | null)[] = Array.from(
    { length: pageSize },
    (_, i) => filtered[startIndex + i] ?? null
  );

  // (no-op) selecting a row sets selectedId directly in the list click handler

  // Inline edit helpers
  function startEditing(u: User) {
    setEditingId(u.id);
    setEditPhone(u.phone ?? "");
    setEditMedicalHistory(u.medicalHistory ?? "");
    setEditRhFactor(u.rhFactor ?? "");
    setEditBloodGroup(u.bloodGroup ?? "");
    setEditStatus(u.status);
  }
  function cancelEditing() {
    setEditingId(undefined);
  }
  function confirmEditing() {
    if (!editingId) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === editingId
          ? {
              ...r,
              phone: editPhone || undefined,
              medicalHistory: editMedicalHistory || undefined,
              rhFactor: editRhFactor || undefined,
              bloodGroup: editBloodGroup || undefined,
              status: editStatus,
            }
          : r
      )
    );
    setEditingId(undefined);
  }

  // initialize editNote when selection changes
  useEffect(() => {
    if (!selectedId) {
      setEditNote("");
      return;
    }
    const u = rows.find((r) => r.id === selectedId);
    setEditNote(u?.note ?? "");
  }, [selectedId, rows]);

  // update note for a user in local rows state
  function updateNote(id: string) {
    setNoteSaving(true);
    // currently local-only; replace with API call if needed
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, note: editNote || undefined } : r))
    );
    // simulate instant save
    setTimeout(() => setNoteSaving(false), 200);
  }

  // account:update custom-event handling removed (modal deleted)

  // status updates are handled inline via confirmEditing()

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
    <div
      className="am-page"
      style={{ padding: 16, minHeight: "calc(100vh - 120px)" }}
    >
      <div className="am-toolbar" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 className="title">Quản lý tài khoản</h1>
          <div className="muted">
            Đang hiển thị {paged.length}/{total} người dùng
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="am-search-input" style={{ minWidth: 320 }}>
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
          <div ref={filterRef} style={{ position: "relative" }}>
            <button
              className="btn outline"
              onClick={() => setShowFilter((s) => !s)}
              aria-expanded={showFilter}
            >
              <FaFilter />
              &nbsp;Lọc
            </button>
            {showFilter && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  zIndex: 60,
                  minWidth: 320,
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        marginBottom: 6,
                      }}
                    >
                      Vai trò
                    </div>
                    <select
                      value={filterRole}
                      onChange={(e) =>
                        setFilterRole(e.target.value as Role | "all")
                      }
                      style={{
                        width: "100%",
                        padding: 8,
                        borderRadius: 6,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <option value="all">Tất cả vai trò</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Lab Manager">Lab Manager</option>
                      <option value="Laboratory Manager">
                        Laboratory Manager
                      </option>
                      <option value="Lab User">Lab User</option>
                      <option value="Service">Service</option>
                      <option value="User">User</option>
                    </select>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        marginBottom: 6,
                      }}
                    >
                      Trạng thái
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(e.target.value as Status | "all")
                      }
                      style={{
                        width: "100%",
                        padding: 8,
                        borderRadius: 6,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <option value="all">Tất cả</option>
                      <option value="active">Hoạt động</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="inactive">Ngưng</option>
                      <option value="suspended">Tạm ngưng</option>
                    </select>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        marginBottom: 6,
                      }}
                    >
                      Ngày tham gia
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="date"
                        value={filterJoinedFrom}
                        onChange={(e) => setFilterJoinedFrom(e.target.value)}
                        style={{
                          flex: 1,
                          padding: 8,
                          borderRadius: 6,
                          border: "1px solid #e5e7eb",
                        }}
                      />
                      <input
                        type="date"
                        value={filterJoinedTo}
                        onChange={(e) => setFilterJoinedTo(e.target.value)}
                        style={{
                          flex: 1,
                          padding: 8,
                          borderRadius: 6,
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    <button
                      className="btn outline"
                      onClick={() => {
                        // clear filters
                        setFilterRole("all");
                        setFilterStatus("all");
                        setFilterJoinedFrom("");
                        setFilterJoinedTo("");
                        setShowFilter(false);
                        setPage(1);
                      }}
                    >
                      Xoá
                    </button>
                    <button
                      className="btn primary"
                      onClick={() => {
                        setShowFilter(false);
                        setPage(1);
                      }}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="btn primary" onClick={() => setAddOpen(true)}>
            <FaPlus />
            &nbsp;Thêm người dùng
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
        {/* Left: user list */}
        <aside style={{ width: 380, display: "flex", flexDirection: "column" }}>
          <div
            className="card"
            style={{
              padding: 8,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {paged.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center" }}>
                Không tìm thấy kết quả cho <strong>{query}</strong>.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {paged.map((u, idx) =>
                  u ? (
                    <div
                      key={u.id}
                      className="am-list-item"
                      style={{
                        display: "flex",
                        gap: 12,
                        padding: 10,
                        alignItems: "center",
                        borderRadius: 8,
                        cursor: "pointer",
                        background:
                          selectedId === u.id ? "#f8fafc" : "transparent",
                      }}
                      onClick={() => {
                        setSelectedId(u.id);
                      }}
                    >
                      <div
                        className="am-avatar"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#eef2f2",
                          fontWeight: 700,
                        }}
                      >
                        {u.name.split(" ").slice(-1)[0]?.[0]?.toUpperCase() ??
                          "U"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{u.name}</div>
                        <div style={{ fontSize: 13, color: "#6b7280" }}>
                          {u.email}
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <Badge colors={roleTone(u.role)}>{u.role}</Badge>
                          &nbsp;{" "}
                          <Badge colors={statusTone(u.status)}>
                            {statusText(u.status)}
                          </Badge>
                        </div>
                      </div>
                      {/* delete moved to right detail pane */}
                    </div>
                  ) : (
                    <div
                      key={`empty-${idx}`}
                      className="am-list-item am-list-item--empty"
                      style={{
                        display: "flex",
                        gap: 12,
                        padding: 10,
                        alignItems: "center",
                        borderRadius: 8,
                        background: "transparent",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    >
                      <div style={{ width: 40, height: 40 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 18 }} />
                        <div style={{ height: 14 }} />
                        <div style={{ marginTop: 6, height: 18 }} />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
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
        </aside>

        {/* Right: selected user detail */}
        <main style={{ flex: 1 }}>
          <div className="card" style={{ padding: 20, height: "100%" }}>
            {!selectedId ? (
              <div
                style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}
              >
                Chọn một người dùng để xem chi tiết
              </div>
            ) : (
              (() => {
                const u = rows.find((r) => r.id === selectedId)!;
                const isEditing = editingId === u.id;
                return (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 800 }}>
                          Chi tiết tài khoản
                        </div>
                        {/* <div style={{ color: "#6b7280", marginTop: 6 }}>
                          Dashboard / Người dùng / Chi tiết tài khoản
                        </div> */}
                      </div>
                      {/* header actions removed per request */}
                    </div>

                    <div style={{ display: "flex", gap: 24 }}>
                      <div style={{ width: 240 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 96,
                              height: 96,
                              borderRadius: 48,
                              background: "#eef2f2",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 36,
                              fontWeight: 800,
                            }}
                          >
                            {u.name
                              .split(" ")
                              .slice(-1)[0]?.[0]
                              ?.toUpperCase() ?? "U"}
                          </div>
                          <div style={{ fontWeight: 800, fontSize: 18 }}>
                            {u.name}
                          </div>
                          <div style={{ color: "#6b7280" }}>{u.email}</div>
                          <div style={{ marginTop: 8, width: "100%" }}>
                            <div className="muted" style={{ fontSize: 12 }}>
                              Ghi chú
                            </div>
                            <textarea
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              placeholder="Thêm ghi chú cho người dùng..."
                              style={{
                                width: "100%",
                                minHeight: 80,
                                padding: 8,
                                borderRadius: 6,
                                border: "1px solid #e5e7eb",
                                marginTop: 6,
                              }}
                            />
                            <div
                              style={{
                                marginTop: 8,
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                className="btn primary"
                                onClick={() => updateNote(u.id)}
                                disabled={noteSaving}
                              >
                                {noteSaving
                                  ? "Đang lưu..."
                                  : "Cập nhật ghi chú"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: 8,
                            padding: 16,
                            border: "1px solid #eef2f6",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 16,
                            }}
                          >
                            <div>
                              <div className="muted">HỌ VÀ TÊN</div>
                              <div style={{ fontWeight: 700 }}>{u.name}</div>
                            </div>
                            <div>
                              <div className="muted">NGÀY SINH</div>
                              <div>{formatDate(u.joinedAt)}</div>
                            </div>

                            <div>
                              <div className="muted">GIỚI TÍNH</div>
                              <div>—</div>
                            </div>
                            <div>
                              <div className="muted">NHÓM MÁU</div>
                              <div>
                                {isEditing ? (
                                  <select
                                    value={editBloodGroup}
                                    onChange={(e) =>
                                      setEditBloodGroup(e.target.value)
                                    }
                                    style={{
                                      width: "100%",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    <option value="">Chọn</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                  </select>
                                ) : (
                                  u.bloodGroup ?? "—"
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="muted">YẾU TỐ RH</div>
                              <div>
                                {isEditing ? (
                                  <select
                                    value={editRhFactor}
                                    onChange={(e) =>
                                      setEditRhFactor(e.target.value)
                                    }
                                    style={{
                                      width: "100%",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    <option value="">Chọn</option>
                                    <option value="+">Dương (+)</option>
                                    <option value="-">Âm (-)</option>
                                    <option value="unknown">Không rõ</option>
                                  </select>
                                ) : (
                                  u.rhFactor ?? "Không rõ"
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="muted">VAI TRÒ</div>
                              <div>
                                <Badge colors={roleTone(u.role)}>
                                  {u.role}
                                </Badge>
                              </div>
                            </div>

                            <div>
                              <div className="muted">EMAIL</div>
                              <div>{u.email}</div>
                            </div>
                            <div>
                              <div className="muted">SỐ ĐIỆN THOẠI</div>
                              <div>
                                {isEditing ? (
                                  <input
                                    value={editPhone}
                                    onChange={(e) =>
                                      setEditPhone(e.target.value)
                                    }
                                    style={{
                                      width: "100%",
                                      boxSizing: "border-box",
                                    }}
                                  />
                                ) : (
                                  u.phone ?? "—"
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="muted">TRẠNG THÁI</div>
                              <div>
                                {isEditing ? (
                                  <select
                                    value={editStatus}
                                    onChange={(e) =>
                                      setEditStatus(e.target.value as Status)
                                    }
                                    style={{
                                      width: "100%",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    <option value="active">Hoạt động</option>
                                    <option value="pending">Chờ duyệt</option>
                                    <option value="inactive">Ngưng</option>
                                    <option value="suspended">Tạm ngưng</option>
                                  </select>
                                ) : (
                                  <Badge colors={statusTone(u.status)}>
                                    {statusText(u.status)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="muted">TIỀN SỬ BỆNH</div>
                              <div>
                                {isEditing ? (
                                  <textarea
                                    value={editMedicalHistory}
                                    onChange={(e) =>
                                      setEditMedicalHistory(e.target.value)
                                    }
                                    style={{
                                      width: "100%",
                                      boxSizing: "border-box",
                                      minHeight: 80,
                                    }}
                                  />
                                ) : (
                                  u.medicalHistory ?? "—"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 16,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                      }}
                    >
                      {!isEditing ? (
                        <>
                          <button
                            className="btn primary"
                            onClick={() => startEditing(u)}
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            className="btn danger"
                            onClick={() => handleDelete(u.id)}
                          >
                            Xóa
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn outline"
                            onClick={cancelEditing}
                          >
                            Huỷ
                          </button>
                          <button
                            className="btn primary"
                            onClick={confirmEditing}
                          >
                            Xác nhận
                          </button>
                          <button
                            className="btn danger"
                            onClick={() => handleDelete(u.id)}
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </main>
      </div>

      {/* Detail modal removed — inline edit used instead */}

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
        <div className="am-modal__body">
          <p className="am-confirm-text">
            Bạn có chắc muốn xoá
            {deleteTarget && (
              <>
                {" "}
                người dùng <strong>{deleteTarget.name}</strong>
              </>
            )}
            ?
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
      </dialog>
      {/* Add User Modal */}
      <dialog
        ref={addRef}
        className="am-modal"
        onCancel={(e) => {
          e.preventDefault();
          closeAdd();
        }}
      >
        <div className="am-modal__header">
          <h2 className="title">Thêm người dùng</h2>
        </div>
        <div className="am-modal__body">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <div className="muted">Họ và tên *</div>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: 8 }}
              />
            </div>
            <div>
              <div className="muted">Ngày sinh *</div>
              <input
                type="date"
                value={newDob}
                onChange={(e) => setNewDob(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: 8 }}
              />
            </div>

            <div>
              <div className="muted">Giới tính *</div>
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value as any)}
                style={{ width: "100%", boxSizing: "border-box", padding: 8 }}
              >
                <option value="">Chọn</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <div className="muted">Nhóm máu</div>
              <select
                value={newBloodGroup}
                onChange={(e) => setNewBloodGroup(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: 8 }}
              >
                <option value="">Chọn</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>

            <div>
              <div className="muted">Yếu tố RH</div>
              <select
                value={newRhFactor}
                onChange={(e) => setNewRhFactor(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: 8 }}
              >
                <option value="">Chọn</option>
                <option value="+">Dương (+)</option>
                <option value="-">Âm (-)</option>
                <option value="unknown">Không rõ</option>
              </select>
            </div>

            <div>
              <div className="muted">Vai trò</div>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
                style={{ width: "100%", boxSizing: "border-box", padding: 8 }}
              >
                <option value="Administrator">Administrator</option>
                <option value="Lab Manager">Lab Manager</option>
                <option value="Laboratory Manager">Laboratory Manager</option>
                <option value="Lab User">Lab User</option>
                <option value="Service">Service</option>
                <option value="User">User</option>
              </select>
            </div>

            <div>
              <div className="muted">Email *</div>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: 8 }}
              />
            </div>
            <div>
              <div className="muted">Số điện thoại *</div>
              <input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: 8 }}
              />
            </div>

            <div>
              <div className="muted">Trạng thái</div>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Status)}
                style={{ width: "100%", boxSizing: "border-box", padding: 8 }}
              >
                <option value="pending">Chờ duyệt</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngưng</option>
                <option value="suspended">Tạm ngưng</option>
              </select>
            </div>
          </div>
        </div>
        <div className="am-modal__footer">
          <button className="btn outline" onClick={closeAdd}>
            Huỷ
          </button>
          <button
            className="btn primary"
            onClick={createUser}
            disabled={
              !(
                newName.trim() &&
                newDob &&
                newGender &&
                newEmail.trim() &&
                newPhone.trim()
              )
            }
          >
            Tạo người dùng
          </button>
        </div>
      </dialog>
    </div>
  );
}

import React, { useState } from "react";
import "./user-profile.css";

type Gender = "male" | "female" | "other";
type BloodGroup = "A" | "B" | "AB" | "O";
type RhFactor = "+" | "-" | "unknown";
type Status = "active" | "pending" | "suspended";
type Role =
  | "Administrator"
  | "Lab Manager"
  | "Lab User"
  | "Service"
  | "User"
  | (string & {}); // fallbacks

export interface UserProfile {
  fullName: string;
  dob?: string;             // ISO string: "2003-07-12"
  gender?: Gender;
  bloodGroup?: BloodGroup;
  rhFactor?: RhFactor;
  medicalHistory?: string;
  role: Role;
  email: string;
  phone?: string;
  status: Status;
}

const vi = {
  gender(g?: Gender) {
    if (!g) return "—";
    return { male: "Nam", female: "Nữ", other: "Khác" }[g];
  },
  status(s: Status) {
    return { active: "Hoạt động", pending: "Chờ duyệt", suspended: "Tạm ngưng" }[s];
  },
  date(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "—" : new Intl.DateTimeFormat("vi-VN").format(d);
  },
  rh(r?: RhFactor) {
    if (!r) return "—";
    if (r === "+") return "Dương (+)";
    if (r === "-") return "Âm (-)";
    return "Không rõ";
  },
};

const tone = {
  primary: { bg: "#eef2ff", fg: "#4f46e5" },
  info: { bg: "#e6f4ff", fg: "#0284c7" },
  success: { bg: "#eaf7ee", fg: "#16a34a" },
  warning: { bg: "#fff7ed", fg: "#d97706" },
  danger: { bg: "#ffeaea", fg: "#dc2626" },
  secondary: { bg: "#f1f5f9", fg: "#475569" },
};

const roleTone = (role: Role): typeof tone.secondary => {
  const toneMap: Record<string, typeof tone.secondary> = {
    Administrator: tone.primary,
    "Lab Manager": tone.info,
    "Lab User": tone.success,
    Service: tone.warning,
    User: tone.secondary,
  };
  return toneMap[role] ?? tone.secondary;
};

const statusTone = (s: Status) =>
  ({ active: tone.success, pending: tone.warning, suspended: tone.danger }[s]);

function Badge({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: { bg: string; fg: string };
}) {
  return (
    <span
      className="badge-pill"
      style={{ backgroundColor: colors.bg, color: colors.fg }}
    >
      {children}
    </span>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="field-value">{children ?? <span className="muted">—</span>}</div>
    </div>
  );
}

export default function UserProfilePage({ user }: { user?: UserProfile }) {
  // Provide a harmless fallback so the page can be mounted via a route
  const demoUser: UserProfile = {
    fullName: "Người dùng mẫu",
    dob: undefined,
    gender: undefined,
    bloodGroup: undefined,
    rhFactor: "unknown",
    medicalHistory: "Chưa có tiền sử bệnh rõ ràng.",
    role: "User",
    email: "user@example.com",
    phone: undefined,
    status: "active",
  };

  const actualUser = user ?? demoUser;

  // Local status state so UI can optimistically reflect suspend/reactivate actions.
  // In a real app replace these handlers with API calls and show loading/errors.
  const [status, setStatus] = useState<Status>(actualUser.status);

  const handleSuspendToggle = async () => {
    if (status === "suspended") {
      const ok = window.confirm("Kích hoạt lại tài khoản này?");
      if (!ok) return;
      // TODO: call API to activate account
      console.log("Reactivating account...");
      setStatus("active");
      return;
    }

    const ok = window.confirm("Bạn có chắc muốn tạm ngừng tài khoản này?");
    if (!ok) return;
    // TODO: call API to suspend account
    console.log("Suspending account...");
    setStatus("suspended");
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-head">
        <div>
          <div className="breadcrumb">Dashboard / Người dùng / Thông tin tài khoản</div>
          <h1 className="title">Thông tin tài khoản</h1>
        </div>
        {/* action buttons: change password, edit, suspend/reactivate */}
        <div className="actions">
  <button className="btn outline">Chỉnh sửa</button>
  <button
    className={"btn " + (status === "suspended" ? "primary" : "danger")}
    onClick={handleSuspendToggle}
    title={status === "suspended" ? "Kích hoạt lại tài khoản" : "Tạm ngừng tài khoản"}
  >
    {status === "suspended" ? "Kích hoạt" : "Tạm ngưng"}
  </button>
</div>
      </div>

      {/* Card */}
      <div className="card">
        <div className="grid">

          <Field label="Họ và tên">{actualUser.fullName}</Field>
          <Field label="Ngày sinh">{vi.date(actualUser.dob)}</Field>

          <Field label="Giới tính">{vi.gender(actualUser.gender)}</Field>
          <Field label="Nhóm máu">{actualUser.bloodGroup ?? "—"}</Field>
          <Field label="Yếu tố Rh">{vi.rh(actualUser.rhFactor)}</Field>

          <Field label="Vai trò">
            <Badge colors={roleTone(actualUser.role)}>{actualUser.role}</Badge>
          </Field>
          <Field label="Email">{actualUser.email}</Field>

          <Field label="Số điện thoại">{actualUser.phone ?? "—"}</Field>
          <Field label="Trạng thái">
            <Badge colors={statusTone(actualUser.status)}>{vi.status(actualUser.status)}</Badge>
          </Field>
          <Field label="Tiền sử bệnh">{actualUser.medicalHistory ?? "—"}</Field>
        </div>
      </div>
    </div>
  );
}



import React, { useEffect, useRef, useState } from "react";
import "./account-manage.css";

type Gender = "male" | "female" | "other";
type BloodGroup = "A" | "B" | "AB" | "O";
type RhFactor = "+" | "-" | "unknown";
export type UserStatus = "active" | "pending" | "suspended";
type Role = string;

export type AccountDetailData = {
  fullName: string;
  dob?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  rhFactor?: RhFactor;
  medicalHistory?: string;
  role: Role;
  email: string;
  phone?: string;
  status: UserStatus;
};

const vi = {
  gender(g?: Gender) {
    if (!g) return "—";
    return { male: "Nam", female: "Nữ", other: "Khác" }[g];
  },
  status(s: UserStatus) {
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
const roleMap: Record<string, { bg: string; fg: string }> = {
  Administrator: tone.primary,
  "Lab Manager": tone.info,
  "Laboratory Manager": tone.info,
  "Lab User": tone.success,
  Service: tone.warning,
  User: tone.secondary,
};
const roleTone = (role: Role) => roleMap[role] ?? tone.secondary;
const statusTone = (s: UserStatus) =>
  ({ active: tone.success, pending: tone.warning, suspended: tone.danger }[s]);

function Badge({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: { bg: string; fg: string };
}) {
  return (
    <span className="badge-pill" style={{ backgroundColor: colors.bg, color: colors.fg }}>
      {children}
    </span>
  );
}
function Field({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="field-value">{children ?? <span className="muted">—</span>}</div>
    </div>
  );
}

export default function AccountDetailModal({
  open,
  onClose,
  user,
  userId,
  onStatusChange,
}: {
  open: boolean;
  onClose: () => void;
  user?: AccountDetailData;
  userId?: string;
  onStatusChange?: (id: string, next: UserStatus) => void;
}) {
  const demo: AccountDetailData = {
    fullName: "Người dùng mẫu",
    role: "User",
    email: "user@example.com",
    status: "active",
    rhFactor: "unknown",
    medicalHistory: "Chưa có tiền sử bệnh rõ ràng.",
  };
  const actual = user ?? demo;

  const [status, setStatus] = useState<UserStatus>(actual.status);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();

    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    const onBackdrop = (e: MouseEvent) => {
      if (e.target === d) onClose();
    };
    d.addEventListener("cancel", onCancel);
    d.addEventListener("click", onBackdrop);
    return () => {
      d.removeEventListener("cancel", onCancel);
      d.removeEventListener("click", onBackdrop);
    };
  }, [open, onClose]);

  // nhận user mới mỗi lần mở
  useEffect(() => {
    setStatus(actual.status);
  }, [actual.status]);

  const handleSuspendToggle = () => {
    const next: UserStatus = status === "suspended" ? "active" : "suspended";
    setStatus(next);
    if (userId && onStatusChange) onStatusChange(userId, next); // ← thông báo cho parent
    // TODO: gọi API thật ở đây (optimistic update)
  };

  return (
    <dialog ref={ref} className="am-modal">
      <div className="am-modal__header">
        <div className="breadcrumb">Dashboard / Người dùng / Chi tiết tài khoản</div>
        <h2 className="title">Chi tiết tài khoản</h2>
        <div className="actions">
          <button className="btn outline" onClick={onClose}>Đóng</button>
          <button className="btn outline">Chỉnh sửa</button>
          <button
            className={"btn " + (status === "suspended" ? "primary" : "danger")}
            onClick={handleSuspendToggle}
          >
            {status === "suspended" ? "Kích hoạt" : "Tạm ngưng"}
          </button>
        </div>
      </div>

      <div className="am-modal__body">
        <div className="card" style={{ boxShadow: "none" }}>
          <div className="am-grid">
            <Field label="Họ và tên">{actual.fullName}</Field>
            <Field label="Ngày sinh">{vi.date(actual.dob)}</Field>
            <Field label="Giới tính">{vi.gender(actual.gender)}</Field>
            <Field label="Nhóm máu">{actual.bloodGroup ?? "—"}</Field>
            <Field label="Yếu tố Rh">{vi.rh(actual.rhFactor)}</Field>
            <Field label="Vai trò">
              <Badge colors={roleTone(actual.role)}>{actual.role}</Badge>
            </Field>
            <Field label="Email">{actual.email}</Field>
            <Field label="Số điện thoại">{actual.phone ?? "—"}</Field>
            <Field label="Trạng thái">
              <Badge colors={statusTone(status)}>{vi.status(status)}</Badge>
            </Field>
            <Field label="Tiền sử bệnh">{actual.medicalHistory ?? "—"}</Field>
          </div>
        </div>
      </div>
    </dialog>
  );
}

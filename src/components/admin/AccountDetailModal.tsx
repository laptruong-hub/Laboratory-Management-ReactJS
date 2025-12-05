import React, { useEffect, useRef, useState } from "react";
import "./account-manage.css";

// (Các Type (kiểu) của bạn)
type Gender = "male" | "female" | "other";
type BloodGroup = "A" | "B" | "AB" | "O";
type RhFactor = "+" | "-" | "unknown";
export type UserStatus = "active" | "pending" | "suspended";
type Role = string;

export type AccountDetailData = {
  fullName: string;
  email: string;
  role: Role;
  status: UserStatus;
  rhFactor: string;
  phone?: string;
  dob?: string;
  gender?: boolean;
  bloodType?: string;
  medicalHistory?: string;
};

// (Các hàm Helper (trợ giúp) của bạn)
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
  rh(r?: RhFactor | string) { // (Mở rộng 'string' để khớp 'rhFactor: string' trong AccountDetailData)
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
  // (Thêm các role thật từ BE nếu bạn muốn có màu riêng)
  ADMIN: tone.danger,
  MANAGER: tone.primary,
  "Read-only": tone.secondary,
};
const roleTone = (role: Role) => roleMap[role] ?? tone.secondary;
const statusTone = (s: UserStatus) =>
  ({ active: tone.success, pending: tone.warning, suspended: tone.danger }[s]);

// (Component Badge và Field của bạn)
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

// (Props của Modal)
export type AccountDetailModalProps = { // (Thêm export ở đây)
  open: boolean;
  onClose: () => void;
  user?: AccountDetailData;
  userId?: string;
  onStatusChange?: (id: string, next: UserStatus) => void;
  onEdit?: () => void;
};


// --- COMPONENT CHÍNH ---
export default function AccountDetailModal({
  open,
  onClose,
  user,
  userId,
  onStatusChange,
  onEdit
}: AccountDetailModalProps) { // (Dùng Type ở trên)

  // (Data dự phòng của bạn)
  const demo: AccountDetailData = {
    fullName: "Người dùng mẫu",
    role: "User",
    email: "user@example.com",
    status: "active",
    rhFactor: "unknown",
    medicalHistory: "Chưa có tiền sử bệnh rõ ràng.",
  };

  // 'actual' SẼ LUÔN TỒN TẠI (hoặc là 'user' thật, hoặc là 'demo')
  const actual = user ?? demo;

  // 'status' là state nội bộ của Modal (để đổi "Tạm ngưng" -> "Kích hoạt" ngay lập tức)
  const [status, setStatus] = useState<UserStatus>(actual.status);
  const ref = useRef<HTMLDialogElement>(null);

  // (useEffect để đồng bộ state "open" với <dialog>)
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

  // (useEffect để "reset" status nội bộ mỗi khi 'user' (prop) thay đổi)
  useEffect(() => {
    setStatus(actual.status);
  }, [actual.status]);

  // (Hàm xử lý khi bấm nút "Tạm ngưng" / "Kích hoạt")
  const handleSuspendToggle = () => {
    const next: UserStatus = status === "suspended" ? "active" : "suspended";
    setStatus(next); // Cập nhật state nội bộ

    // Báo cho "Cha" (AccountManage) biết để gọi API
    if (userId && onStatusChange) onStatusChange(userId, next);
  };

  return (
    <dialog ref={ref} className="am-modal">
      <div className="am-modal__header">
        <div className="breadcrumb">Dashboard / Người dùng / Chi tiết tài khoản</div>
        <h2 className="title">Chi tiết tài khoản</h2>
        <div className="actions">
          <button className="btn outline" onClick={onClose}>
            Đóng
          </button>

          {/* Sửa: Gắn 'onEdit' vào nút "Chỉnh sửa" */}
          <button className="btn outline" onClick={onEdit}>
            Chỉnh sửa
          </button>

          <button
            className={"btn " + (status === "suspended" ? "primary" : "danger")}
            onClick={handleSuspendToggle}
          >
            {status === "suspended" ? "Kích hoạt" : "Tạm ngưng"}
          </button>
        </div>
      </div>

      <div className="am-modal__body">

        {/* --- KHỐI JSX ĐÃ SỬA LẠI "CHUẨN" --- */}
        <div className="card" style={{ boxShadow: "none" }}>
          <div className="am-grid">

            {/* Luôn dùng 'actual.' để đảm bảo an toàn (không bị 'undefined') */}

            <Field label="Họ và tên">{actual.fullName}</Field>

            <Field label="Ngày sinh">{vi.date(actual.dob)}</Field>

            <Field label="Giới tính">
              {/* Logic này đã đúng */}
              {actual.gender === true ? 'Nam' : actual.gender === false ? 'Nữ' : '—'}
            </Field>

            <Field label="Nhóm máu">{actual.bloodType ?? "—"}</Field>
            <Field label="Yếu tố Rh">{vi.rh(actual.rhFactor)}</Field>

            <Field label="Vai trò">
              <Badge colors={roleTone(actual.role)}>{actual.role}</Badge>
            </Field>

            <Field label="Email">{actual.email}</Field>
            <Field label="Số điện thoại">{actual.phone ?? "—"}</Field>

            <Field label="Trạng thái">
              {/* Dùng state 'status' vì nó thay đổi động */}
              <Badge colors={statusTone(status)}>{vi.status(status)}</Badge>
            </Field>

            <Field label="Tiền sử bệnh">{actual.medicalHistory ?? "—"}</Field>
          </div>
        </div>
        {/* --- HẾT KHỐI SỬA --- */}

      </div>
    </dialog>
  );
}
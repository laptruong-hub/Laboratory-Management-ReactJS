import React from "react";
import { Mail, Phone, Hash, Calendar, ShieldCheck, Circle, Home, MapPin, Building2, LogOut, Trash2, User2, ChevronRight, Shield, Smartphone, RefreshCw, Power } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ————————————————————————————————————————————————
// Types
// ————————————————————————————————————————————————

type Gender = "male" | "female";

type FormState = {
  fullName: string;
  dob: string; // yyyy-mm-dd
  gender: Gender;
  phone: string;
  email: string;
  bloodGroup: string;
  city: string;
  district: string;
  address: string;
  employeeCode: string;
  department: string;
  title: string;
  role: string;
  bio: string;
  quick: {
    sms: boolean;
    showStatus: boolean;
    autoUpdate: boolean;
    remoteLogout: boolean;
  };
};

const initialState: FormState = {
  fullName: "Lê Việt",
  dob: "1997-02-07",
  gender: "male",
  phone: "0912345678",
  email: "teststaff@gmail.com",
  bloodGroup: "A+",
  city: "Hồ Chí Minh",
  district: "Quận 1",
  address: "",
  employeeCode: "EMP001",
  department: "Phòng Xét Nghiệm",
  title: "Kỹ thuật viên",
  role: "Lab User",
  bio: "",
  quick: {
    sms: true,
    showStatus: true,
    autoUpdate: false,
    remoteLogout: false,
  },
};

// ————————————————————————————————————————————————
// Small UI helpers
// ————————————————————————————————————————————————

function AvatarCircle({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
  return (
    <div className="size-20 rounded-full bg-rose-100 text-rose-600 grid place-items-center text-xl font-semibold">
      {initials || <User2 className="size-6" />}
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

// ————————————————————————————————————————————————
// Page Component
// ————————————————————————————————————————————————

export default function UserProfilePage() {
  const [form, setForm] = React.useState<FormState>(initialState);
  const [saving, setSaving] = React.useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateQuick(key: keyof FormState["quick"], value: boolean) {
    setForm((prev) => ({ ...prev, quick: { ...prev.quick, [key]: value } }));
  }

  async function handleSave() {
    setSaving(true);
    // simulate API
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    // You can replace alert with your toast system
    alert("Đã lưu thay đổi (mock API)\n\n" + JSON.stringify(form, null, 2));
  }

  return (
    <div className="min-h-[100svh] bg-neutral-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Home className="size-4" /> Trang chủ
            </span>
            <ChevronRight className="size-4" />
            <span className="font-medium text-foreground">Hồ sơ cá nhân</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <ShieldCheck className="size-3" /> Đã xác thực
            </Badge>
            <Badge className="gap-1 bg-emerald-500 hover:bg-emerald-500">
              <Circle className="size-3 fill-white" /> Đang hoạt động
            </Badge>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-6 py-6 grid gap-6 md:grid-cols-[280px_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <AvatarCircle name={form.fullName} />
              <div className="space-y-1">
                <CardTitle className="text-lg">{form.fullName}</CardTitle>
                <CardDescription>Lab User</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="size-4" />
                <span className="truncate">{form.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="size-4" />
                <span>{form.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Hash className="size-4" />
                <span>ID: 12345678</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="size-4" />
                <span>Thành viên từ 04/03/2025</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cài đặt nhanh</CardTitle>
              <CardDescription>Nhấn để bật / tắt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Smartphone className="size-4" /> Thông báo SMS
                </div>
                <Switch checked={form.quick.sms} onCheckedChange={(v) => updateQuick("sms", v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Circle className="size-4" /> Hiển thị trạng thái
                </div>
                <Switch checked={form.quick.showStatus} onCheckedChange={(v) => updateQuick("showStatus", v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="size-4" /> Tự động cập nhật
                </div>
                <Switch checked={form.quick.autoUpdate} onCheckedChange={(v) => updateQuick("autoUpdate", v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Power className="size-4" /> Đăng xuất thiết bị khác
                </div>
                <Switch checked={form.quick.remoteLogout} onCheckedChange={(v) => updateQuick("remoteLogout", v)} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button variant="secondary" className="w-full justify-start" size="sm">
              ← Về trang nhân viên
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <LogOut className="size-4 mr-2" /> Đăng xuất
            </Button>
            <Button variant="destructive" className="w-full justify-start" size="sm">
              <Trash2 className="size-4 mr-2" /> Xóa tài khoản
            </Button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Hồ sơ người dùng</h1>
            <div className="w-80">
              <Input placeholder="Tìm cài đặt" />
            </div>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="security">Bảo mật</TabsTrigger>
              <TabsTrigger value="notifications">Thông báo</TabsTrigger>
              <TabsTrigger value="sessions">Phiên làm việc</TabsTrigger>
            </TabsList>

            {/* Tab: Personal */}
            <TabsContent value="personal" className="space-y-6">
              {/* Thông tin cơ bản */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User2 className="size-4" /> Thông tin cơ bản
                  </CardTitle>
                  <CardDescription>Quản lý dữ liệu cá nhân</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldRow>
                    <div className="space-y-1.5">
                      <Label>Họ và tên *</Label>
                      <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Giới tính *</Label>
                      <RadioGroup
                        className="flex h-10 items-center gap-6 rounded-md border px-3"
                        value={form.gender}
                        onValueChange={(v: Gender) => update("gender", v)}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem id="gt-nam" value="male" />
                          <Label htmlFor="gt-nam" className="font-normal">Nam</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem id="gt-nu" value="female" />
                          <Label htmlFor="gt-nu" className="font-normal">Nữ</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </FieldRow>

                  <FieldRow>
                    <div className="space-y-1.5">
                      <Label>Ngày tháng năm sinh *</Label>
                      <Input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Nhóm máu *</Label>
                      <Select value={form.bloodGroup} onValueChange={(v) => update("bloodGroup", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhóm máu" />
                        </SelectTrigger>
                        <SelectContent>
                          {(["A+","A-","B+","B-","AB+","AB-","O+","O-"] as const).map((g) => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FieldRow>

                  <FieldRow>
                    <div className="space-y-1.5">
                      <Label>Số điện thoại *</Label>
                      <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input value={form.email} disabled />
                    </div>
                  </FieldRow>
                </CardContent>
              </Card>

              {/* Địa chỉ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="size-4" /> Địa chỉ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldRow>
                    <div className="space-y-1.5">
                      <Label>Tỉnh, thành phố *</Label>
                      <Select value={form.city} onValueChange={(v) => update("city", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh / thành" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Hồ Chí Minh",
                            "Hà Nội",
                            "Đà Nẵng",
                            "Cần Thơ",
                            "Bình Dương",
                          ].map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Quận, huyện *</Label>
                      <Select value={form.district} onValueChange={(v) => update("district", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quận / huyện" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Quận 1","Quận 3","Quận 7","TP Thủ Đức"].map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FieldRow>

                  <div className="space-y-1.5">
                    <Label>Địa chỉ chi tiết *</Label>
                    <Input placeholder="Số nhà, tên đường, phường/xã..." value={form.address} onChange={(e) => update("address", e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              {/* Công việc */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="size-4" /> Thông tin công việc
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldRow>
                    <div className="space-y-1.5">
                      <Label>Mã nhân viên</Label>
                      <Input value={form.employeeCode} disabled />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Phòng ban</Label>
                      <Input value={form.department} disabled />
                    </div>
                  </FieldRow>
                  <FieldRow>
                    <div className="space-y-1.5">
                      <Label>Chức vụ</Label>
                      <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Vai trò hệ thống</Label>
                      <Input value={form.role} disabled />
                    </div>
                  </FieldRow>
                </CardContent>
              </Card>

              {/* Giới thiệu */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Giới thiệu bản thân</CardTitle>
                  <CardDescription>Viết vài dòng về bản thân, kinh nghiệm, sở thích…</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    placeholder="Tối đa 500 ký tự"
                    className="min-h-28"
                  />
                  <div className="text-right text-xs text-muted-foreground mt-1">
                    {form.bio.length}/500 ký tự
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-3">
                <Button variant="outline">Hủy</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Đang lưu…" : "Lưu thay đổi"}
                </Button>
              </div>
            </TabsContent>

            {/* Other tabs (placeholders) */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="size-4" /> Bảo mật
                  </CardTitle>
                  <CardDescription>Quản lý mật khẩu, xác thực hai lớp, thiết bị tin cậy…</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">(Placeholder) Implement security settings here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Smartphone className="size-4" /> Thông báo
                  </CardTitle>
                  <CardDescription>Cấu hình kênh nhận thông báo và tần suất.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">(Placeholder) Implement notification settings here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Phiên làm việc</CardTitle>
                  <CardDescription>Quản lý các phiên đăng nhập đang hoạt động.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">(Placeholder) Implement session management here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

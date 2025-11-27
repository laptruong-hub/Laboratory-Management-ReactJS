import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../api/apiClient";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import LoadingSpinner from "../common/LoadingSpinner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type FormData = {
  fullName: string;
  phone: string;
  email: string;
};

type FormErrors = {
  fullName: string;
  phone: string;
  email: string;
};

type FormField = keyof FormData;

const AccountEdit = () => {
  const { user, refreshUser } = useAuth();
  const [hasNotChanged, setHasNotChanged] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: user?.fullName || "",
    phone: "",
    email: user?.email || "",
  });

  const [defaultFormData, setDefaultFormData] = useState<FormData | null>(null);

  const [errors, setErrors] = useState<FormErrors>({
    fullName: "",
    phone: "",
    email: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      const initialData: FormData = {
        fullName: user.fullName || "",
        phone: "",
        email: user.email || "",
      };
      setFormData(initialData);
      setDefaultFormData(initialData);
    }
  }, [user]);

  // Compare form data with default
  useEffect(() => {
    if (!defaultFormData) return;

    const isEqual =
      formData.fullName === defaultFormData.fullName &&
      formData.phone === defaultFormData.phone &&
      formData.email === defaultFormData.email;
    setHasNotChanged(isEqual);
  }, [formData, defaultFormData]);

  const validateField = (name: FormField, value: unknown): string => {
    let error = "";

    switch (name) {
      case "fullName":
        if (typeof value !== "string") {
          error = "Họ và tên phải là chuỗi";
        } else if (!value.trim()) {
          error = "Họ và tên là bắt buộc";
        } else if (value.length < 5) {
          error = "Họ và tên quá ngắn";
        }
        break;
      case "phone":
        if (typeof value !== "string") {
          error = "Số điện thoại phải là chuỗi";
        } else if (value && !/^\d{10,11}$/.test(value)) {
          error = "Số điện thoại không hợp lệ";
        }
        break;
      case "email":
        if (value && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Email không hợp lệ";
        }
        break;
    }

    return error;
  };

  const handleChange = (name: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Validate on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const updateProfile = async () => {
    try {
      setIsLoading(true);
      if (!user?.id) {
        toast.error("Không tìm thấy thông tin người dùng");
        return;
      }

      const updateRequest = {
        fullName: formData.fullName,
        phone: formData.phone || null,
        email: formData.email,
      };

      await apiClient.put(`/api/users/${user.id}`, updateRequest);
      await refreshUser();
      setShowSuccessModal(true);
      setDefaultFormData({ ...formData });
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại!");
      const err = error as AxiosError;
      if (err) console.log("Error updating profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {} as FormErrors;
    (Object.keys(formData) as FormField[]).forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
    });

    setErrors(newErrors);

    // Check if there are any errors
    const isValid = Object.values(newErrors).every((error) => !error);

    if (isValid) {
      await updateProfile();
    }
  };

  const FeedbackModal = ({
    isOpen,
    onClose,
    title,
    message,
    type = "info",
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: "info" | "success" | "error" | "warning";
  }) => {
    const typeColors = {
      info: "bg-blue-500",
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`w-16 h-16 rounded-full ${typeColors[type]} flex items-center justify-center mx-auto mb-4`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {type === "success" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : type === "error" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                </svg>
              </div>
              <h3 className="text-lg font-bold text-center mb-2">{title}</h3>
              <p className="text-gray-600 text-center mb-6">{message}</p>
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className={`px-6 py-2 ${typeColors[type]} text-white rounded-md hover:opacity-90 cursor-pointer`}
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return isLoading ? (
    <LoadingSpinner fullScreen text="Đang tải..." />
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-2xl p-0 overflow-hidden mt-8 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-3 bg-[#C14B53] py-6 px-6 rounded-t-2xl">
        <FaUser className="text-white text-2xl" />
        <h2 className="text-xl font-bold text-white">Chỉnh sửa thông tin</h2>
      </div>
      <div className="border-b border-gray-200 my-0" />
      <form onSubmit={handleSubmit} className="space-y-6 p-8 md:p-10">
        {/* Name */}
        <div className="mb-10">
          <Label htmlFor="fullName" className="block text-gray-800 font-semibold mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#C14B53] transition-shadow shadow-sm hover:shadow-md">
            <FaUser className="text-[#C14B53] text-[22px] mr-4" />
            <Input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Họ và tên người dùng"
              className="w-full bg-transparent outline-none border-none p-0 m-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent focus:border-transparent text-base [&:focus-visible]:ring-0 [&:focus-visible]:outline-none [&:focus-visible]:border-transparent [&:focus]:ring-0 [&:focus]:outline-none [&:focus]:border-transparent"
              style={{ boxShadow: "none" } as React.CSSProperties}
              onFocus={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.outline = "none";
              }}
            />
          </div>
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Phone */}
        <div className="mb-10">
          <Label htmlFor="phone" className="block text-gray-800 font-semibold mb-2">
            Số điện thoại
          </Label>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#C14B53] transition-shadow shadow-sm hover:shadow-md">
            <FaPhone className="text-[#C14B53] text-[22px] mr-4" />
            <Input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Số điện thoại người dùng"
              className="w-full bg-transparent outline-none border-none p-0 m-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent focus:border-transparent text-base [&:focus-visible]:ring-0 [&:focus-visible]:outline-none [&:focus-visible]:border-transparent [&:focus]:ring-0 [&:focus]:outline-none [&:focus]:border-transparent"
              style={{ boxShadow: "none" } as React.CSSProperties}
              onFocus={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.outline = "none";
              }}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="mb-10">
          <Label htmlFor="email" className="block text-gray-800 font-semibold mb-2">
            Email
          </Label>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#C14B53] transition-shadow shadow-sm hover:shadow-md">
            <FaEnvelope className="text-[#C14B53] text-[22px] mr-4" />
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Vd: example@gmail.com"
              className="w-full bg-transparent outline-none border-none p-0 m-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent focus:border-transparent text-base [&:focus-visible]:ring-0 [&:focus-visible]:outline-none [&:focus-visible]:border-transparent [&:focus]:ring-0 [&:focus]:outline-none [&:focus]:border-transparent"
              style={{ boxShadow: "none" } as React.CSSProperties}
              onFocus={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.outline = "none";
              }}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-[#C14B53] hover:bg-[#a83a42] hover:scale-105 cursor-pointer"
            disabled={hasNotChanged || isLoading}
          >
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>

      <FeedbackModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Thành công"
        message="Thông tin đã được cập nhật thành công!"
        type="success"
      />
    </motion.div>
  );
};

export default AccountEdit;

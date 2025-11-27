import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-red-600 text-white pt-14 pb-0">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/15">
          {/* Column 1: About */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-5 text-white">Lab Xét Nghiệm</h3>
            <p className="text-white/85 text-sm leading-relaxed mb-5">
              Phòng lab hiện đại với đội ngũ chuyên gia giàu kinh nghiệm, cam
              kết mang đến dịch vụ xét nghiệm chất lượng cao nhất.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-md bg-white/12 flex items-center justify-center text-white text-sm hover:bg-white hover:text-red-600 transition-all duration-200"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-md bg-white/12 flex items-center justify-center text-white text-sm hover:bg-white hover:text-red-600 transition-all duration-200"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-md bg-white/12 flex items-center justify-center text-white text-sm hover:bg-white hover:text-red-600 transition-all duration-200"
              >
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-5 text-white">Dịch Vụ</h3>
            <a
              href="#"
              className="text-white/85 text-sm mb-2.5 no-underline hover:text-white transition-colors duration-200"
            >
              Xét Nghiệm Tổng Quát
            </a>
            <a
              href="#"
              className="text-white/85 text-sm mb-2.5 no-underline hover:text-white transition-colors duration-200"
            >
              Xét Nghiệm Tim Mạch
            </a>
            <a
              href="#"
              className="text-white/85 text-sm mb-2.5 no-underline hover:text-white transition-colors duration-200"
            >
              Xét Nghiệm Đường Huyết
            </a>
            <a
              href="#"
              className="text-white/85 text-sm mb-2.5 no-underline hover:text-white transition-colors duration-200"
            >
              Xét Nghiệm Hóa Sinh
            </a>
          </div>

          {/* Column 3: About Us */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-5 text-white">Về Chúng Tôi</h3>
            <a
              href="#"
              className="text-white/85 text-sm mb-2.5 no-underline hover:text-white transition-colors duration-200"
            >
              Giới Thiệu
            </a>
            <a
              href="#"
              className="text-white/85 text-sm mb-2.5 no-underline hover:text-white transition-colors duration-200"
            >
              Đội Ngũ Chuyên Gia
            </a>
            <a
              href="#"
              className="text-white/85 text-sm mb-2.5 no-underline hover:text-white transition-colors duration-200"
            >
              Chứng Nhận
            </a>
            <a
              href="#"
              className="text-white/85 text-sm mb-2.5 no-underline hover:text-white transition-colors duration-200"
            >
              Tin Tức
            </a>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-5 text-white">Liên Hệ</h3>
            <div className="flex gap-3 items-start text-white/85 text-sm mb-3.5 leading-relaxed">
              <div className="text-white text-base mt-0.5 flex-shrink-0">
                <FaMapMarkerAlt />
              </div>
              <div>123 Đường ABC, Quận 1, TP.HCM</div>
            </div>
            <div className="flex gap-3 items-start text-white/85 text-sm mb-3.5 leading-relaxed">
              <div className="text-white text-base mt-0.5 flex-shrink-0">
                <FaPhoneAlt />
              </div>
              <div>1900 xxxx</div>
            </div>
            <div className="flex gap-3 items-start text-white/85 text-sm mb-3.5 leading-relaxed">
              <div className="text-white text-base mt-0.5 flex-shrink-0">
                <FaEnvelope />
              </div>
              <div>info@labxetnghiem.vn</div>
            </div>
          </div>
        </div>

        <div className="text-center py-7 text-white/85 text-sm">
          © 2025 Lab Xét Nghiệm. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

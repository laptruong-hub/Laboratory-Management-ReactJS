import React, { useState, useRef } from "react";
import styled from "styled-components";
import { FaCamera } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const UserInfoContainer = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const AvatarContainer = styled.div`
  position: relative;
  cursor: pointer;
  &:hover .avatar-overlay {
    opacity: 1;
  }
`;

const Avatar = styled.div<{ $hasImage?: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$hasImage ? "transparent" : "rgba(255, 255, 255, 0.2)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    user-select: none;
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
`;

const CameraIcon = styled(FaCamera)`
  color: white;
  font-size: 1.2rem;
`;

const FileInput = styled.input`
  display: none;
  
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
`;

const UserRole = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
`;

const UserEmail = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.8);
`;

const WorkingUserInfo: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load avatar from localStorage on mount and when user changes
  const getAvatarFromStorage = () => {
    if (user?.id) {
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
      if (savedAvatar) return savedAvatar;
    }
    // Fallback to temp avatar if no user ID yet
    const tempAvatar = localStorage.getItem("avatar_temp");
    if (tempAvatar) return tempAvatar;
    return null;
  };

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    getAvatarFromStorage()
  );
  const [isUploading, setIsUploading] = useState(false);

  // Update avatar preview when user changes
  React.useEffect(() => {
    const savedAvatar = getAvatarFromStorage();
    setAvatarPreview(savedAvatar);
  }, [user?.id]);

  // Lấy tên từ API response hoặc email nếu không có
  const displayName = user?.fullName || user?.email?.split("@")[0] || "User";
  const displayRole = user?.roleName || "—";
  const displayEmail = user?.email || "—";

  // Lấy chữ cái đầu của tên để hiển thị nếu không có ảnh
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Read file and save to localStorage
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result as string;

      // Lưu ảnh vào localStorage với key là userId
      if (user?.id) {
        try {
          localStorage.setItem(`avatar_${user.id}`, imageDataUrl);
          setAvatarPreview(imageDataUrl);
        } catch (error) {
          console.error("Lỗi khi lưu ảnh vào localStorage:", error);
          alert("Lỗi khi lưu ảnh. LocalStorage có thể đã đầy.");
        }
      } else {
        // Nếu chưa có user ID, lưu tạm với key chung
        try {
          localStorage.setItem("avatar_temp", imageDataUrl);
          setAvatarPreview(imageDataUrl);
        } catch (error) {
          console.error("Lỗi khi lưu ảnh vào localStorage:", error);
          alert("Lỗi khi lưu ảnh. LocalStorage có thể đã đầy.");
        }
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert("Lỗi khi đọc file ảnh");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <UserInfoContainer>
      <AvatarContainer onClick={handleAvatarClick}>
        <Avatar $hasImage={!!avatarPreview}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" />
          ) : (
            <span>{getInitials(displayName)}</span>
          )}
        </Avatar>
        <AvatarOverlay className="avatar-overlay">
          <CameraIcon />
        </AvatarOverlay>
        <FileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </AvatarContainer>
      <UserDetails>
        <UserName>{displayName}</UserName>
        <UserRole>{displayRole}</UserRole>
        <UserEmail>{displayEmail}</UserEmail>
      </UserDetails>
    </UserInfoContainer>
  );
};

export default WorkingUserInfo;

import React from 'react';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';

const UserInfoContainer = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
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
  // TODO: Lấy thông tin user từ context hoặc props
  const user = {
    name: 'Admin User',
    role: 'Administrator',
    email: 'admin@labmanager.com'
  };

  return (
    <UserInfoContainer>
      <Avatar>
        <FaUserCircle />
      </Avatar>
      <UserDetails>
        <UserName>{user.name}</UserName>
        <UserRole>{user.role}</UserRole>
        <UserEmail>{user.email}</UserEmail>
      </UserDetails>
    </UserInfoContainer>
  );
};

export default WorkingUserInfo;

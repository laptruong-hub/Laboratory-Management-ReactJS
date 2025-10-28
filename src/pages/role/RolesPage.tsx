import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaDownload } from 'react-icons/fa';

const PageContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const Breadcrumb = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  
  span {
    margin: 0 0.5rem;
  }
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  flex: 1;
  max-width: 400px;
  
  input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 0.9rem;
    margin-left: 0.5rem;
    
    &::placeholder {
      color: #9ca3af;
    }
  }
  
  svg {
    color: #9ca3af;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  
  ${props => props.$variant === 'primary' ? `
    background-color: #dc2626;
    color: white;
    
    &:hover {
      background-color: #b91c1c;
    }
  ` : `
    background-color: white;
    color: #4b5563;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background-color: #f9fafb;
    }
  `}
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableInfo = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f3f4f6;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  color: #4b5563;
`;

const Badge = styled.span<{ $color?: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  
  ${props => {
    switch(props.$color) {
      case 'green':
        return 'background-color: #d1fae5; color: #065f46;';
      case 'blue':
        return 'background-color: #dbeafe; color: #1e40af;';
      case 'red':
        return 'background-color: #fee2e2; color: #991b1b;';
      default:
        return 'background-color: #f3f4f6; color: #4b5563;';
    }
  }}
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 0.75rem;
  
  svg {
    cursor: pointer;
    color: #6b7280;
    font-size: 1.1rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: #dc2626;
    }
  }
`;

interface User {
  id: number;
  role: string;
  permission: string;
  badgeColor: string;
}

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dữ liệu mẫu từ Figma
  const users: User[] = [
    { id: 1, role: 'Administrator', permission: 'Member', badgeColor: 'blue' },
    { id: 2, role: 'Laboratory Manager', permission: 'Member', badgeColor: 'blue' },
    { id: 3, role: 'Service', permission: 'Member', badgeColor: 'blue' },
    { id: 4, role: 'Lab User', permission: 'Member', badgeColor: 'blue' },
    { id: 5, role: 'User', permission: 'Staff', badgeColor: 'red' },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Danh sách vai trò</PageTitle>
        <Breadcrumb>
          Dashboard <span>/</span> Vai trò
        </Breadcrumb>
      </PageHeader>

      <ControlBar>
        <SearchBox>
          <FaSearch />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên hoặc email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        
        <ActionButtons>
          <Button $variant="secondary">
            <FaFilter />
            Lọc
          </Button>
          <Button $variant="secondary">
            <FaDownload />
            Xuất
          </Button>
          <Button $variant="primary">
            <FaPlus />
            Thêm vai trò
          </Button>
        </ActionButtons>
      </ControlBar>

      <TableContainer>
        <TableInfo>
          Đang hiển thị trong tổng số <strong>{users.length} tài khoản</strong>
        </TableInfo>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>#</TableHeader>
              <TableHeader>Vai trò</TableHeader>
              <TableHeader>Quyền hạn</TableHeader>
              <TableHeader>Chức năng</TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge $color={user.badgeColor}>{user.permission}</Badge>
                </TableCell>
                <TableCell>
                  <ActionIcons>
                    <FaEdit title="Chỉnh sửa" />
                    <FaTrash title="Xóa" />
                  </ActionIcons>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default UsersPage;

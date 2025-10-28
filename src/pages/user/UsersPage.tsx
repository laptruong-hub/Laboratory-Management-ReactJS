import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaFilter, 
  FaDownload,
  FaUserCircle 
} from 'react-icons/fa';

// ============= STYLED COMPONENTS =============

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
    color: #d1d5db;
  }
  
  a {
    color: #6b7280;
    text-decoration: none;
    
    &:hover {
      color: #dc2626;
    }
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
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
  
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
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
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
  white-space: nowrap;
  
  ${props => {
    switch(props.$variant) {
      case 'primary':
        return `
          background-color: #dc2626;
          color: white;
          
          &:hover {
            background-color: #b91c1c;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
          
          &:hover {
            background-color: #dc2626;
          }
        `;
      default:
        return `
          background-color: white;
          color: #4b5563;
          border: 1px solid #e5e7eb;
          
          &:hover {
            background-color: #f9fafb;
            border-color: #d1d5db;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  strong {
    color: #1f2937;
    font-weight: 600;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s ease;
  
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
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  color: #4b5563;
  vertical-align: middle;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const UserEmail = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

const Badge = styled.span<{ $color?: string }>`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  
  ${props => {
    switch(props.$color) {
      case 'green':
        return 'background-color: #d1fae5; color: #065f46;';
      case 'blue':
        return 'background-color: #dbeafe; color: #1e40af;';
      case 'yellow':
        return 'background-color: #fef3c7; color: #92400e;';
      case 'red':
        return 'background-color: #fee2e2; color: #991b1b;';
      case 'purple':
        return 'background-color: #ede9fe; color: #5b21b6;';
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
    transition: all 0.2s ease;
    
    &:hover {
      color: #dc2626;
      transform: scale(1.1);
    }
  }
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #6b7280;
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.3;
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #4b5563;
  }
  
  p {
    margin: 0;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
`;

const PageInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  background: ${props => props.$active ? '#dc2626' : 'white'};
  color: ${props => props.$active ? 'white' : '#4b5563'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? '#b91c1c' : '#f9fafb'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ============= INTERFACES =============

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
}

// ============= COMPONENT =============

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Dữ liệu mẫu - Thay bằng API call sau này
  const allUsers: User[] = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@lab.com', role: 'Administrator', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@lab.com', role: 'Laboratory Manager', status: 'active', joinDate: '2024-02-20' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@lab.com', role: 'Lab User', status: 'active', joinDate: '2024-03-10' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@lab.com', role: 'Service', status: 'inactive', joinDate: '2024-01-25' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@lab.com', role: 'User', status: 'pending', joinDate: '2024-04-05' },
    { id: 6, name: 'Đặng Thị F', email: 'dangthif@lab.com', role: 'Lab User', status: 'active', joinDate: '2024-02-15' },
    { id: 7, name: 'Vũ Văn G', email: 'vuvang@lab.com', role: 'Service', status: 'active', joinDate: '2024-03-20' },
    { id: 8, name: 'Bùi Thị H', email: 'buithih@lab.com', role: 'User', status: 'active', joinDate: '2024-01-30' },
  ];

  // Lọc users theo tìm kiếm
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Hàm xử lý
  const handleEdit = (userId: number) => {
    console.log('Edit user:', userId);
    // TODO: Implement edit functionality
  };

  const handleDelete = (userId: number) => {
    console.log('Delete user:', userId);
    // TODO: Implement delete functionality
  };

  const handleAddUser = () => {
    console.log('Add new user');
    // TODO: Implement add user functionality
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge $color="green">Hoạt động</Badge>;
      case 'inactive':
        return <Badge $color="red">Tạm ngưng</Badge>;
      case 'pending':
        return <Badge $color="yellow">Chờ duyệt</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'Administrator':
        return <Badge $color="purple">Administrator</Badge>;
      case 'Laboratory Manager':
        return <Badge $color="blue">Lab Manager</Badge>;
      case 'Lab User':
        return <Badge $color="green">Lab User</Badge>;
      case 'Service':
        return <Badge $color="yellow">Service</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Quản lý người dùng</PageTitle>
        <Breadcrumb>
          <a href="/working/dashboard">Dashboard</a>
          <span>/</span>
          <span>Người dùng</span>
        </Breadcrumb>
      </PageHeader>

      <ControlBar>
        <SearchBox>
          <FaSearch />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên, email hoặc vai trò..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi search
            }}
          />
        </SearchBox>
        
        <ActionButtons>
          <Button $variant="secondary">
            <FaFilter />
            Lọc
          </Button>
          <Button $variant="secondary">
            <FaDownload />
            Xuất Excel
          </Button>
          <Button $variant="primary" onClick={handleAddUser}>
            <FaPlus />
            Thêm người dùng
          </Button>
        </ActionButtons>
      </ControlBar>

      <TableContainer>
        <TableInfo>
          <span>
            Đang hiển thị <strong>{startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}</strong> trong tổng số <strong>{filteredUsers.length}</strong> người dùng
          </span>
        </TableInfo>
        
        {currentUsers.length > 0 ? (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>STT</TableHeader>
                  <TableHeader>Người dùng</TableHeader>
                  <TableHeader>Vai trò</TableHeader>
                  <TableHeader>Trạng thái</TableHeader>
                  <TableHeader>Ngày tham gia</TableHeader>
                  <TableHeader>Thao tác</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>
                      <UserInfo>
                        <Avatar>
                          <FaUserCircle />
                        </Avatar>
                        <UserDetails>
                          <UserName>{user.name}</UserName>
                          <UserEmail>{user.email}</UserEmail>
                        </UserDetails>
                      </UserInfo>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.joinDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      <ActionIcons>
                        <FaEdit 
                          title="Chỉnh sửa" 
                          onClick={() => handleEdit(user.id)}
                        />
                        <FaTrash 
                          title="Xóa" 
                          onClick={() => handleDelete(user.id)}
                        />
                      </ActionIcons>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <Pagination>
                <PageInfo>
                  Trang {currentPage} / {totalPages}
                </PageInfo>
                <PageButtons>
                  <PageButton 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Trước
                  </PageButton>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PageButton
                      key={page}
                      $active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PageButton>
                  ))}
                  
                  <PageButton 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sau →
                  </PageButton>
                </PageButtons>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyState>
            <FaUserCircle />
            <h3>Không tìm thấy người dùng</h3>
            <p>Thử tìm kiếm với từ khóa khác hoặc thêm người dùng mới</p>
          </EmptyState>
        )}
      </TableContainer>
    </PageContainer>
  );
};

export default UsersPage;

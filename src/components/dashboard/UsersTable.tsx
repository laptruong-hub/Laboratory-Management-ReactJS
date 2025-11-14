import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Pencil, Eye } from 'lucide-react';

type Role = 'Administrator' | 'Laboratory Manager' | 'Service' | 'Lab User';
type UserStatus = 'active' | 'pending' | 'suspended' | 'inactive';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  activity: string; // "Đang hóa" | "X giờ trước (Từ ... đến ...)"
  createdAt: string; // YYYY-MM-DD HH:MM:SS
  online?: boolean;
}

interface UsersTableProps {
  rows: UserRow[];
}

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  height: 36px;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  padding: 0 10px;
  font-size: 14px;
`;

const SearchBox = styled.input`
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  outline: none;
  width: 220px;
  background: #ffffff;
  color: #111827;
  &:focus { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12); }

  &::placeholder {
    color: #94a3b8;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 1200px;
  min-width: 1200px;
`;

const Thead = styled.thead`
  background: #F9FAFB;
`;

const Th = styled.th`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #F3F4F6;
`;

const Tr = styled.tr`
  height: 80px;
  background: #ffffff;
  border-bottom: 1px solid #F3F4F6;
  &:hover { background: #F9FAFB; }
`;

const Td = styled.td`
  padding: 16px;
  vertical-align: middle;
  color: #111827;
  font-size: 14px;
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AvatarWrap = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #fee2e2;
  color: #b91c1c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const StatusDot = styled.span<{ $color: string }>`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: ${p => p.$color};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #6B7280;
`;

const RoleText = styled.span`
  color: #374151;
`;

const StatusBadge = styled.span<{ $type: UserStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  ${p =>
    p.$type === 'active'
      ? 'background:#D1FAE5;color:#047857;'
      : p.$type === 'pending'
      ? 'background:#FEF3C7;color:#B45309;'
      : p.$type === 'suspended'
      ? 'background:#FEE2E2;color:#B91C1C;'
      : 'background:#E5E7EB;color:#374151;'}
`;

const Muted = styled.div`
  color: #6B7280;
  font-size: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const IconButton = styled.button`
  background: transparent;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 6px;
  color: #6B7280;
  cursor: pointer;
  display: inline-flex;
  &:hover { color: #2563EB; border-color: #BFDBFE; }
`;

export const UsersTable: React.FC<UsersTableProps> = ({ rows }) => {
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const matchesRole = roleFilter === 'all' ? true : r.role === roleFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [rows, roleFilter, search]);

  return (
    <Card>
      <Header>
        <Title>Người dùng & hoạt động gần đây</Title>
        <Controls>
          <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)}>
            <option value="all">Tất cả vai trò</option>
            <option value="Administrator">Administrator</option>
            <option value="Laboratory Manager">Laboratory Manager</option>
            <option value="Service">Service</option>
            <option value="Lab User">Lab User</option>
          </Select>
          <SearchBox placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} />
        </Controls>
      </Header>

      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <Th>Người dùng</Th>
              <Th>Vai trò</Th>
              <Th>Trạng thái</Th>
              <Th>Đang hoạt động gần đây</Th>
              <Th>Ngày tạo tài khoản</Th>
              <Th></Th>
            </tr>
          </Thead>
          <tbody>
            {filtered.map(u => (
              <Tr key={u.id}>
                <Td>
                  <UserCell>
                    <AvatarWrap>
                      <Avatar>{u.name.charAt(0)}</Avatar>
                      <StatusDot $color={u.status === 'active' ? '#10B981' : u.status === 'pending' ? '#F59E0B' : u.status === 'suspended' ? '#EF4444' : '#6B7280'} />
                    </AvatarWrap>
                    <UserInfo>
                      <UserName>{u.name}</UserName>
                      <UserEmail>{u.email}</UserEmail>
                    </UserInfo>
                  </UserCell>
                </Td>
                <Td>
                  <RoleText>{u.role}</RoleText>
                </Td>
                <Td>
                  <StatusBadge $type={u.status}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: u.status === 'active' ? '#10B981' : u.status === 'pending' ? '#F59E0B' : u.status === 'suspended' ? '#EF4444' : '#6B7280', display: 'inline-block' }} />
                    {u.status === 'active' ? 'Hoạt động' : u.status === 'pending' ? 'Chưa kích hoạt' : u.status === 'suspended' ? 'Tạm khóa' : 'Không hoạt động'}
                  </StatusBadge>
                </Td>
                <Td>
                  <div style={{ fontSize: 14 }}>{u.activity.split('\n')[0]}</div>
                  {u.activity.includes('\n') && <Muted>{u.activity.split('\n')[1]}</Muted>}
                </Td>
                <Td style={{ color: '#6B7280' }}>{u.createdAt}</Td>
                <Td>
                  <Actions>
                    <IconButton aria-label="Edit">
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton aria-label="View">
                      <Eye size={16} />
                    </IconButton>
                  </Actions>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Card>
  );
};

export default UsersTable;



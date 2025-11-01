import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const PageContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
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
  }
  svg {
    color: #9ca3af;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const FilterWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const FilterDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 0.5rem;
  min-width: 220px;
  z-index: 60;
`;

const FilterItem = styled.div`
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #111827;

  &:hover {
    background: #f9fafb;
  }
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
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
  ${(props) =>
    props.$variant === "primary"
      ? `background-color:#dc2626;color:white; &:hover{background-color:#b91c1c}`
      : `background:white;color:#4b5563;border:1px solid #e5e7eb; &:hover{background:#f9fafb}`}
`;

const FlexLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
`;

const Sidebar = styled.aside`
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SidebarSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 0.75rem;
  height: auto;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-weight: 700;
  color: #374151;
  border-bottom: 1px solid #eef2f6;
`;

const AddRoleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #b91c1c;
  }

  svg {
    font-size: 0.75rem;
  }
`;

const CountBadge = styled.span`
  background: #f3f4f6;
  color: #374151;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
`;

const RoleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.75rem;
  min-height: 240px;
`;

const RoleItem = styled.div<{ $active?: boolean; roleColor?: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s ease, transform 0.08s ease;
  background: ${(props) => (props.$active ? "#f8fafc" : "transparent")};

  &:hover {
    background: #f9fafb;
    transform: translateY(-1px);
  }
`;

const RoleLeftStripe = styled.div`
  width: 8px;
  height: 40px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const RoleLabel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const RoleName = styled.div`
  font-weight: 700;
  color: #111827;
`;

const RoleMeta = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

const RoleActions = styled.div`
  display: flex;
  gap: 0.5rem;
  color: #6b7280;
  svg {
    cursor: pointer;
    &:hover {
      color: #dc2626;
    }
  }
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eef2f6;
`;

const PaginationButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 0.85rem;
  color: #6b7280;
`;

const Content = styled.main`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: auto;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Panel = styled.section`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #eef2f6;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #111827;
  font-weight: 700;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MemberRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background 0.12s ease;

  &:hover {
    background: #f9fafb;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  font-weight: 700;
  flex-shrink: 0;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 50;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 920px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1rem 1.25rem;
  font-weight: 800;
  border-bottom: 1px solid #eef2f6;
  font-size: 1.1rem;
  color: #111827;
`;

const ModalBody = styled.div`
  padding: 1rem 1.25rem 1.5rem 1.25rem;
`;

const ModalColumns = styled.div`
  display: flex;
  gap: 1rem;
`;

const PermissionsColumn = styled.div`
  flex: 2;
  max-height: 420px;
  overflow: auto;
  padding-right: 0.5rem;
`;

const PermissionGroup = styled.div`
  margin-bottom: 1rem;
`;

const GroupTitle = styled.div`
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #374151;
`;

const PermissionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #4b5563;
`;

const ToggleSwitch = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  input {
    display: none;
  }

  span {
    width: 44px;
    height: 24px;
    background: #e5e7eb;
    border-radius: 999px;
    position: relative;
    transition: background 0.12s ease;
  }

  span::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    transition: transform 0.12s ease;
  }

  input:checked + span {
    background: #ef4444;
  }

  input:checked + span::after {
    transform: translateX(20px);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #dc2626;
  }
`;

const ColorInput = styled.input`
  width: 80px;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
`;

interface Role {
  id: number;
  name: string;
  color: string;
  members: number;
  isDefault?: boolean;
}

interface Member {
  id: number;
  name: string;
  email?: string;
}

const ROLES_PER_PAGE = 3;
const MEMBERS_PER_PAGE = 5;

const RolesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(1);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortOption, setSortOption] = useState<"none" | "role" | "members">(
    "none"
  );
  const [roleNameInput, setRoleNameInput] = useState("");
  const [roleColorInput, setRoleColorInput] = useState("#5865F2");
  const [customRolesPage, setCustomRolesPage] = useState(0);
  const [membersPage, setMembersPage] = useState(0);

  const filterRef = useRef<HTMLDivElement | null>(null);
  const memberListRef = useRef<HTMLDivElement | null>(null);
  const defaultRolesRef = useRef<HTMLDivElement | null>(null);
  const customRolesRef = useRef<HTMLDivElement | null>(null);

  const [memberListHeight, setMemberListHeight] = useState("auto");

  const initialRoles: Role[] = [
    {
      id: 1,
      name: "Administrator",
      color: "#5865F2",
      members: 2,
      isDefault: true,
    },
    {
      id: 2,
      name: "Laboratory Manager",
      color: "#43B581",
      members: 3,
      isDefault: true,
    },
    { id: 3, name: "Service", color: "#FAA61A", members: 1, isDefault: true },
    {
      id: 4,
      name: "Lab User",
      color: "#EB459E",
      members: 7,
      isDefault: true,
    },
  ];

  const [rolesState, setRolesState] = useState<Role[]>(initialRoles);

  const defaultRoles = rolesState.filter((r) => r.isDefault);
  const customRoles = rolesState.filter((r) => !r.isDefault);

  const membersMap: Record<number, Member[]> = {
    1: [
      { id: 1, name: "Nguyen Van A", email: "a@example.com" },
      { id: 2, name: "Tran Thi B", email: "b@example.com" },
    ],
    2: [
      { id: 3, name: "Le Van C", email: "c@example.com" },
      { id: 4, name: "Pham Thi D", email: "d@example.com" },
      { id: 5, name: "Hoang E", email: "e@example.com" },
    ],
    3: [{ id: 6, name: "Service One" }],
    4: [
      { id: 7, name: "User 1" },
      { id: 8, name: "User 2" },
      { id: 9, name: "User 3" },
      { id: 10, name: "User 4" },
      { id: 11, name: "User 5" },
      { id: 12, name: "User 6" },
      { id: 13, name: "User 7" },
    ],
  };

  const permissionGroups: { title: string; items: string[] }[] = [
    { title: "Quyền hạn cơ bản", items: ["Read only"] },
    {
      title: "Quản lý người dùng",
      items: ["View user", "Create user", "Lock/ Unlock user"],
    },
    { title: "Quản lý vai trò", items: ["Create role", "Update role"] },
    {
      title: "Quản lý đơn xét nghiệm",
      items: ["Create test", "Update test", "Delete test"],
    },
  ];

  const selectedRole =
    rolesState.find((r) => r.id === selectedRoleId) ?? rolesState[0];
  const members = selectedRoleId ? membersMap[selectedRoleId] ?? [] : [];

  const sortRoles = (roles: Role[]) => {
    const copy = [...roles];
    if (sortOption === "role") {
      return copy.sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" })
      );
    }
    if (sortOption === "members") {
      return copy.sort((a, b) => b.members - a.members);
    }
    return copy;
  };

  const sortedDefaultRoles = sortRoles(defaultRoles);
  const sortedCustomRoles = sortRoles(customRoles);

  // Pagination for custom roles
  const totalCustomPages = Math.ceil(sortedCustomRoles.length / ROLES_PER_PAGE);
  const paginatedCustomRoles = sortedCustomRoles.slice(
    customRolesPage * ROLES_PER_PAGE,
    (customRolesPage + 1) * ROLES_PER_PAGE
  );

  // Pagination for members
  const totalMemberPages = Math.ceil(members.length / MEMBERS_PER_PAGE);
  const paginatedMembers = members.slice(
    membersPage * MEMBERS_PER_PAGE,
    (membersPage + 1) * MEMBERS_PER_PAGE
  );

  const handleRoleSelect = (roleId: number) => {
    setSelectedRoleId(roleId);
    setMembersPage(0);
    // Scroll member list to top
    if (memberListRef.current) {
      memberListRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Calculate member list height based on sidebar sections
  useEffect(() => {
    const calculateHeight = () => {
      if (defaultRolesRef.current && customRolesRef.current) {
        const defaultHeight = defaultRolesRef.current.offsetHeight;
        const customHeight = customRolesRef.current.offsetHeight;
        const totalHeight = defaultHeight + customHeight + 16; // 16px is the gap
        setMemberListHeight(`${totalHeight}px`);
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [sortedDefaultRoles.length, sortedCustomRoles.length, customRolesPage]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!filterRef.current) return;
      if (filterRef.current.contains(e.target as Node)) return;
      setShowFilterDropdown(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowFilterDropdown(false);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

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
            placeholder="Tìm vai trò hoặc thành viên"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        <ActionButtons>
          <FilterWrapper ref={filterRef}>
            <Button
              $variant="secondary"
              onClick={() => setShowFilterDropdown((s) => !s)}
            >
              <FaFilter />
              Lọc
            </Button>
            {showFilterDropdown && (
              <FilterDropdown>
                <FilterItem
                  onClick={() => {
                    setSortOption("role");
                    setShowFilterDropdown(false);
                  }}
                >
                  <div>Sắp xếp theo tên vai trò (A → Z)</div>
                  <div>{sortOption === "role" ? "✓" : ""}</div>
                </FilterItem>
                <FilterItem
                  onClick={() => {
                    setSortOption("members");
                    setShowFilterDropdown(false);
                  }}
                >
                  <div>Sắp xếp theo số thành viên (Giảm dần)</div>
                  <div>{sortOption === "members" ? "✓" : ""}</div>
                </FilterItem>
                <FilterItem
                  onClick={() => {
                    setSortOption("none");
                    setShowFilterDropdown(false);
                  }}
                >
                  <div>Không sắp xếp</div>
                  <div>{sortOption === "none" ? "✓" : ""}</div>
                </FilterItem>
              </FilterDropdown>
            )}
          </FilterWrapper>

          <Button $variant="secondary">
            <FaDownload />
            Xuất
          </Button>
        </ActionButtons>
      </ControlBar>

      <FlexLayout>
        <Sidebar>
          <SidebarSection ref={defaultRolesRef}>
            <SidebarHeader>
              Default Roles
              <CountBadge>{defaultRoles.length}</CountBadge>
            </SidebarHeader>
            <RoleList>
              {sortedDefaultRoles.map((role) => (
                <RoleItem
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  $active={role.id === selectedRoleId}
                  roleColor={role.color}
                  title={`${role.name} — ${role.members} thành viên`}
                >
                  <RoleLeftStripe style={{ backgroundColor: role.color }} />
                  <RoleLabel>
                    <RoleName>{role.name}</RoleName>
                    <RoleMeta>{role.members} thành viên</RoleMeta>
                  </RoleLabel>
                </RoleItem>
              ))}
            </RoleList>
          </SidebarSection>

          <SidebarSection ref={customRolesRef}>
            <SidebarHeader>
              Custom Roles
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <CountBadge>{customRoles.length}</CountBadge>
                <AddRoleButton
                  onClick={() => {
                    setRoleNameInput("");
                    setRoleColorInput("#5865F2");
                    setShowCreateModal(true);
                  }}
                >
                  <FaPlus />
                </AddRoleButton>
              </div>
            </SidebarHeader>
            <RoleList>
              {customRoles.length === 0 ? (
                <EmptyState>Chưa có vai trò tùy chỉnh</EmptyState>
              ) : (
                <>
                  {paginatedCustomRoles.map((role) => (
                    <RoleItem
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      $active={role.id === selectedRoleId}
                      roleColor={role.color}
                      title={`${role.name} — ${role.members} thành viên`}
                    >
                      <RoleLeftStripe
                        style={{ backgroundColor: role.color }}
                      />
                      <RoleLabel>
                        <RoleName>{role.name}</RoleName>
                        <RoleMeta>{role.members} thành viên</RoleMeta>
                      </RoleLabel>
                      <RoleActions onClick={(e) => e.stopPropagation()}>
                        <FaEdit
                          size={14}
                          onClick={() => {
                            setRoleNameInput(role.name);
                            setRoleColorInput(role.color);
                            setShowCreateModal(true);
                          }}
                        />
                        <FaTrash
                          size={14}
                          onClick={() => {
                            setSelectedRoleId(role.id);
                            setShowDeleteConfirm(true);
                          }}
                        />
                      </RoleActions>
                    </RoleItem>
                  ))}

                  {totalCustomPages > 1 && (
                    <PaginationControls>
                      <PaginationButton
                        onClick={() =>
                          setCustomRolesPage((p) => Math.max(0, p - 1))
                        }
                        disabled={customRolesPage === 0}
                      >
                        <FaChevronLeft />
                      </PaginationButton>
                      <PageInfo>
                        {customRolesPage + 1} / {totalCustomPages}
                      </PageInfo>
                      <PaginationButton
                        onClick={() =>
                          setCustomRolesPage((p) =>
                            Math.min(totalCustomPages - 1, p + 1)
                          )
                        }
                        disabled={customRolesPage >= totalCustomPages - 1}
                      >
                        <FaChevronRight />
                      </PaginationButton>
                    </PaginationControls>
                  )}
                </>
              )}
            </RoleList>
          </SidebarSection>
        </Sidebar>

        <Content
          ref={memberListRef}
          style={{ maxHeight: memberListHeight }}
        >
          <ContentHeader>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
                {selectedRole?.name}
              </h2>
              <div style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
                {selectedRole?.members} thành viên
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                $variant="secondary"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <FaEdit /> Chỉnh sửa quyền
              </Button>
              {!selectedRole?.isDefault && (
                <Button
                  $variant="secondary"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <FaTrash /> Xóa
                </Button>
              )}
            </div>
          </ContentHeader>

          <Panel>
            <SectionTitle>Thành viên</SectionTitle>
            <MemberList>
              {members.length === 0 && (
                <div style={{ color: "#9ca3af", textAlign: "center", padding: "1rem" }}>
                  Không có thành viên
                </div>
              )}
              {paginatedMembers.map((m) => (
                <MemberRow key={m.id}>
                  <Avatar>
                    {m.name.split(" ").pop()?.charAt(0) ?? m.name.charAt(0)}
                  </Avatar>
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    {m.email && (
                      <div style={{ color: "#6b7280", fontSize: 13 }}>
                        {m.email}
                      </div>
                    )}
                  </div>
                </MemberRow>
              ))}
            </MemberList>

            {totalMemberPages > 1 && (
              <PaginationControls>
                <PaginationButton
                  onClick={() => setMembersPage((p) => Math.max(0, p - 1))}
                  disabled={membersPage === 0}
                >
                  <FaChevronLeft />
                </PaginationButton>
                <PageInfo>
                  {membersPage + 1} / {totalMemberPages}
                </PageInfo>
                <PaginationButton
                  onClick={() =>
                    setMembersPage((p) => Math.min(totalMemberPages - 1, p + 1))
                  }
                  disabled={membersPage >= totalMemberPages - 1}
                >
                  <FaChevronRight />
                </PaginationButton>
              </PaginationControls>
            )}
          </Panel>
        </Content>
      </FlexLayout>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              Chỉnh sửa quyền hạn - {selectedRole?.name}
            </ModalHeader>
            <ModalBody>
              <ModalColumns>
                <PermissionsColumn style={{ flex: 1 }}>
                  {permissionGroups.map((group) => (
                    <PermissionGroup key={group.title}>
                      <GroupTitle>{group.title}</GroupTitle>
                      {group.items.map((item) => (
                        <PermissionRow key={item}>
                          <div>{item}</div>
                          {item === "Read only" ? (
                            <ToggleSwitch>
                              <input type="checkbox" checked disabled />
                              <span />
                            </ToggleSwitch>
                          ) : (
                            <ToggleSwitch>
                              <input type="checkbox" defaultChecked />
                              <span />
                            </ToggleSwitch>
                          )}
                        </PermissionRow>
                      ))}
                    </PermissionGroup>
                  ))}
                </PermissionsColumn>
              </ModalColumns>

              <ModalFooter>
                <Button $variant="secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </Button>
                <Button
                  $variant="primary"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  Cập nhật
                </Button>
              </ModalFooter>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {showDeleteConfirm && (
        <ModalOverlay onClick={() => setShowDeleteConfirm(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>Xác nhận xóa</ModalHeader>
            <ModalBody>
              <div style={{ marginBottom: 12 }}>
                Bạn có chắc muốn xóa vai trò "{selectedRole?.name}"? Hành động
                này không thể hoàn tác.
              </div>
              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
              >
                <Button
                  $variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Hủy
                </Button>
                <Button
                  $variant="primary"
                  onClick={() => {
                    setRolesState((prev) => {
                      const next = prev.filter(
                        (r) => r.id !== (selectedRole?.id ?? -1)
                      );
                      const nextId = next.length > 0 ? next[0].id : null;
                      setSelectedRoleId(nextId);
                      return next;
                    });
                    setShowDeleteConfirm(false);
                  }}
                >
                  Xóa
                </Button>
              </div>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {showCreateModal && (
        <ModalOverlay onClick={() => setShowCreateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>Tạo vai trò tùy chỉnh</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Tên vai trò</Label>
                <Input
                  value={roleNameInput}
                  onChange={(e) => setRoleNameInput(e.target.value)}
                  placeholder="Nhập tên vai trò"
                />
              </FormGroup>

              <FormGroup>
                <Label>Màu vai trò</Label>
                <ColorInput
                  type="color"
                  value={roleColorInput}
                  onChange={(e) => setRoleColorInput(e.target.value)}
                />
              </FormGroup>

              <ModalFooter>
                <Button
                  $variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </Button>
                <Button
                  $variant="primary"
                  onClick={() => {
                    const name = roleNameInput.trim() || "New Custom Role";
                    const maxId = rolesState.reduce(
                      (acc, r) => Math.max(acc, r.id),
                      0
                    );
                    const newRole: Role = {
                      id: maxId + 1,
                      name,
                      color: roleColorInput,
                      members: 0,
                      isDefault: false,
                    };
                    setRolesState((prev) => [...prev, newRole]);
                    setRoleNameInput("");
                    setShowCreateModal(false);
                    setSelectedRoleId(newRole.id);
                  }}
                >
                  Tạo
                </Button>
              </ModalFooter>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default RolesPage;
import { useState } from 'react';
import { Eye, Download, Printer, AlertCircle, ChevronDown } from 'lucide-react';
import UserHistoryDetails from './UserHistoryDetails';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';

interface TestRecord {
  id: string;
  orderDate: string;
  orderTime: string;
  dueDate: string;
  dueTime: string;
  status: 'pending' | 'inProgress' | 'completed' | 'cancelled';
  doctor: string;
  quantity: string;
  notes: string;
  actions?: string;
}

const UserHistory = () => {
  const [selectedTab, setSelectedTab] = useState<'info' | 'alert' | 'history'>('info');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTestOrder, setSelectedTestOrder] = useState<string>('');


  const testRecords: TestRecord[] = [
    {
      id: 'TO-2025-001234',
      orderDate: '2025-03-15',
      orderTime: '09:30',
      dueDate: '2025-03-15',
      dueTime: '10:15',
      status: 'completed',
      doctor: 'BS. Nguyễn Văn A',
      quantity: 'Syringe 900',
      notes: '',
      actions: 'view'
    },
    {
      id: 'TO-2025-001189',
      orderDate: '2025-02-28',
      orderTime: '14:20',
      dueDate: '2025-02-28',
      dueTime: '15:10',
      status: 'completed',
      doctor: 'BS. Trần Thị B',
      quantity: 'Syringe 900',
      notes: '',
      actions: 'view'
    },
    {
      id: 'TO-2025-000656',
      orderDate: '2025-01-20',
      orderTime: '11:45',
      dueDate: '—',
      dueTime: '—',
      status: 'cancelled',
      doctor: 'BS. Lê Huy',
      quantity: 'N/A',
      notes: '',
      actions: 'view'
    },
    {
      id: 'TO-2024-008470',
      orderDate: '2024-12-10',
      orderTime: '08:15',
      dueDate: '2024-12-10',
      dueTime: '09:00',
      status: 'completed',
      doctor: 'BS. Phạm Thị D',
      quantity: 'Syringe 900-540',
      notes: '',
      actions: 'view'
    },
  ];

  const stats = [
    { label: 'Tổng số lần xét nghiệm', value: 4, color: '#de1919' },
    { label: 'Đã hoàn thành', value: 3, color: '#52C41A' },
    { label: 'Lần gần nhất', value: '2025-03-15 09:30', color: '#262626' },
  ];

  const parameters = [
    { name: 'WBC', value: '11.2K', unit: 'cells/μL', change: '+10%', changeType: 'up' },
    { name: 'RBC', value: '5.2M', unit: 'million', change: '–6%', changeType: 'down' },
    { name: 'Hb', value: '11.5', unit: 'g/dL', change: '–3%', changeType: 'down' },
    { name: 'PLT', value: '250K', unit: 'cells/μL', change: '+2%', changeType: 'up' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#52C41A';
      case 'inProgress':
        return '#1890FF';
      case 'pending':
        return '#FAAD14';
      case 'cancelled':
        return '#FF4D4F';
      default:
        return '#8C8C8C';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Đã hoàn thành';
      case 'inProgress':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div style={{ display: 'flex', background: '#f5f5f5', minHeight: '100vh', padding: 0 }}>
      <UserSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <UserHeader />
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {/* Main Title */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#262626', margin: 0, marginBottom: '8px' }}>Hồ sơ người dùng</h1>
            <p style={{ fontSize: '14px', color: '#8C8C8C', margin: 0 }}>Quản lý thông tin tài khoản và cài đặt bảo mật của bạn</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: '24px', borderBottom: '1px solid #E5E5E5' }}>
            {[
              { id: 'info', label: 'Thông tin cá nhân', icon: '👤' },
              { id: 'alert', label: 'Bảo mật', icon: '🔒' },
              { id: 'history', label: 'Lịch sử xét nghiệm', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: selectedTab === tab.id ? '#de1919' : '#8C8C8C',
                  borderBottom: selectedTab === tab.id ? '2px solid #de1919' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  marginBottom: '-1px'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

      {/* Content based on selected tab */}
      {selectedTab === 'history' && (
        <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '24px' }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  backgroundColor: '#FAFAFA'
                }}
              >
                <p style={{
                  fontSize: '12px',
                  color: '#8C8C8C',
                  margin: '0 0 8px 0',
                  fontWeight: 500
                }}>
                  {stat.label}
                </p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: stat.color,
                  margin: 0
                }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Parameters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {parameters.map((param, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  backgroundColor: '#fff'
                }}
              >
                <p style={{
                  fontSize: '12px',
                  color: '#8C8C8C',
                  margin: '0 0 4px 0',
                  fontWeight: 500
                }}>
                  {param.name}
                </p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#262626',
                  margin: '0 0 4px 0'
                }}>
                  {param.value}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#8C8C8C'
                  }}>
                    {param.unit}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: param.changeType === 'up' ? '#F5222D' : '#52C41A',
                    fontWeight: 500
                  }}>
                    {param.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Alert Box */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#FFFBE6',
            border: '1px solid #FFE58F',
            borderRadius: '4px',
            display: 'flex',
            gap: '12px',
            marginBottom: '32px'
          }}>
            <AlertCircle size={20} style={{ color: '#FAAD14', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, color: '#262626', fontSize: '14px' }}>
                Chỉ số căn bản ý
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#8C8C8C' }}>
                WBC: 11,000 cells/μL (↑ cao hơn bình thường); Hb: 11.5 g/dL (↓ thấp hơn bình thường)
              </p>
            </div>
          </div>

          {/* Table Section Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #E5E5E5'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#262626',
              margin: 0
            }}>
              📋 Lịch sử xét nghiệm mẫu
            </h2>
          </div>

          {/* Filters and Search */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: 1,
              minWidth: '200px',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #D9D9D9',
              borderRadius: '4px',
              padding: '0 12px'
            }}>
              <input
                type="text"
                placeholder="Tìm theo Test Order ID..."
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  padding: '8px 0',
                  fontSize: '14px'
                }}
              />
              <span style={{ color: '#8C8C8C' }}>🔍</span>
            </div>
            <button style={{
              padding: '8px 12px',
              border: '1px solid #D9D9D9',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}>
              <ChevronDown size={14} />
              Tất cả
            </button>
            <button style={{
              padding: '8px 12px',
              border: '1px solid #D9D9D9',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}>
              🔽 Tất cả
            </button>
          </div>

          {/* Table */}
          <div style={{
            overflowX: 'auto',
            border: '1px solid #E5E5E5',
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E5E5E5' }}>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#262626',
                    borderRight: '1px solid #E5E5E5'
                  }}>
                    
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#262626',
                    borderRight: '1px solid #E5E5E5'
                  }}>Test Order ID</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#262626',
                    borderRight: '1px solid #E5E5E5'
                  }}>Ngày lập tờ</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#262626',
                    borderRight: '1px solid #E5E5E5'
                  }}>Thực hiện</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#262626',
                    borderRight: '1px solid #E5E5E5'
                  }}>Trạng thái</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#262626',
                    borderRight: '1px solid #E5E5E5'
                  }}>Người thực hiện</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#262626',
                    borderRight: '1px solid #E5E5E5'
                  }}>Thiết bị</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#262626'
                  }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {testRecords.map((record, idx) => (
                  <tr key={record.id} style={{
                    borderBottom: '1px solid #E5E5E5',
                    backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA'
                  }}>
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #E5E5E5'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(record.id)}
                        onChange={() => setSelectedRows(prev =>
                          prev.includes(record.id) ? prev.filter(id => id !== record.id) : [...prev, record.id]
                        )}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #E5E5E5',
                      fontWeight: 500,
                      color: '#262626'
                    }}>
                      {record.id}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #E5E5E5',
                      color: '#262626'
                    }}>
                      <div>{record.orderDate}</div>
                      <div style={{ fontSize: '12px', color: '#8C8C8C' }}>{record.orderTime}</div>
                    </td>
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #E5E5E5',
                      color: '#262626'
                    }}>
                      <div>{record.dueDate}</div>
                      <div style={{ fontSize: '12px', color: '#8C8C8C' }}>{record.dueTime}</div>
                    </td>
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #E5E5E5'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: getStatusColor(record.status) + '20',
                        color: getStatusColor(record.status),
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        {getStatusLabel(record.status)}
                      </span>
                    </td>
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #E5E5E5',
                      color: '#262626'
                    }}>
                      {record.doctor}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #E5E5E5',
                      color: '#262626'
                    }}>
                      {record.quantity}
                    </td>
                    <td style={{
                      padding: '12px',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => {
                          setSelectedTestOrder(record.id);
                          setDetailsModalOpen(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Eye size={16} color="#1890FF" />
                      </button>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}>
                        <Download size={16} color="#8C8C8C" />
                      </button>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}>
                        ⋯
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0'
          }}>
            <span style={{
              fontSize: '12px',
              color: '#8C8C8C'
            }}>
              Hiển thị 1-4 trong tổng số 4 kết quả
            </span>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button style={{
                padding: '8px 12px',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#262626'
              }}>
                <Download size={14} />
                Export Excel
              </button>
              <button style={{
                padding: '8px 12px',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#262626'
              }}>
                <Printer size={14} />
                In báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'info' && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#8C8C8C'
        }}>
          <p>Thông tin cá nhân sẽ được hiển thị ở đây</p>
        </div>
      )}

      {selectedTab === 'alert' && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#8C8C8C'
        }}>
          <p>Cảnh báo bảo mật sẽ được hiển thị ở đây</p>
        </div>
      )}

          {/* Modal for test details */}
          <UserHistoryDetails
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            testOrderId={selectedTestOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default UserHistory;


import { X, Mail, Printer, FileText, AlertCircle, CheckCircle, AlertTriangle, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface TestResult {
  name: string;
  code: string;
  value: number | string;
  unit: string;
  minValue: string;
  maxValue: string;
  status: 'normal' | 'warning' | 'critical';
  comment?: string;
}

interface UserHistoryDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  testOrderId?: string;
}

const UserHistoryDetails: React.FC<UserHistoryDetailsProps> = ({
  isOpen,
  onClose,
  testOrderId = 'TO-2025-001234'
}) => {
  const [activeTab, setActiveTab] = useState<'results' | 'trend' | 'info' | 'notes'>('results');
  const [noteText, setNoteText] = useState<string>('');
  const [notes, setNotes] = useState<Array<{ id: number; author: string; date: string; text: string }>>([
    {
      id: 1,
      author: 'BS. Trần Thị C',
      date: '2025-03-15 10:45',
      text: 'Bệnh nhân cần tái khám sau 2 tuần để kiểm tra lại chỉ số WBC'
    }
  ]);

  const testResults: TestResult[] = [
    {
      name: 'White Blood Cell Count',
      code: 'WBC',
      value: 11.200,
      unit: 'cells/μL',
      minValue: '4,000-11,000',
      maxValue: '',
      status: 'warning',
      comment: 'Cao hơn bình thường'
    },
    {
      name: 'Red Blood Cell Count',
      code: 'RBC',
      value: 5.3,
      unit: 'million/μL',
      minValue: '4.7-6.1',
      maxValue: '',
      status: 'normal',
      comment: 'Bình thường'
    },
    {
      name: 'Hemoglobin',
      code: 'WBC',
      value: 11.5,
      unit: 'g/dL',
      minValue: '14-18',
      maxValue: '(Nam)',
      status: 'critical',
      comment: 'Sâu thường'
    },
    {
      name: 'Hematocrit',
      code: 'WBC',
      value: 45,
      unit: '%',
      minValue: '42-52',
      maxValue: '(Nam)',
      status: 'normal',
      comment: 'Bình thường'
    },
    {
      name: 'Platelet Count',
      code: 'WBC',
      value: 250000,
      unit: 'cells/μL',
      minValue: '150,000-350,000',
      maxValue: '',
      status: 'normal',
      comment: 'Bình thường'
    },
    {
      name: 'Mean Corpuscular Volume',
      code: 'WBC',
      value: 88,
      unit: 'fL',
      minValue: '80-100',
      maxValue: '',
      status: 'normal',
      comment: 'Bình thường'
    },
    {
      name: 'Mean Corpuscular Haemoglobin',
      code: 'WBC',
      value: 30,
      unit: 'pg',
      minValue: '27-33',
      maxValue: '',
      status: 'normal',
      comment: 'Bình thường'
    },
    {
      name: 'Mean Corpuscular Haemoglobin Concentration',
      code: 'WBC',
      value: 34,
      unit: 'g/dL',
      minValue: '32-36',
      maxValue: '',
      status: 'normal',
      comment: 'Bình thường'
    },
  ];

  const abnormalWarnings = [
    {
      type: 'warning',
      items: [
        { date: '2025-03-15 10:30', param: 'WBC', issue: 'Hemoglobin below normal range - possible anemia' },
      ]
    },
    {
      type: 'info',
      items: [
        { date: '2025-03-15 10:30', param: 'WBC', issue: 'Sample slightly hemolyzed - results may be affected' },
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle size={16} color="#52C41A" />;
      case 'warning':
        return <AlertTriangle size={16} color="#FAAD14" />;
      case 'critical':
        return <AlertCircle size={16} color="#FF4D4F" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#52C41A';
      case 'warning':
        return '#FAAD14';
      case 'critical':
        return '#FF4D4F';
      default:
        return '#8C8C8C';
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E5E5E5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: '#262626'
            }}>
              Chi tiết kết quả xét nghiệm
            </h2>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#8C8C8C'
            }}>
              Test Order ID: {testOrderId}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#8C8C8C'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E5E5E5',
          padding: '0 24px',
          gap: '0'
        }}>
          {[
            { id: 'results', label: 'Kết quả CBC' },
            { id: 'trend', label: 'Xu hướng' },
            { id: 'info', label: 'Thông tin' },
            { id: 'notes', label: 'Ghi chú' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 0',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                color: activeTab === tab.id ? '#de1919' : '#8C8C8C',
                borderBottom: activeTab === tab.id ? '2px solid #de1919' : 'none',
                marginBottom: '-1px',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {activeTab === 'results' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#262626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  ⬇️ Kết quả Complete Blood Count (CBC)
                </h3>
                <p style={{
                  margin: '0 0 12px 0',
                  fontSize: '12px',
                  color: '#8C8C8C'
                }}>
                  Ngày thực hiện: 2025-03-15 10:15
                </p>

                {}
                <div style={{
                  overflowX: 'auto',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px'
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
                        }}>Chỉ số</th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: '#262626',
                          borderRight: '1px solid #E5E5E5'
                        }}>Vị trí</th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: '#262626',
                          borderRight: '1px solid #E5E5E5'
                        }}>Kết quả</th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: '#262626',
                          borderRight: '1px solid #E5E5E5'
                        }}>Đơn vị</th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: '#262626',
                          borderRight: '1px solid #E5E5E5'
                        }}>Khoảng bình thường</th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: '#262626'
                        }}>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults.map((result, idx) => (
                        <tr key={idx} style={{
                          borderBottom: '1px solid #E5E5E5',
                          backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA'
                        }}>
                          <td style={{
                            padding: '12px',
                            borderRight: '1px solid #E5E5E5',
                            fontWeight: 500,
                            color: '#262626'
                          }}>
                            {result.name}
                          </td>
                          <td style={{
                            padding: '12px',
                            borderRight: '1px solid #E5E5E5',
                            color: '#262626'
                          }}>
                            {result.code}
                          </td>
                          <td style={{
                            padding: '12px',
                            borderRight: '1px solid #E5E5E5',
                            fontWeight: 500,
                            color: '#262626'
                          }}>
                            {typeof result.value === 'number' ? result.value.toLocaleString() : result.value}
                          </td>
                          <td style={{
                            padding: '12px',
                            borderRight: '1px solid #E5E5E5',
                            color: '#262626'
                          }}>
                            {result.unit}
                          </td>
                          <td style={{
                            padding: '12px',
                            borderRight: '1px solid #E5E5E5',
                            color: '#262626',
                            fontSize: '12px'
                          }}>
                            {result.minValue} {result.maxValue}
                          </td>
                          <td style={{
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            {getStatusIcon(result.status)}
                            <span style={{ fontSize: '12px', color: getStatusColor(result.status), fontWeight: 500 }}>
                              {result.comment}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {}
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: '#FFFBE6',
                  border: '1px solid #FFE58F',
                  borderRadius: '4px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <AlertTriangle size={18} style={{ color: '#FAAD14', flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 500, color: '#262626', fontSize: '13px' }}>
                      Tóm tắt các chỉ số có liên tưởng
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#262626', fontSize: '12px' }}>
                      <li>WBC: 11,200 cells/μL - cao hơn giới hạn (10,000)</li>
                      <li>Hemoglobin: 11.5 g/dL... - thấp hơn giới hạn (14 g/dL)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#262626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  Cảnh báo từ thiết bị
                </h3>

                {abnormalWarnings.map((warningGroup, groupIdx) => (
                  <div key={groupIdx} style={{ marginBottom: '12px' }}>
                    {warningGroup.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: warningGroup.type === 'warning' ? '#FFF1F0' : '#E6F7FF',
                          border: `1px solid ${warningGroup.type === 'warning' ? '#FFCCC7' : '#BAE7FF'}`,
                          borderRadius: '4px',
                          marginBottom: '8px',
                          display: 'flex',
                          gap: '12px'
                        }}
                      >
                        {warningGroup.type === 'warning' ? (
                          <AlertTriangle size={16} style={{ color: '#FF4D4F', flexShrink: 0, marginTop: '2px' }} />
                        ) : (
                          <AlertCircle size={16} style={{ color: '#1890FF', flexShrink: 0, marginTop: '2px' }} />
                        )}
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontWeight: 500, color: '#262626', fontSize: '12px' }}>
                            {item.param} · {item.date}
                          </p>
                          <p style={{ margin: 0, color: '#262626', fontSize: '12px' }}>
                            {item.issue}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'trend' && (
            <div>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                fontWeight: 600,
                color: '#262626',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Biểu đồ xu hướng theo thời gian
              </h3>
              <p style={{
                margin: '0 0 16px 0',
                fontSize: '12px',
                color: '#8C8C8C'
              }}>
                Chuyên tiên các chỉ số đã lấy từ lần xét nghiệm trước, đó
              </p>

              {/* Parameter Legend */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '16px',
                flexWrap: 'wrap'
              }}>
                {[
                  { label: 'WBC', color: '#de1919' },
                  { label: 'RBC', color: '#52C41A' },
                  { label: 'Hb/HGB', color: '#1890FF' },
                  { label: 'HCT', color: '#FAAD14' }
                ].map((param) => (
                  <div key={param.label} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#262626'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: param.color
                    }}></div>
                    {param.label}
                  </div>
                ))}
              </div>

              {/* Chart Container */}
              <div style={{
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                padding: '16px',
                backgroundColor: '#fff',
                marginBottom: '16px'
              }}>
                <svg viewBox="0 0 800 300" style={{ width: '100%', height: '300px' }}>
                  {/* Grid lines */}
                  <line x1="60" y1="20" x2="60" y2="240" stroke="#E5E5E5" strokeWidth="1" />
                  <line x1="60" y1="240" x2="780" y2="240" stroke="#E5E5E5" strokeWidth="1" />
                  
                  {/* Y-axis labels */}
                  <text x="40" y="245" fontSize="11" fill="#8C8C8C" textAnchor="end">0</text>
                  <text x="40" y="180" fontSize="11" fill="#8C8C8C" textAnchor="end">3000</text>
                  <text x="40" y="120" fontSize="11" fill="#8C8C8C" textAnchor="end">6000</text>
                  <text x="40" y="60" fontSize="11" fill="#8C8C8C" textAnchor="end">9000</text>
                  <text x="40" y="30" fontSize="11" fill="#8C8C8C" textAnchor="end">12000</text>

                  {/* Grid horizontal lines */}
                  <line x1="60" y1="60" x2="780" y2="60" stroke="#E5E5E5" strokeDasharray="2,2" strokeWidth="0.5" />
                  <line x1="60" y1="120" x2="780" y2="120" stroke="#E5E5E5" strokeDasharray="2,2" strokeWidth="0.5" />
                  <line x1="60" y1="180" x2="780" y2="180" stroke="#E5E5E5" strokeDasharray="2,2" strokeWidth="0.5" />

                  {/* WBC Line (Red) */}
                  <polyline
                    points="100,180 250,175 400,170 550,160 700,155"
                    fill="none"
                    stroke="#de1919"
                    strokeWidth="2"
                  />
                  {/* WBC Circle Points */}
                  {[100, 250, 400, 550, 700].map((x) => (
                    <circle key={`wbc-${x}`} cx={x} cy={180} r="3" fill="#de1919" />
                  ))}

                  {/* Hb/HGB Line (Blue) */}
                  <polyline
                    points="100,200 250,190 400,185 550,175 700,170"
                    fill="none"
                    stroke="#1890FF"
                    strokeWidth="2"
                  />
                  {/* Hb/HGB Circle Points */}
                  {[100, 250, 400, 550, 700].map((x) => (
                    <circle key={`hb-${x}`} cx={x} cy={200} r="3" fill="#1890FF" />
                  ))}

                  {/* X-axis dates */}
                  <text x="100" y="270" fontSize="11" fill="#8C8C8C" textAnchor="middle">10/1/2024</text>
                  <text x="250" y="270" fontSize="11" fill="#8C8C8C" textAnchor="middle">20/1/2025</text>
                  <text x="400" y="270" fontSize="11" fill="#8C8C8C" textAnchor="middle">28/2/2025</text>
                  <text x="550" y="270" fontSize="11" fill="#8C8C8C" textAnchor="middle"></text>
                  <text x="700" y="270" fontSize="11" fill="#8C8C8C" textAnchor="middle">15/3/2025</text>

                  {/* Legend */}
                  <text x="600" y="30" fontSize="12" fill="#de1919" fontWeight="500">━ WBC</text>
                  <text x="650" y="30" fontSize="12" fill="#1890FF" fontWeight="500">━ Hb/HGB</text>
                </svg>
              </div>

              {/* Parameter Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px'
              }}>
                {[
                  { name: 'WBC', change: '+18.2%', status: 'up' },
                  { name: 'RBC', change: '+2.5%', status: 'up' },
                  { name: 'Hb/HGB', change: '-10.8%', status: 'down' },
                  { name: 'HCT', change: '+2.2%', status: 'up' }
                ].map((param) => (
                  <div
                    key={param.name}
                    style={{
                      padding: '12px',
                      border: '1px solid #E5E5E5',
                      borderRadius: '4px',
                      backgroundColor: '#FAFAFA',
                      textAlign: 'center'
                    }}
                  >
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#8C8C8C', fontWeight: 500 }}>
                      Số của chỉ trước
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#262626' }}>
                      {param.name}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      fontWeight: 500,
                      color: param.status === 'up' ? '#F5222D' : '#52C41A'
                    }}>
                      {param.change}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#262626'
                }}>
                  📋 Thông tin xét nghiệm
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px'
                }}>
                  {[
                    { label: 'Ngày lấy mẫu', value: '2025-03-15 09:30' },
                    { label: 'Ngày nhận mẫu', value: '2025-03-15 09:35' },
                    { label: 'Ngày hoàn thành', value: '2025-03-15 10:30' },
                    { label: 'Loại mẫu', value: 'Máu toàn bộ (EDTA)' },
                    { label: 'Địa điểm lấy mẫu', value: 'Phòng xét nghiệm - Tòa nhà A' },
                    { label: 'Người lấy mẫu', value: 'BS. Nguyễn Văn A' },
                    { label: 'Kỹ thuật viên phân tích', value: 'Kỹ thuật viên B' },
                    { label: 'Bác sĩ xác nhận', value: 'BS. Trần Thị C' }
                  ].map((item) => (
                    <div key={item.label} style={{
                      padding: '12px',
                      border: '1px solid #E5E5E5',
                      borderRadius: '4px',
                      backgroundColor: '#FAFAFA'
                    }}>
                      <p style={{
                        margin: '0 0 8px 0',
                        fontSize: '12px',
                        color: '#8C8C8C',
                        fontWeight: 500
                      }}>
                        {item.label}
                      </p>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#262626',
                        fontWeight: 500
                      }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#262626'
                }}>
                  📝 Ghi chú và nhận xét
                </h3>

                <div style={{
                  padding: '16px',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                  backgroundColor: '#FAFAFA',
                  minHeight: '120px'
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#262626',
                    lineHeight: '1.6'
                  }}>
                    Kết quả xét nghiệm cho thấy chỉ số WBC cao hơn mức bình thường, điều này có thể chỉ ra tình trạng viêm nhiễm hoặc phản ứng miễn dịch. Hemoglobin và Hematocrit thấp hơn mức bình thường, gợi ý có khả năng thiếu máu. Khuyến cáo bệnh nhân nên tái khám và làm thêm các xét nghiệm chuyên sâu để xác định nguyên nhân chính xác.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#262626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📝 Ghi chú
                </h3>

                {/* Add Note Form */}
                <div style={{
                  padding: '16px',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                  backgroundColor: '#FAFAFA',
                  marginBottom: '24px'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#262626',
                    marginBottom: '8px'
                  }}>
                    Thêm ghi chú mới
                  </label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Nhập ghi chú của bạn..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D9D9D9',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#262626',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      minHeight: '100px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#de1919';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#D9D9D9';
                    }}
                  />
                  <button
                    onClick={() => {
                      if (noteText.trim()) {
                        const newNote = {
                          id: Date.now(),
                          author: 'Bạn',
                          date: new Date().toLocaleString('vi-VN'),
                          text: noteText
                        };
                        setNotes([newNote, ...notes]);
                        setNoteText('');
                      }
                    }}
                    style={{
                      marginTop: '12px',
                      padding: '8px 16px',
                      backgroundColor: '#de1919',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#c41515';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#de1919';
                    }}
                  >
                    <Send size={14} />
                    Thêm ghi chú
                  </button>
                </div>

                {/* Notes List */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {notes.length > 0 ? (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        style={{
                          padding: '16px',
                          border: '1px solid #E5E5E5',
                          borderRadius: '4px',
                          backgroundColor: '#fff'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px'
                        }}>
                          <div>
                            <p style={{
                              margin: '0 0 4px 0',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#262626'
                            }}>
                              {note.author}
                            </p>
                            <p style={{
                              margin: 0,
                              fontSize: '11px',
                              color: '#8C8C8C'
                            }}>
                              {note.date}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setNotes(notes.filter((n) => n.id !== note.id));
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              color: '#8C8C8C',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#FF4D4F';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#8C8C8C';
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p style={{
                          margin: 0,
                          fontSize: '13px',
                          color: '#262626',
                          lineHeight: '1.6'
                        }}>
                          {note.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{
                      textAlign: 'center',
                      color: '#8C8C8C',
                      fontSize: '13px',
                      padding: '24px'
                    }}>
                      Chưa có ghi chú nào. Thêm ghi chú đầu tiên của bạn.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E5E5E5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FAFAFA'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #D9D9D9',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              color: '#262626'
            }}
          >
            Đóng
          </button>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button style={{
              padding: '8px 16px',
              border: '1px solid #D9D9D9',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#262626'
            }}>
              <Mail size={14} />
              Gửi Email
            </button>
            <button style={{
              padding: '8px 16px',
              border: '1px solid #D9D9D9',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#262626'
            }}>
              <Printer size={14} />
              In kết quả
            </button>
            <button style={{
              padding: '8px 16px',
              border: '1px solid #D9D9D9',
              borderRadius: '4px',
              backgroundColor: '#de1919',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: 500
            }}>
              <FileText size={14} />
              Tải PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHistoryDetails;

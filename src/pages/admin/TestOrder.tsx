import { useState } from "react";
import {
  FileText,
  User,
  Calendar,
  Activity,
  Search,
  Download,
  Check,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface TestResult {
  id: string;
  testName: string;
  result: string;
  status: "completed" | "pending" | "processing";
  date: string;
  normalRange?: string;
  unit?: string;
}

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  date: string;
  confirmed: boolean;
}

const TestOrder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string>("PT-001");
  const [confirmationFilter, setConfirmationFilter] = useState<string>("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const patientsPerPage = 4;

  const [patients, setPatients] = useState<PatientInfo[]>([
    { id: "PT-001", name: "Nguyễn Văn A", age: 35, gender: "Nam", date: "2024-01-15", confirmed: false },
    { id: "PT-002", name: "Trần Thị B", age: 28, gender: "Nữ", date: "2024-01-16", confirmed: true },
    { id: "PT-003", name: "Lê Văn C", age: 42, gender: "Nam", date: "2024-01-16", confirmed: false },
    { id: "PT-004", name: "Phạm Thị D", age: 31, gender: "Nữ", date: "2024-01-17", confirmed: true },
    { id: "PT-005", name: "Hoàng Văn E", age: 55, gender: "Nam", date: "2024-01-17", confirmed: false }
  ]);

  const allTestResults: Record<string, TestResult[]> = {
    "PT-001": [
      { id: "TR-001", testName: "Công thức máu", result: "Bình thường", status: "completed", date: "2024-01-15", normalRange: "4.5-5.5", unit: "x10^6/μL" },
      { id: "TR-002", testName: "Glucose máu", result: "95", status: "completed", date: "2024-01-15", normalRange: "70-100", unit: "mg/dL" },
      { id: "TR-003", testName: "Cholesterol", result: "180", status: "completed", date: "2024-01-15", normalRange: "<200", unit: "mg/dL" }
    ],
    "PT-002": [
      { id: "TR-004", testName: "Chức năng gan", result: "Đang xử lý", status: "processing", date: "2024-01-16" },
      { id: "TR-005", testName: "Glucose máu", result: "88", status: "completed", date: "2024-01-16", normalRange: "70-100", unit: "mg/dL" }
    ],
    "PT-003": [
      { id: "TR-006", testName: "Chức năng thận", result: "Chờ kết quả", status: "pending", date: "2024-01-16" },
      { id: "TR-007", testName: "Công thức máu", result: "Bình thường", status: "completed", date: "2024-01-16" }
    ],
    "PT-004": [
      { id: "TR-008", testName: "Cholesterol", result: "195", status: "completed", date: "2024-01-17", normalRange: "<200", unit: "mg/dL" }
    ],
    "PT-005": [
      { id: "TR-009", testName: "Glucose máu", result: "Đang xử lý", status: "processing", date: "2024-01-17" }
    ]
  };

  const confirmPatient = (patientId: string) => {
    setPatients(prevPatients =>
      prevPatients.map(p =>
        p.id === patientId ? { ...p, confirmed: true } : p
      )
    );
  };

  const deletePatient = (patientId: string) => {
    setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
    if (selectedPatient === patientId && patients.length > 1) {
      const remainingPatients = patients.filter(p => p.id !== patientId);
      setSelectedPatient(remainingPatients[0]?.id || "");
    }
    setShowDeleteConfirm(null);

    if (paginatedPatients.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredPatients = patients.filter(patient => {
    if (confirmationFilter === "confirmed" && !patient.confirmed) {
      return false;
    }
    if (confirmationFilter === "unconfirmed" && patient.confirmed) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const startIndex = (currentPage - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  const currentPatient = filteredPatients.find(p => p.id === selectedPatient);
  const testResults = allTestResults[selectedPatient] || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "status-badge status-completed",
      processing: "status-badge status-processing",
      pending: "status-badge status-pending"
    };
    const labels = {
      completed: "Hoàn thành",
      processing: "Đang xử lý",
      pending: "Chờ kết quả"
    };
    return (
      <span className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredResults = testResults.filter(test =>
    test.testName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background: #f5f5f5;
          color: #333;
        }

        .app {
          min-height: auto;
          background: #f5f5f5;
        }

        .btn-add{
          margin-left: 30px;
          border-radius: 8px;
          background: #f1a6a6ff;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 16px;
          cursor: pointer;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #333;
          transition: all 0.2s;
        }

        .btn-add:hover {
          background: #e89595;
        }

        .header {
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          background: white;
        }

        .header-content {
          max-width: 2000px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
        }

        .header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #271111ff;
        }

        .search-test{
          margin-left: 30px;
        }

        .btn {
          margin-left: 30px;
          color: white;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          padding: 10px 16px;
          cursor: pointer;
        }

        .btn {
          background: #C51F1F;
        }

        .btn:hover {
          background: #c51f1f93;
        }

        .btn-outline {
          background: white;
          border: 1px solid #490808ff;
          color: #C51F1F;
        }

        .btn-outline:hover {
          background: #f9fafb;
        }

        .btn-success {
          background: #16a34a;
          color: white;
          border: none;
        }

        .btn-success:hover {
          background: #15803d;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
          border: none;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }

        .btn-small {
          padding: 6px 12px;
          font-size: 13px;
          margin-left: 0;
        }

        .main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px;
        }

        .grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 24px;
        }

        .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .card-body {
          padding: 16px;
        }

        .card-header {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .card-header h2 {
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #111827;
        }

        .patient-list {
          max-height: auto;
          overflow-y: auto;
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          color: #374151;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #C51F1F;
          color: #C51F1F;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .patient-item {
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: background 0.2s;
        }

        .patient-item:hover {
          background: #f9fafb;
        }

        .patient-item.active {
          background: #ce91912d;
          border-left: 4px solid #C51F1F;
        }

        .patient-item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .patient-name {
          font-weight: 500;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .confirmed-badge {
          background: #dcfce7;
          color: #166534;
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
        }

        .unconfirmed-badge {
          background: #fef3c7;
          color: #92400e;
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
        }

        .patient-id {
          font-size: 13px;
          color: #6b7280;
        }

        .patient-age {
          font-size: 12px;
          color: #6b7280;
        }

        .patient-date {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .patient-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .info-item label {
          font-size: 13px;
          color: #6b7280;
          display: block;
          margin-bottom: 4px;
        }

        .info-item p {
          font-weight: 600;
          color: #111827;
        }

        .search-box {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 10px 10px 10px 36px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }

        .search-input:focus {
          border-color: #C51F1F;
          box-shadow: 0 0 0 3px rgba(197, 31, 31, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .date-filter {
          margin-left: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .date-filter select {
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          cursor: pointer;
        }

        .date-filter select:focus {
          border-color: #C51F1F;
          box-shadow: 0 0 0 3px rgba(197, 31, 31, 0.1);
        }

        .right-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .test-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .test-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          transition: box-shadow 0.2s;
        }

        .test-item:hover {
          box-shadow: 0 4px 6px rgba(0,0,0,0.07);
        }

        .test-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .test-name {
          font-size: 16px;
          font-weight: 600;
          flex: 1;
          color: #111827;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-completed {
          background: #dcfce7;
          color: #166534;
        }

        .status-processing {
          background: #fef3c7;
          color: #92400e;
        }

        .status-pending {
          background: #f3f4f6;
          color: #4b5563;
        }

        .test-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .test-detail-item label {
          color: #6b7280;
          display: block;
          margin-bottom: 4px;
        }

        .test-detail-item p {
          font-weight: 500;
          color: #111827;
        }

        .test-normal-range {
          background: #f9fafb;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
        }

        .test-normal-range span {
          color: #6b7280;
        }

        .test-normal-range strong {
          color: #111827;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }

        .empty-icon {
          margin: 0 auto 16px;
          opacity: 0.5;
        }

        .test-actions {
          display: flex;
          align-items: start;
          justify-content: space-between;
        }

        .test-content {
          flex: 1;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #111827;
        }

        .modal p {
          color: #6b7280;
          margin-bottom: 24px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
      `}</style>

      <header className="header">
        <div className="header-content">
          <div className="search-test">
            <div className="search-body">
              <div className="search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>
          <div className="date-filter">
            <Filter size={16} style={{ color: '#C51F1F' }} />
            <select
              value={confirmationFilter}
              onChange={(e) => {
                setConfirmationFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="unconfirmed">Chưa xác nhận</option>
            </select>
          </div>
          <button className="btn-add">
            <Download size={16} />
            Thêm
          </button>

          <button className="btn btn">
            <Download size={16} />
            Xuất báo cáo
          </button>
        </div>
      </header>

      <main className="main">
        <div className="grid">
          <div className="card">
            <div className="card-header">
              <h2>
                <User size={20} style={{ color: '#C51F1F' }} />
                Danh sách bệnh nhân
              </h2>
            </div>
            <div className="patient-list">
              {paginatedPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient.id)}
                  className={`patient-item ${selectedPatient === patient.id ? 'active' : ''}`}
                >
                  <div className="patient-item-header">
                    <div>
                      <div className="patient-name">
                        {patient.name}
                        {patient.confirmed ? (
                          <span className="confirmed-badge">Đã xác nhận</span>
                        ) : (
                          <span className="unconfirmed-badge">Chưa xác nhận</span>
                        )}
                      </div>
                      <div className="patient-id">{patient.id}</div>
                    </div>
                    <div className="patient-age">{patient.age} tuổi</div>
                  </div>
                  <div className="patient-date">
                    <Calendar size={12} />
                    {new Date(patient.date).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="patient-actions" onClick={(e) => e.stopPropagation()}>
                    {!patient.confirmed && (
                      <button
                        className="btn btn-success btn-small"
                        onClick={() => confirmPatient(patient.id)}
                      >
                        <Check size={14} />
                        Xác nhận
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => setShowDeleteConfirm(patient.id)}
                    >
                      <Trash2 size={14} />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
              {filteredPatients.length === 0 && (
                <div className="empty-state">
                  <User size={48} className="empty-icon" />
                  <p>Không tìm thấy bệnh nhân</p>
                </div>
              )}
            </div>
            {filteredPatients.length > patientsPerPage && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="pagination-info">
                  Trang {currentPage} / {totalPages}
                </div>
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="right-content">
            {currentPatient && (
              <>
                <div className="card">
                  <div className="card-header">
                    <h2>Thông tin bệnh nhân</h2>
                  </div>
                  <div className="card-body">
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Mã BN</label>
                        <p>{currentPatient.id}</p>
                      </div>
                      <div className="info-item">
                        <label>Họ tên</label>
                        <p>{currentPatient.name}</p>
                      </div>
                      <div className="info-item">
                        <label>Tuổi</label>
                        <p>{currentPatient.age}</p>
                      </div>
                      <div className="info-item">
                        <label>Giới tính</label>
                        <p>{currentPatient.gender}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="test-list">
                  {filteredResults.map((test) => (
                    <div key={test.id} className="card test-item">
                      <div className="test-actions">
                        <div className="test-content">
                          <div className="test-header">
                            <FileText size={20} style={{ color: '#C51F1F' }} />
                            <div className="test-name">{test.testName}</div>
                            {getStatusBadge(test.status)}
                          </div>
                          <div className="test-details">
                            <div className="test-detail-item">
                              <label>Mã XN</label>
                              <p>{test.id}</p>
                            </div>
                            <div className="test-detail-item">
                              <label>Ngày XN</label>
                              <p>{new Date(test.date).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <div className="test-detail-item">
                              <label>Kết quả</label>
                              <p>{test.result} {test.unit || ""}</p>
                            </div>
                          </div>
                          {test.normalRange && (
                            <div className="test-normal-range">
                              <span>Giá trị bình thường: </span>
                              <strong>{test.normalRange} {test.unit}</strong>
                            </div>
                          )}
                        </div>
                        {test.status === "completed" && (
                          <button className="btn btn-outline">Xem chi tiết</button>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredResults.length === 0 && (
                    <div className="card">
                      <div className="card-body empty-state">
                        <Activity size={48} className="empty-icon" />
                        <p>Không tìm thấy kết quả xét nghiệm</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!currentPatient && (
              <div className="card">
                <div className="card-body empty-state">
                  <User size={48} className="empty-icon" />
                  <p>Chọn bệnh nhân để xem thông tin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa thông tin đặt lịch của bệnh nhân này không?</p>
            <div className="modal-actions">
              <button
                className="btn btn-outline btn-small"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Hủy
              </button>
              <button
                className="btn btn-danger btn-small"
                onClick={() => deletePatient(showDeleteConfirm)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestOrder;

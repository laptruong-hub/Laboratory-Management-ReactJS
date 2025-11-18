import { Activity, Pill, Scissors, AlertCircle } from "lucide-react";

interface MedicalHistoryTabProps {
  chronicDiseases: string;
  currentMedication: string;
  surgicalHistory: string;
  drugAllergies: string;
}

const MedicalHistoryTab = ({ 
  chronicDiseases, 
  currentMedication, 
  surgicalHistory, 
  drugAllergies 
}: MedicalHistoryTabProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        border: '1px solid #E5E5E5',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Activity size={20} color="#de1919ff" />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#262626', margin: 0 }}>
            Bệnh mạn tính
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: '#8C8C8C', marginBottom: '16px' }}>
          Các bệnh lý mạn tính đang điều trị
        </p>
        <p style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#262626',
          backgroundColor: '#FAFAFA',
          padding: '16px',
          borderRadius: '4px',
          margin: 0,
          minHeight: '100px'
        }}>
          {chronicDiseases || "Không có bệnh mạn tính"}
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        border: '1px solid #E5E5E5',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Pill size={20} color="#de1919ff" />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#262626', margin: 0 }}>
            Thuốc đang sử dụng
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: '#8C8C8C', marginBottom: '16px' }}>
          Danh sách thuốc hiện tại
        </p>
        <p style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#262626',
          backgroundColor: '#FAFAFA',
          padding: '16px',
          borderRadius: '4px',
          margin: 0,
          minHeight: '100px'
        }}>
          {currentMedication || "Không có thuốc đang sử dụng"}
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        border: '1px solid #E5E5E5',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Scissors size={20} color="#de1919ff" />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#262626', margin: 0 }}>
            Lịch sử phẫu thuật
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: '#8C8C8C', marginBottom: '16px' }}>
          Các ca phẫu thuật đã thực hiện
        </p>
        <p style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#262626',
          backgroundColor: '#FAFAFA',
          padding: '16px',
          borderRadius: '4px',
          margin: 0,
          minHeight: '100px'
        }}>
          {surgicalHistory || "Chưa từng phẫu thuật"}
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        border: '1px solid #FFF1F0',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <AlertCircle size={20} color="#de1919ff" />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#de1919ff', margin: 0 }}>
            Dị ứng thuốc
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: '#8C8C8C', marginBottom: '16px' }}>
          Thông tin quan trọng về dị ứng
        </p>
        <p style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#262626',
          backgroundColor: '#FFF1F0',
          border: '1px solid #FFCCC7',
          padding: '16px',
          borderRadius: '4px',
          margin: 0,
          minHeight: '100px'
        }}>
          {drugAllergies || "Không có dị ứng thuốc"}
        </p>
      </div>
    </div>
  );
};

export default MedicalHistoryTab;
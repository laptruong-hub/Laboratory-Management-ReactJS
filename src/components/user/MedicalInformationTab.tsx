import { User, Droplet, Heart } from "lucide-react";

interface MedicalInformationTabProps {
  patientId: string;
  bloodType: string;
  lifestyle: string;
}

const MedicalInformationTab = ({ patientId, bloodType, lifestyle }: MedicalInformationTabProps) => {
  return (
    <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr', maxWidth: '1200px' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        border: '1px solid #E5E5E5',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <User size={20} color="#de1919ff" />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#262626', margin: 0 }}>
            Thông tin bệnh nhân
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: '#8C8C8C',
              marginBottom: '8px'
            }}>
              Mã bệnh nhân
            </label>
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#262626', margin: 0 }}>
              {patientId}
            </p>
          </div>
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#8C8C8C',
              marginBottom: '8px'
            }}>
              <Droplet size={16} color="#de1919ff" />
              Nhóm máu
            </label>
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#262626', margin: 0 }}>
              {bloodType}
            </p>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        border: '1px solid #E5E5E5',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Heart size={20} color="#de1919ff" />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#262626', margin: 0 }}>
            Lối sống
          </h3>
        </div>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#8C8C8C',
            marginBottom: '8px'
          }}>
            Thông tin lối sống
          </label>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#262626',
            backgroundColor: '#FAFAFA',
            padding: '16px',
            borderRadius: '4px',
            margin: 0,
            minHeight: '80px'
          }}>
            {lifestyle || "Chưa có thông tin"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalInformationTab;
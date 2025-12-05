import { FileText } from "lucide-react";

interface MedicalNoteTabProps {
  notes: string;
}

const MedicalNoteTab = ({ notes }: MedicalNoteTabProps) => {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '6px',
      border: '1px solid #E5E5E5',
      padding: '32px',
      maxWidth: '1200px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <FileText size={20} color="#de1919ff" />
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#262626', margin: 0 }}>
          Ghi chú y tế
        </h3>
      </div>
      <p style={{ fontSize: '13px', color: '#8C8C8C', marginBottom: '16px' }}>
        Thông tin và hướng dẫn từ bác sĩ
      </p>
      <p style={{
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#262626',
        backgroundColor: '#FAFAFA',
        padding: '24px',
        borderRadius: '4px',
        margin: 0,
        minHeight: '200px',
        whiteSpace: 'pre-wrap'
      }}>
        {notes || "Chưa có ghi chú"}
      </p>
    </div>
  );
};

export default MedicalNoteTab;

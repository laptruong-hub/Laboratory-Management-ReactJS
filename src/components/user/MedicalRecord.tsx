
import { useState } from 'react';
import { User, Lock, NotebookIcon, File, FileClock } from 'lucide-react';
import MedicalInformationTab from './MedicalInformationTab';
import MedicalHistoryTab from './MedicalHistoryTab';
import MedicalNoteTab from './MedicalNoteTab';
import { MdMedicalInformation } from 'react-icons/md';

const MedicalRecord = () => {
  const [activeTab, setActiveTab] = useState<'information' | 'history' | 'note'>('information') ;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#262626',
          margin: '0 0 8px 0'
        }}>
          Hồ sơ bệnh án
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#8C8C8C',
          margin: 0
        }}>
          Tóm tắt thông tin y tế quan trọng
          
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid #E5E5E5',
        marginBottom: '32px'
      }}>
        <button
          onClick={() => setActiveTab('information')}
          style={{
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            color: activeTab === 'information' ? '#de1919ff' : '#8C8C8C',
            borderBottom: activeTab === 'information' ? '2px solid #de1919ff' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            marginBottom: '-1px'
          }}
        >
          <User size={16} />Thông tin chung
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 5,
            color: activeTab === 'history' ? '#de1919ff' : '#8C8C8C',
            borderBottom: activeTab === 'history' ? '2px solid #de1919ff' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            marginBottom: '-1px'
          }}
        >
          <FileClock size={16} />Lịch sử y tế
        </button>

        <button
          onClick={() => setActiveTab('note')}
          style={{
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 5,
            color: activeTab === 'note' ? '#de1919ff' : '#8C8C8C',
            borderBottom: activeTab === 'note' ? '2px solid #de1919ff' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            marginBottom: '-1px'
          }}
        >
          <NotebookIcon size={16} />Ghi chú
        </button>
      </div>

      <div>
        {activeTab === 'information' && <MedicalInformationTab />}
        {activeTab === 'history' && <MedicalHistoryTab />}
        {activeTab === 'note' && <MedicalNoteTab />}
      </div>
    </div>
  );
};

export default MedicalRecord;

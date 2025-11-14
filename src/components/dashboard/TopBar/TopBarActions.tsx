import React, { useState } from 'react';
import styled from 'styled-components';
import { FiRefreshCw, FiShare2, FiDownload } from 'react-icons/fi';

interface TopBarActionsProps {
  onRefresh?: () => void;
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: #fff;
  color: #111827;
  cursor: pointer;
  transition: all 150ms ease-in-out;
  &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.06); transform: translateY(-1px); }
`;

const DateBox = styled.input`
  height: 36px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 0 10px;
`;

export const TopBarActions: React.FC<TopBarActionsProps> = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState('2025-10-01');
  const [end, setEnd] = useState('2025-10-30');

  const refresh = async () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onRefresh?.(); }, 1000);
  };

  const share = (method: 'link' | 'email' | 'pdf') => {
    console.log('Share via:', method);
  };

  const exportAs = (format: 'excel' | 'pdf' | 'csv') => {
    console.log('Exporting as:', format);
  };

  return (
    <Wrap>
      <DateBox type="date" value={start} onChange={e => setStart(e.target.value)} />
      <DateBox type="date" value={end} onChange={e => setEnd(e.target.value)} />
      <Button aria-label="Refresh" onClick={refresh}>
        <FiRefreshCw style={{ animation: loading ? 'spin 1s linear infinite' : undefined }} /> Làm mới
      </Button>
      <Button onClick={() => share('link')} aria-label="Share"><FiShare2 /> Chia sẻ</Button>
      <Button onClick={() => exportAs('excel')} aria-label="Export"><FiDownload /> Xuất</Button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Wrap>
  );
};

export default TopBarActions;



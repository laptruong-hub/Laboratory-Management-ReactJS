import React from 'react';
import styled from 'styled-components';
import type { BreakdownItem } from '../../../utils/mockData';

interface MiniBarChartProps {
  data: BreakdownItem[];
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Bar = styled.div`
  width: 100%;
  height: 10px;
  background: #F3F4F6;
  border-radius: 999px;
  overflow: hidden;
`;

const Seg = styled.div<{ $w: number; $c: string }>`
  height: 100%;
  width: ${p => p.$w}%;
  background: ${p => p.$c};
  transition: width 600ms ease-out;
`;

const Legend = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 8px;
  font-size: 12px;
  color: #374151;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.span<{ $c: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$c};
`;

export const MiniBarChart: React.FC<MiniBarChartProps> = ({ data }) => {
  const total = data.reduce((s, d) => s + d.percent, 0) || 1;
  const normalized = data.map(d => ({ ...d, percent: (d.percent / total) * 100 }));

  return (
    <Wrap>
      <Bar title={data.map(d => `${d.label}: ${d.value} (${d.percent}%)`).join('  •  ')}>
        {normalized.map((d, i) => (
          <Seg key={d.label + i} $w={d.percent} $c={d.color} />
        ))}
      </Bar>
      <Legend>
        {data.map(d => (
          <Item key={d.label}>
            <Dot $c={d.color} />
            <span>{d.label}</span>
            <span style={{ color: '#6B7280' }}>({d.value})</span>
          </Item>
        ))}
      </Legend>
    </Wrap>
  );
};

export default MiniBarChart;



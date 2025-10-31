import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import type { RoleSlice } from '../../../utils/mockData';

interface DonutChartProps {
  title?: string;
  totalLabel?: string;
  total: number;
  data: RoleSlice[];
}

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const ChartWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  place-items: center;
`;

const Legend = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 8px 16px;
  font-size: 12px;
  color: #374151;
`;

const Dot = styled.span<{ $c: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.$c};
  display: inline-block;
`;

export const DonutChart: React.FC<DonutChartProps> = ({ title = 'Phân bố tài khoản theo vai trò', totalLabel = 'Tổng', total, data }) => {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const visible = useMemo(() => data.filter(s => !hidden[s.role]), [data, hidden]);
  const sum = visible.reduce((s, d) => s + d.count, 0) || 1;

  // Build arcs
  const arcs = useMemo(() => {
    let start = 0;
    return visible.map((d) => {
      const angle = (d.count / sum) * Math.PI * 2;
      const end = start + angle;
      const large = angle > Math.PI ? 1 : 0;
      const cx = 100, cy = 100, r = 80, ir = 55;
      const sx = cx + r * Math.cos(start), sy = cy + r * Math.sin(start);
      const ex = cx + r * Math.cos(end), ey = cy + r * Math.sin(end);
      const six = cx + ir * Math.cos(end), siy = cy + ir * Math.sin(end);
      const eix = cx + ir * Math.cos(start), eiy = cy + ir * Math.sin(start);
      const path = `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} L ${six} ${siy} A ${ir} ${ir} 0 ${large} 0 ${eix} ${eiy} Z`;
      start = end;
      return { role: d.role, color: d.color, path, count: d.count, percent: d.percent };
    });
  }, [visible, sum]);

  return (
    <Card>
      <Title>{title}</Title>
      <ChartWrap>
        <svg width={220} height={220} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
          {arcs.map(a => (
            <path key={a.role} d={a.path} fill={a.color} style={{ transition: 'transform 200ms ease-out' }} />
          ))}
          <circle cx={100} cy={100} r={50} fill="#fff" />
          <text x={100} y={95} textAnchor="middle" fontSize={20} fontWeight={700} fill="#111827">{total}</text>
          <text x={100} y={115} textAnchor="middle" fontSize={12} fill="#6B7280">{totalLabel}</text>
        </svg>
      </ChartWrap>
      <Legend>
        {data.map((d) => {
          const isHidden = !!hidden[d.role];
          return (
            <div key={d.role} style={{ cursor: 'pointer', opacity: isHidden ? 0.4 : 1 }} onClick={() => setHidden(h => ({ ...h, [d.role]: !h[d.role] }))}>
              <Dot $c={d.color} /> <span style={{ marginLeft: 6 }}>{d.role}</span> <span style={{ color: '#6B7280', marginLeft: 6 }}> {d.count} • {d.percent}%</span>
            </div>
          );
        })}
      </Legend>
    </Card>
  );
};

export default DonutChart;



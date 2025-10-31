import React from 'react';
import styled from 'styled-components';
import type { ParameterItem } from '../../../utils/mockData';

interface HorizontalBarChartProps {
  title?: string;
  data: ParameterItem[];
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

const Row = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 12px;
`;

const Label = styled.div`
  color: #374151;
  font-size: 14px;
`;

const BarWrap = styled.div`
  position: relative;
  height: 32px;
  background: #F3F4F6;
  border-radius: 4px;
  overflow: hidden;
`;

const Bar = styled.div<{ $w: number }>`
  height: 100%;
  width: ${p => p.$w}%;
  background: linear-gradient(90deg, #FF4D4F 0%, #FFA39E 100%);
  transition: width 600ms ease-out;
`;

const Value = styled.div`
  text-align: right;
  color: #111827;
  font-weight: 600;
`;

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ title = 'Phân bố xét nghiệm theo Parameter', data }) => {
  const max = Math.max(...data.map(d => d.count), 1);
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <Card>
      <Title>{title}</Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map((d, idx) => (
          <Row key={d.name + idx}>
            <Label>{d.name}</Label>
            <BarWrap title={`${d.name}: ${d.count} (${d.percent}%)`}>
              <Bar $w={(d.count / max) * 100} />
            </BarWrap>
            <Value>{d.count}</Value>
          </Row>
        ))}
      </div>
    </Card>
  );
};

export default HorizontalBarChart;



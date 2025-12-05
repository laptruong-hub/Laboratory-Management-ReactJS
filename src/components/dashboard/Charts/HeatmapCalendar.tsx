import React from 'react';
import styled from 'styled-components';
import type { HeatmapCell } from '../../../utils/mockData';

interface HeatmapCalendarProps {
  title?: string;
  month: string;
  data: HeatmapCell[];
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  @media (max-width: 640px) {
    gap: 4px;
  }
`;

const Cell = styled.div<{ $bg: string }>`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: ${p => p.$bg};
  transition: transform 150ms ease-in-out;
  &:hover { transform: scale(1.08); }
  @media (max-width: 640px) {
    width: 24px; height: 24px;
  }
`;

function colorFor(count: number): string {
  if (count <= 5) return '#FFFFFF';
  if (count <= 15) return '#FFEBEE';
  if (count <= 25) return '#FFCDD2';
  if (count <= 35) return '#EF5350';
  return '#C62828';
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ title = 'Lịch hẹn theo ngày', month, data }) => {
  // Arrange into 7x5-ish grid: place by weekday; for simplicity, render in order
  return (
    <Card>
      <Title>{title} — {month}</Title>
      <Grid>
        {data.map((d, idx) => (
          <Cell key={idx} $bg={colorFor(d.count)} title={`Ngày ${d.date}: ${d.count} lịch`} />
        ))}
      </Grid>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6B7280' }}>
        Ít
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 8, 18, 28, 40].map((n) => (
            <div key={n} style={{ width: 16, height: 16, borderRadius: 4, background: colorFor(n) }} />
          ))}
        </div>
        Nhiều
      </div>
    </Card>
  );
};

export default HeatmapCalendar;



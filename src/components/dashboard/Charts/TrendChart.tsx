import React, { useMemo } from 'react';
import styled from 'styled-components';
import type { TrendPoint } from '../../../utils/mockData';

interface TrendChartProps {
  title?: string;
  subtitle?: string;
  data: TrendPoint[];
  height?: number; // desktop height
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

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const Sub = styled.div`
  color: #6B7280;
  font-size: 12px;
`;

const SvgWrap = styled.div<{ $h: number }>`
  width: 100%;
  height: ${p => p.$h}px;
  @media (max-width: 640px) {
    height: 200px;
  }
`;

export const TrendChart: React.FC<TrendChartProps> = ({ title = 'Xu hướng', subtitle, data, height = 300 }) => {
  const { path, fillPath, xLabels, min, max } = useMemo(() => {
    if (!data.length) return { path: '', fillPath: '', xLabels: [] as string[], min: 0, max: 0 };
    const values = data.map(d => d.value);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const pad = (maxV - minV) * 0.1 || 10;
    const yMin = minV - pad;
    const yMax = maxV + pad;
    const W = 800; const H = 240; const L = data.length - 1 || 1;
    const points = data.map((d, i) => {
      const x = (i / L) * W;
      const y = H - ((d.value - yMin) / (yMax - yMin)) * H;
      return `${x},${y}`;
    });
    const dPath = `M ${points[0]} C ${points.slice(1).join(' ')}`.replace('C', 'L'); // simple polyline-like curve
    const fill = `${dPath} L ${W},${H} L 0,${H} Z`;
    return { path: dPath, fillPath: fill, xLabels: data.map(d => d.date), min: yMin, max: yMax };
  }, [data]);

  return (
    <Card>
      <Head>
        <Title>{title}</Title>
        {subtitle ? <Sub>{subtitle}</Sub> : null}
      </Head>
      <SvgWrap $h={height}>
        <svg width="100%" height="100%" viewBox="0 0 800 240" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(24,144,255,0.20)" />
              <stop offset="100%" stopColor="rgba(24,144,255,0.0)" />
            </linearGradient>
          </defs>
          <g>
            {/* grid */}
            <path d="M0 240 H800" stroke="#E5E7EB" strokeDasharray="4 4" />
            <path d="M0 180 H800" stroke="#E5E7EB" strokeDasharray="4 4" />
            <path d="M0 120 H800" stroke="#E5E7EB" strokeDasharray="4 4" />
            <path d="M0 60 H800" stroke="#E5E7EB" strokeDasharray="4 4" />
          </g>
          <path d={fillPath} fill="url(#lineFill)" />
          <path d={path} fill="none" stroke="#1890FF" strokeWidth="2" style={{ strokeDasharray: 900, strokeDashoffset: 900, animation: 'dash 1000ms ease-out forwards' } as any} />
          <style>{`@keyframes dash { to { stroke-dashoffset: 0; } }`}</style>
        </svg>
      </SvgWrap>
      <Sub>Min/Max: {Math.round(min)} / {Math.round(max)}</Sub>
    </Card>
  );
};

export default TrendChart;



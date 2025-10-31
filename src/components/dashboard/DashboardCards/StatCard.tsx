import React from 'react';
import styled from 'styled-components';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string; // accent border/icon
  children?: React.ReactNode; // slot for mini chart
  description?: string;
}

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  animation: fadeIn 300ms ease-out both;
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconWrap = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #fee2e2;
  color: ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const Title = styled.div`
  color: #6B7280;
  font-size: 13px;
`;

const Value = styled.div`
  color: #111827;
  font-weight: 800;
  font-size: 22px;
`;

const Desc = styled.div`
  color: #6B7280;
  font-size: 12px;
`;

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = '#dc2626', children, description }) => {
  return (
    <Card>
      <Row>
        <Left>
          {icon ? <IconWrap $color={color}>{icon}</IconWrap> : null}
          <div>
            <Title>{title}</Title>
            <Value>{value}</Value>
          </div>
        </Left>
      </Row>
      {children}
      {description ? <Desc>{description}</Desc> : null}
    </Card>
  );
};

export default StatCard;



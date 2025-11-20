import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import WorkingSidebar from "../working/WorkingSidebar";
import WorkingUserInfo from "../working/WorkingUserInfo";

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
  box-sizing: border-box;
`;

const LeftPanel = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    width: 100%;
    position: absolute;
    z-index: 1000;
    display: none; // Ẩn trên mobile, có thể toggle sau
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f8f9fa;
`;

const ContentArea = styled.main`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const WorkingLayout: React.FC = () => {
  return (
    <LayoutContainer>
      <LeftPanel>
        <WorkingUserInfo />
        <WorkingSidebar />
      </LeftPanel>

      <RightPanel>
        <ContentArea>
          <Outlet />
        </ContentArea>
      </RightPanel>
    </LayoutContainer>
  );
};

export default WorkingLayout;

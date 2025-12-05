import React from "react";
import { theme } from "../../theme/theme";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md", text, fullScreen = false }) => {
  const sizeMap = {
    sm: "1.5rem",
    md: "3rem",
    lg: "4rem",
  };

  const borderWidthMap = {
    sm: "2px",
    md: "4px",
    lg: "6px",
  };

  const containerStyle: React.CSSProperties = fullScreen
    ? {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        gap: theme.spacing.md,
      }
    : {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        gap: theme.spacing.md,
      };

  return (
    <div style={containerStyle}>
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: `${borderWidthMap[size]} solid ${theme.colors.borderLight}`,
          borderTopColor: theme.colors.primary,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      {text && <p style={{ color: theme.colors.textMedium, fontSize: theme.typography.fontSize.sm }}>{text}</p>}
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;

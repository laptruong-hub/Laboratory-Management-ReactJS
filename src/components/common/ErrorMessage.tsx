import React from "react";
import { theme } from "../../theme/theme";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  variant?: "default" | "inline" | "card";
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, variant = "default" }) => {
  const baseStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.errorLight,
    border: `1px solid ${theme.colors.error}`,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
  };

  if (variant === "inline") {
    return <div style={{ ...baseStyle, margin: `${theme.spacing.sm} 0` }}>{message}</div>;
  }

  if (variant === "card") {
    return (
      <div
        style={{
          ...baseStyle,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
          gap: theme.spacing.md,
          textAlign: "center",
        }}
      >
        <strong>{message}</strong>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
              border: "none",
              borderRadius: theme.borderRadius.md,
              cursor: "pointer",
              fontWeight: theme.typography.fontWeight.medium,
              fontSize: theme.typography.fontSize.sm,
              transition: theme.transitions.normal,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={baseStyle}>
      {message}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginLeft: theme.spacing.md,
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            backgroundColor: "transparent",
            color: theme.colors.error,
            border: `1px solid ${theme.colors.error}`,
            borderRadius: theme.borderRadius.sm,
            cursor: "pointer",
            fontSize: theme.typography.fontSize.xs,
          }}
        >
          Thử lại
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

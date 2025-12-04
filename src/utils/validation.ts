// Form validation utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Mật khẩu phải có ít nhất 8 ký tự");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất một chữ hoa");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất một chữ thường");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Mật khẩu phải có ít nhất một số");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
};

export const validateField = (value: string, rules: ValidationRule, fieldName: string): string | null => {
  if (rules.required && (!value || value.trim() === "")) {
    return `${fieldName} là bắt buộc`;
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    return `${fieldName} phải có ít nhất ${rules.minLength} ký tự`;
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    return `${fieldName} không được vượt quá ${rules.maxLength} ký tự`;
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    return `${fieldName} không hợp lệ`;
  }

  if (value && rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = (
  values: Record<string, string>,
  rules: Record<string, ValidationRule>
): ValidationResult => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((fieldName) => {
    const value = values[fieldName] || "";
    const fieldRules = rules[fieldName];
    const error = validateField(value, fieldRules, fieldName);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

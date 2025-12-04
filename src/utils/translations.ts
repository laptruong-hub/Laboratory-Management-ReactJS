/**
 * Role translations from English to Vietnamese
 */
export const ROLE_TRANSLATIONS: Record<string, string> = {
  Administrator: "Quản trị viên",
  Admin: "Quản trị viên",
  "Laboratory Manager": "Quản lý phòng thí nghiệm",
  "Lab Manager": "Quản lý phòng thí nghiệm",
  Service: "Dịch vụ khách hàng",
  "Customer Service": "Dịch vụ khách hàng",
  "Lab User": "Bác sĩ",
  Technician: "Bác sĩ",
  Patient: "Bệnh nhân",
  Receptionist: "Lễ tân",
  Doctor: "Bác sĩ",
  Nurse: "Y tá",
};

/**
 * Translate role name from English to Vietnamese
 * @param roleName - The English role name
 * @returns Vietnamese translation or original name if not found
 */
export const translateRole = (roleName: string): string => {
  if (!roleName) return "";

  // Try exact match first
  if (ROLE_TRANSLATIONS[roleName]) {
    return ROLE_TRANSLATIONS[roleName];
  }

  // Try case-insensitive match
  const normalizedRole = roleName.trim();
  for (const [key, value] of Object.entries(ROLE_TRANSLATIONS)) {
    if (key.toLowerCase() === normalizedRole.toLowerCase()) {
      return value;
    }
  }

  // Return original if no translation found
  return roleName;
};

/**
 * Get role display name (translated to Vietnamese)
 * @param roleName - The role name to display
 * @returns Formatted role name for display
 */
export const getRoleDisplayName = (roleName: string): string => {
  return translateRole(roleName);
};

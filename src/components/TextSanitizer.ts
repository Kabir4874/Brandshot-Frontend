  // --- Function to sanitize strings for JSON ---
  export const sanitizeStringForJson = (str: string): string => {
    if (!str) return "";
    return str
      .replace(/\\/g, "\\\\") // Escape backslashes
      .replace(/"/g, '\\"') // Escape double quotes
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\r/g, ""); // Remove carriage returns
  };

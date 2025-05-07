
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters",
    };
  }

  return { isValid: true, message: "" };
};


export const validateName = (name) => {
  if (!name || name.trim() === "") {
    return { isValid: false, message: "Name is required" };
  }

  if (name.length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters" };
  }

  return { isValid: true, message: "" };
};


export const isValidUrl = (url) => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};


export const validateForm = (form, validations) => {
  const errors = {};

  Object.keys(validations).forEach((field) => {
    const value = form[field];
    const validation = validations[field];

    if (validation.required && (!value || value.trim() === "")) {
      errors[field] = `${validation.name || field} is required`;
    } else if (validation.minLength && value.length < validation.minLength) {
      errors[field] = `${validation.name || field} must be at least ${
        validation.minLength
      } characters`;
    } else if (validation.pattern && !validation.pattern.test(value)) {
      errors[field] =
        validation.message || `${validation.name || field} is invalid`;
    } else if (validation.custom) {
      const customError = validation.custom(value, form);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return errors;
};

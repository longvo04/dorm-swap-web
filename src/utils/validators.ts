export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Vietnamese format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate item form data
 */
export function validateItemForm(data: {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  condition?: string;
  listingType?: string;
  images?: string[];
  rentalDeposit?: number;
  rentalPeriodDays?: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters';
  }
  if (data.title && data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (!data.description || data.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters';
  }
  if (data.description && data.description.length > 2000) {
    errors.description = 'Description must be less than 2000 characters';
  }

  if (!data.price || data.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }
  if (data.price && data.price > 100000000) {
    errors.price = 'Price cannot exceed 100,000,000 VND';
  }

  if (!data.category) {
    errors.category = 'Please select a category';
  }

  if (!data.condition) {
    errors.condition = 'Please select item condition';
  }

  if (!data.listingType) {
    errors.listingType = 'Please select listing type';
  }

  if (!data.images || data.images.length === 0) {
    errors.images = 'Please upload at least one image';
  }
  if (data.images && data.images.length > 5) {
    errors.images = 'Maximum 5 images allowed';
  }

  // Rental-specific validations
  if (data.listingType === 'rent') {
    if (!data.rentalDeposit || data.rentalDeposit <= 0) {
      errors.rentalDeposit = 'Rental deposit is required';
    }
    if (!data.rentalPeriodDays || data.rentalPeriodDays < 1) {
      errors.rentalPeriodDays = 'Rental period must be at least 1 day';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate profile form data
 */
export function validateProfileForm(data: {
  name?: string;
  phone?: string;
  dormBuilding?: string;
  roomNumber?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'Please enter a valid Vietnamese phone number';
  }

  if (data.roomNumber && !/^[0-9]{3,4}[A-Za-z]?$/.test(data.roomNumber)) {
    errors.roomNumber = 'Please enter a valid room number (e.g., 101, 202A)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}


/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 24-AUG-2025
 * @description constants of error status codes
 * 
 */

export const constants = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT:409,
  SERVER_ERROR: 500,
  LOCKED_ACCOUNT: 423,
  INVALID_RECIPIENT: 553
};

export const  BASE_URL : string = "http://localhost:4000"
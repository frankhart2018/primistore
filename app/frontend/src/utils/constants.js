const ROWS = 48;
const COLS = 114;

const PASSWORD_MANAGER_API_BASE =
  process.env.PASSWORD_MANAGER_API_BASE || "http://localhost:4000";
const IMAGE_DECRYPTOR_API_BASE =
  process.env.IMAGE_DECRYPTOR_API_BASE || "http://localhost:8000";

const TIMEZONE = "America/Chicago";

export {
  ROWS,
  COLS,
  PASSWORD_MANAGER_API_BASE,
  TIMEZONE,
  IMAGE_DECRYPTOR_API_BASE,
};

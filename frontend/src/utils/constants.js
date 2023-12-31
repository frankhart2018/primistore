const ROWS = 48;
const COLS = 114;

const PASSWORD_MANAGER_API_BASE =
  process.env.REACT_APP_PASSWORD_MANAGER_API_BASE || "http://localhost:4000";
const IMAGE_DECRYPTOR_API_BASE =
  process.env.REACT_APP_IMAGE_DECRYPTOR_API_BASE || "http://localhost:8000";

const DEFAULT_SPECIAL_CHARS = [
  "@",
  "#",
  "*",
  "(",
  ")",
  "+",
  "=",
  "{",
  "}",
  "/",
  "?",
  "~",
  ";",
  ",",
  ".",
  "-",
  "_",
];

export {
  ROWS,
  COLS,
  PASSWORD_MANAGER_API_BASE,
  IMAGE_DECRYPTOR_API_BASE,
  DEFAULT_SPECIAL_CHARS,
};

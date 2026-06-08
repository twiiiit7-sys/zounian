// Replace this value if the backend URL changes.
const RENDER_API_BASE_URL = "https://zounian.onrender.com";

window.ZOUNIAN_CONFIG = {
  apiBaseUrl:
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000"
      : RENDER_API_BASE_URL
};

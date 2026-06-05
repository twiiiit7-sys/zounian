// Replace this value with your actual Render URL after deployment.
const RENDER_API_BASE_URL = "https://your-render-service.onrender.com";

window.ZOUNIAN_CONFIG = {
  apiBaseUrl:
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000"
      : RENDER_API_BASE_URL
};

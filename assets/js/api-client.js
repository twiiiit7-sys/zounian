(function () {
  const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const config = window.ZOUNIAN_CONFIG || {};
  const fallbackBaseUrl = isLocalHost
    ? "http://localhost:3000"
    : "https://your-render-service.onrender.com";

  const apiBaseUrl = (config.apiBaseUrl || fallbackBaseUrl).replace(/\/+$/, "");

  const request = async (path, options) => {
    let response;

    try {
      response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options && options.headers ? options.headers : {})
        }
      });
    } catch (error) {
      const networkError = new Error(
        "\u9001\u4fe1\u5148\u30b5\u30fc\u30d0\u30fc\u306b\u63a5\u7d9a\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002URL \u3068 CORS \u8a2d\u5b9a\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002"
      );
      networkError.cause = error;
      throw networkError;
    }

    const rawText = await response.text();
    let data = {};

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch (error) {
        data = { message: rawText };
      }
    }

    if (!response.ok) {
      const message =
        data.message ||
        `\u9001\u4fe1\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002HTTP ${response.status} ${response.statusText}`.trim();
      const error = new Error(message);
      error.status = response.status;
      error.payload = data;
      throw error;
    }

    return data;
  };

  window.ZounianApi = {
    apiBaseUrl,
    post(path, payload) {
      return request(path, {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }
  };
})();

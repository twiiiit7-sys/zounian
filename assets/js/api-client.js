(function () {
  const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const config = window.ZOUNIAN_CONFIG || {};
  const fallbackBaseUrl = isLocalHost
    ? "http://localhost:3000"
    : "https://your-render-service.onrender.com";

  const apiBaseUrl = (config.apiBaseUrl || fallbackBaseUrl).replace(/\/+$/, "");

  const request = async (path, options) => {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options && options.headers ? options.headers : {})
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || "API request failed");
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

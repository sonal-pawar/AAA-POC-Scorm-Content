/**
 * Asset Resolver - Resolves relative asset paths using baseAssetUrl from config.json
 */
const AssetResolver = (function () {
  let _baseUrl = "";

  /**
   * Initialize by loading config.json
   */
  async function init() {
    const res = await fetch("config.json");
    const config = await res.json();
    _baseUrl = (config.baseAssetUrl || "").replace(/\/+$/, "");
    return config;
  }

  /**
   * Resolve a relative asset path to a full URL
   * e.g. "assets/media/images/ICAO_logo.jpg"
   *   -> "https://sonal-pawar.github.io/AAA-POC-Scorm-Content/assets/media/images/ICAO_logo.jpg"
   */
  function resolve(relativePath) {
    if (!relativePath) return "";
    // Already a full URL — return as-is
    if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
      return relativePath;
    }
    return _baseUrl + "/" + relativePath.replace(/^\/+/, "");
  }

  /**
   * Walk a JSON object and resolve all asset paths (keys matching known asset fields)
   */
  function resolveAll(obj) {
    const assetKeys = ["source", "src", "poster", "logo", "image_src", "background"];
    if (Array.isArray(obj)) {
      return obj.map(function (item) { return resolveAll(item); });
    }
    if (obj && typeof obj === "object") {
      var resolved = {};
      for (var key in obj) {
        if (assetKeys.indexOf(key) !== -1 && typeof obj[key] === "string" && obj[key]) {
          resolved[key] = resolve(obj[key]);
        } else {
          resolved[key] = resolveAll(obj[key]);
        }
      }
      return resolved;
    }
    return obj;
  }

  /**
   * Get the current base URL
   */
  function getBaseUrl() {
    return _baseUrl;
  }

  return {
    init: init,
    resolve: resolve,
    resolveAll: resolveAll,
    getBaseUrl: getBaseUrl
  };
})();

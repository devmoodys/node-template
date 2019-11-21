import logger from "systems/logger";
import {
  head,
  isEmpty,
  isNil,
  join,
  map,
  merge,
  pipe,
  reject,
  toPairs
} from "ramda";
import { stringify } from "query-string";
import AbortController from "abort-controller";
// this url is constantly called to reis to keep users logged in and would muddy up the logs
const URLS_NOT_TO_LOG = ["https://api.reis.com/api/v1/ExecutiveBriefing"];

export async function loggedFetch(url, options) {
  logFetchRequest(url, options);

  let fetchOptions = options;

  if (
    process.env.FEATURE_MOODYS_HTTPS_PROXY === "true" &&
    !url.match(/localhost/)
  ) {
    const { agent } = require("./https_proxy_agent");
    fetchOptions = merge(fetchOptions, { agent });
  }
  let response;
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 2500);
  try {
    response = await fetch(url, { ...fetchOptions, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
  logFetchResponse(url, response);
  return response;
}

export class JsonApiClient {
  constructor(url, auth = {}, headers = undefined) {
    const authHeader = pipe(reject(isNil), toPairs, map(join(" ")), head)(auth);
    this.url = url.replace(/\/$/, "");
    this.authorization = merge(
      headers || {},
      authHeader ? { Authorization: authHeader } : {}
    );
  }

  get = async (path, params = {}) => {
    const pathWithQuery = isEmpty(params)
      ? path
      : `${path}?${stringify(params)}`;

    return this.fetch(pathWithQuery, { method: "get" });
  };

  post = async (path, bodyObject) => {
    const body = bodyObject ? JSON.stringify(bodyObject) : undefined;
    return this.fetch(path, { method: "post", body });
  };

  delete = async (path, bodyObject) => {
    const body = bodyObject ? JSON.stringify(bodyObject) : undefined;
    return this.fetch(path, { method: "delete", body });
  };

  fetch = async (path, options) => {
    const headers = merge(
      { "Content-Type": "application/json", Accept: "application/json" },
      this.authorization ? this.authorization : {}
    );
    const fetchOptions = merge({ headers: new Headers(headers) }, options);
    const fetchUrl = [this.url, path].join(path.startsWith("/") ? "" : "/");
    const response = await loggedFetch(fetchUrl, fetchOptions);

    if (!response.ok) {
      const text = await response.text();
      const error = new Error(text);
      error.response = response;
      throw error;
    }

    return response;
  };
}

function logFetchRequest(fetchUrl, fetchOptions) {
  if (URLS_NOT_TO_LOG.includes(fetchUrl)) {
    return;
  }
  const message = [
    fetchOptions.method.toUpperCase(),
    cleanUrl(fetchUrl),
    fetchOptions.body ? `${fetchOptions.body.length} bytes` : null
  ];

  pipe(reject(isNil), join(" "), logger.info)(message);
}

function logFetchResponse(fetchUrl, response) {
  if (URLS_NOT_TO_LOG.includes(fetchUrl)) {
    return;
  }
  const contentLength = response.headers.get("content-length");
  const contentType = response.headers.get("content-type");

  const message = [
    "Received",
    response.status,
    response.statusText,
    contentLength ? `with ${contentLength} bytes` : null,
    contentType ? `(${contentType})` : null,
    `from ${cleanUrl(fetchUrl)}`
  ];

  pipe(reject(isNil), join(" "), logger.info)(message);
}

function cleanUrl(url) {
  return url.replace(/(token=|apikey=)[^&]+/i, "$1REDACTED");
}

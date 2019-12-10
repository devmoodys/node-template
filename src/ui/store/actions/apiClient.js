import { merge } from "ramda";
import Cookies from "js-cookie";

let jwt = null;

function getJwt() {
  if (!jwt) {
    jwt = Cookies.get("cls-jwt");
  }

  return jwt;
}

export async function apiFetch(input, init = {}) {
  const jwt = getJwt();

  const headers = new Headers({
    Authorization: `jwt ${jwt}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    pragma: "no-cache",
    "cache-control": "no-cache"
  });

  const _fetchOptions = merge({ headers }, init);
  return fetch(input, _fetchOptions);
}

export async function externalApiFetch(input, init = {}, token) {
  const headers = new Headers({
    Authorization: `Bearer ${decodeURIComponent(token)}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    pragma: "no-cache",
    "cache-control": "no-cache"
  });

  const _fetchOptions = merge({ headers }, init);
  return fetch(input, _fetchOptions);
}

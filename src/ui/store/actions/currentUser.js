import { apiFetch } from "./apiClient";

export function acceptTerms(location = window.location) {
  return async function(_dispatch) {
    const response = await apiFetch("/api/accept_terms", { method: "post" });

    if (!response.ok) {
      const responseBody = await response.json();
      throw new Error(responseBody.error.message);
    }

    // This is necessary to ensure that the Compstak Map Loads Correctly
    location.reload();
  };
}

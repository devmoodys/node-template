import ApiClient from "./apiClient";

export async function reverseGeocode(lat, long) {
  const apiClient = new ApiClient();
  const features = await apiClient.reverseGeocode(lat, long);
  return features;
}

export async function autocomplete(query) {
  const apiClient = new ApiClient();
  const features = await apiClient.autocomplete(query);
  return features;
}

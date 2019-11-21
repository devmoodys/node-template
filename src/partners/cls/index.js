import ApiClient from "partners/cls/apiClient";
import {
  clsResponseToSearchResults,
  clsPropertyToInterchangeFormat,
  processPipResult
} from "./helpers";
import { propertyToAddress, extractId } from "services/map";

export function accountDescriptionFromCredentials(_credentials) {
  return undefined;
}

async function apiClientForUser() {
  return new ApiClient();
}

export async function search(userId, query) {
  const apiClient = await apiClientForUser();
  const features = await apiClient.getGeoCodes(query);
  return await clsResponseToSearchResults(features);
}

export async function searchAroundPoint(userId, lat, long, dmpId) {
  const apiClient = await apiClientForUser();
  let features = await apiClient.reverseGeocode(lat, long);
  if (dmpId) {
    features = features.filter(feature => {
      const { dmp_id: property_dmp_id } = extractId(feature.properties.id);
      return property_dmp_id === dmpId;
    });
  }
  return await clsResponseToSearchResults(features);
}

export async function isConnectionHealthy(userId) {
  try {
    const apiClient = await apiClientForUser(userId);
    await apiClient.healthCheck();
    return true;
  } catch (_e) {
    return false;
  }
}
export async function getEntity(userId, type, id) {
  if (type === "property") {
    return await getPropertyEntity(userId, id);
  }
}

export async function getPropertyEntity(_userId, property) {
  const apiClient = await apiClientForUser();
  property = JSON.parse(property);
  let lat, long, dmp;
  let locationScoreObj = {};
  if (property.dmp_id) {
    locationScoreObj = await apiClient.getLocationScoreObj(property.dmp_id);
  } else {
    lat = property.lat;
    long = property.lon;
    if (lat && long) {
      dmp = await apiClient.getDmp(lat, long);
    }
    locationScoreObj = await apiClient.getLocationScoreObj(dmp);
  }
  property.locationScoreObj = locationScoreObj;
  return clsPropertyToInterchangeFormat(property);
}

export async function getCLSDataFromAddress(address) {
  if (!address) {
    return null;
  }
  try {
    const apiClient = await apiClientForUser();
    const esResults = await apiClient.getGeoCodes(address);
    const clsEsResult = esResults[0];
    if (clsEsResult.ratio <= parseFloat(process.env.STRING_SIMILARITY_RATIO)) {
      return null;
    }
    const { dmp_id, reis_id } = extractId(clsEsResult.properties.id);
    const [longitude, latitude] = clsEsResult.geometry.coordinates;
    const propertyAddress = propertyToAddress(clsEsResult.properties);
    const clsDataInterchangeFormat = await getPropertyEntity(
      null,
      JSON.stringify({
        ...clsEsResult,
        lon: longitude,
        lat: latitude,
        dmp_id,
        reis_id,
        address: propertyAddress
      })
    );
    return clsDataInterchangeFormat;
  } catch (e) {
    return null;
  }
}

export async function getCLSDataFromLatLong(lat, long) {
  try {
    const apiClient = await apiClientForUser();
    const esResults = await apiClient.reverseGeocode(lat, long);
    const clsEsResult = esResults[0];
    const { dmp_id, reis_id } = extractId(clsEsResult.properties.id);
    const [longitude, latitude] = clsEsResult.geometry.coordinates;
    const address = propertyToAddress(clsEsResult.properties);
    const clsDataInterchangeFormat = await getPropertyEntity(
      null,
      JSON.stringify({
        ...clsEsResult,
        lon: longitude,
        lat: latitude,
        dmp_id,
        reis_id,
        address
      })
    );
    return clsDataInterchangeFormat;
  } catch (e) {
    return null;
  }
}

export async function pipLookup(lat, lon) {
  const apiClient = await apiClientForUser();
  try {
    const pipResult = await apiClient.pipLookup(lat, lon);
    return pipResult ? processPipResult(pipResult) : {};
  } catch (e) {
    return {};
  }
}

export async function reverseGeocode(lat, long) {
  const apiClient = await apiClientForUser();
  const features = await apiClient.reverseGeocode(lat, long);
  return features;
}

export async function autocomplete(query) {
  const apiClient = await apiClientForUser();
  const features = await apiClient.autocomplete(query);
  return features;
}

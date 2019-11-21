import { JsonApiClient } from "systems/fetch";
import { filterEsFeatures } from "services/map";

const REIS_GEOCODER_API_URL = process.env.REIS_GEOCODER_API_URL;
const CLS_GEOCODER_API_URL = process.env.CLS_GEOCODER_API_URL;
const PELIAS_GEOCODER_API_URL = process.env.PELIAS_GEOCODER_API_URL;

export default class ApiClient {
  constructor() {
    this.indexMapping = {
      reis: new JsonApiClient(REIS_GEOCODER_API_URL),
      cls: new JsonApiClient(CLS_GEOCODER_API_URL),
      pelias: new JsonApiClient(PELIAS_GEOCODER_API_URL)
    };
  }

  getGeoCodes = async (query, index) => {
    const geoCoderClient = this.indexMapping[index];
    const response = await geoCoderClient.get("v1/search", {
      text: query,
      size: 50,
      sources: "openaddresses"
    });
    const result = await response.json();
    return filterEsFeatures(result, "openaddresses");
  };

  reverseGeoCode = async (lat, long, radius, index) => {
    const geoCoderClient = this.indexMapping[index];
    const response = await geoCoderClient.get("v1/reverse", {
      "point.lat": lat,
      "point.lon": long,
      "boundary.circle.radius": radius
    });
    const result = await response.json();
    return result;
  };
}

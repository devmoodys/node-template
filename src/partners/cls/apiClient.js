import { JsonApiClient } from "systems/fetch";
import { filterEsFeatures } from "services/map";

const GEOCODER_API_URL = process.env.CLS_GEOCODER_API_URL;
const CLS_API_URL = process.env.CLS_API_URL;
const POINT_IN_POLYGON_URL = process.env.POINT_IN_POLYGON_URL;
const API_KEY = process.env.CLS_API_KEY;

export default class ApiClient {
  constructor() {
    this.geoCoderClient = new JsonApiClient(GEOCODER_API_URL);
    this.clsClient = new JsonApiClient(CLS_API_URL);
    if (process.env.SHOULD_DO_PIP_LOOKUP === "true") {
      this.pipClient = new JsonApiClient(POINT_IN_POLYGON_URL);
    }
  }

  getGeoCodes = async query => {
    const response = await this.geoCoderClient.get("v1/search", {
      text: query,
      size: 50,
      sources: "openaddresses"
    });
    const result = await response.json();
    return filterEsFeatures(result, "openaddresses");
  };

  autocomplete = async query => {
    const response = await this.geoCoderClient.get("v1/autocomplete", {
      text: query,
      sources: "openaddresses"
    });
    const result = await response.json();
    return result.features;
  };

  getCLSPropertyFromAddress = async address => {
    const response = await this.clsClient.get("geocode/text", {
      address,
      apikey: API_KEY
    });
    const results = await response.json();
    return results[0];
  };

  getDmp = async (lat, long) => {
    // radius of 2000 meters is average
    const radius = 2000;
    const response = await this.clsClient.get("geocode/boundary", {
      lat,
      long,
      radius,
      maxResults: 1,
      apikey: API_KEY
    });
    const results = await response.json();
    return results.length > 0 ? results[0].dmp_id : null;
  };
  // this may require fixing to adjust for parcel sizes (or average parcel size)
  // can be done by boundary.circle.radius
  reverseGeocode = async (lat, long) => {
    const response = await this.geoCoderClient.get("v1/reverse", {
      "point.lat": lat,
      "point.lon": long,
      "boundary.circle.radius": 10
    });
    const result = await response.json();
    return result.features;
  };

  getLocationScoreObj = async dmp_id => {
    const response = await this.clsClient.get("locationscore", {
      dmp_id,
      score: "all",
      componentScore: "true",
      includePercentile: "true",
      apikey: API_KEY
    });
    const results = await response.json();
    return results[0];
  };

  pipLookup = async (lat, lon) => {
    const response = await this.pipClient.get(`${lon}/${lat}`);
    const result = await response.json();
    return result;
  };

  healthCheck = async () => {
    return await this.clsClient.get("locationscore/scoremapping", {
      apikey: API_KEY
    });
  };
}

import { JsonApiClient } from "systems/fetch";
import { filterEsFeatures } from "services/map";

const API_URL = process.env.REIS_API_URL;
const LOCAL_API_URL = process.env.REIS_LOCAL_API_URL;
const GEOCODER_API_URL = process.env.REIS_GEOCODER_API_URL;

export default class ApiClient {
  constructor(reisToken) {
    this.client = new JsonApiClient(
      API_URL,
      {},
      {
        Authorization: reisToken
      }
    );
    this.geoCoderClient = new JsonApiClient(GEOCODER_API_URL);
    this.localReisClient = new JsonApiClient(LOCAL_API_URL);
  }

  login = async (username, password) => {
    const response = await this.client.post("login", {
      Username: username,
      Password: password
    });
    const message = await response.json();
    return message === "Success";
  };

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

  getGeoCodesWithoutFilter = async query => {
    const response = await this.geoCoderClient.get("v1/search", {
      text: query,
      size: 50,
      sources: "openaddresses"
    });
    const result = await response.json();
    return result.features;
  };

  reverseGeocode = async (lat, long) => {
    const response = await this.geoCoderClient.get("v1/reverse", {
      "point.lat": lat,
      "point.lon": long,
      "boundary.circle.radius": 10
    });
    const result = await response.json();
    return result.features;
  };

  getPropertyFromReisApi = async (lat, long) => {
    const response = await this.client.post("Property/Place", {
      Lat: lat,
      Long: long
    });
    const result = await response.json();
    return result.Data && result.Data[0];
  };

  getPropertyFromReisId = async reisId => {
    const response = await this.client.get(`Property/${reisId}`);
    const result = await response.json();
    return result.Data && result.Data[0];
  };

  getProperty = async reisId => {
    const response = await this.localReisClient.get("property/place", {
      id: reisId,
      apikey: process.env.CLS_API_KEY
    });
    const result = await response.json();
    return result.Data && result.Data[0];
  };

  healthCheck = async () => {
    const response = await this.client.post("ExecutiveBriefing", {
      Subid: 1,
      Msa: "CM",
      Sector: "Ret",
      PublicationFrequency: "Q"
    });
    const message = await response.json();
    return message.Info === "Success";
  };
}

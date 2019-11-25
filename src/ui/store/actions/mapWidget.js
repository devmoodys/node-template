import { reject, isNil, mapObjIndexed } from "ramda";
import { apiFetch } from "./apiClient";
import { cleanMatch } from "ui/helpers/formatters";
import { INITIAL_MAP_PIN } from "ui/configs/map";
import axios from "axios";

export const DROP_PINS = "DROP_PINS";
export const CLEAR_PINS = "CLEAR_PINS";
export const GET_CUSTOM_WEIGHTS = "GET_CUSTOM_WEIGHTS";
export const UPDATE_CUSTOM_WEIGHTS = "UPDATE_CUSTOM_WEIGHTS";
export const UPDATE_PARCEL_SHADING = "UPDATE_PARCEL_SHADING";
export const CENTER_MAP_LOCATION = "CENTER_MAP_LOCATION";
export const ADD_PROPERTY_REPORT_INFO = "ADD_PROPERTY_REPORT_INFO";
export const CLEAR_PROPERTY_REPORT_INFO = "CLEAR_PROPERTY_REPORT_INFO";

export function dropPins(pins) {
  return async function(dispatch) {
    dispatch({
      pins: pins.map(pin => normalizeMapParams(pin)),
      type: DROP_PINS
    });
  };
}

export function clearPins(pins) {
  return async function(dispatch) {
    dispatch({
      pins: pins,
      type: CLEAR_PINS
    });
  };
}

export function centerMap(params) {
  return async function(dispatch) {
    const { lat, lon } = params;
    dispatch({ lat, lon, type: CENTER_MAP_LOCATION });
  };
}

export function addPropertyReportInfo(parcelInfo) {
  return async function(dispatch) {
    dispatch({
      parcelInfo,
      type: ADD_PROPERTY_REPORT_INFO
    });
  };
}

export function clearPropertyReportInfo() {
  return async function(dispatch) {
    dispatch({
      type: CLEAR_PROPERTY_REPORT_INFO
    });
  };
}

function getCustomWeights(customWeights, userId) {
  return {
    customWeights,
    userId,
    type: GET_CUSTOM_WEIGHTS
  };
}

export function getTheInitialCustomWeights(userId) {
  return async function(dispatch) {
    try {
      const response = await apiFetch("/api/users/customWeights", {
        method: "get"
      });
      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(responseBody.error);
      }
      dispatch(getCustomWeights(responseBody, userId));
    } catch (error) {
      return [];
    }
  };
}

export function updateParcelShadingSpecs(params) {
  return async function(dispatch) {
    const { shadingMethod, nationalParcelShading } = params;

    dispatch({
      shadingMethod,
      nationalParcelShading,
      type: UPDATE_PARCEL_SHADING
    });
  };
}

export function setCustomWeights(params) {
  return async function() {
    try {
      const response = await apiFetch("/api/users/customWeights", {
        method: "post",
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.error);
      }
    } catch (error) {
      return [];
    }
  };
}

export function updateCustomWeights(params) {
  return async function(dispatch) {
    const {
      property_type,
      user_id,
      safety,
      trnsprt,
      vitalty,
      economc,
      sptl_dm,
      amenity
    } = params;

    dispatch({
      property_type,
      user_id,
      safety,
      trnsprt,
      vitalty,
      economc,
      sptl_dm,
      amenity,
      type: UPDATE_CUSTOM_WEIGHTS
    });
  };
}

export function normalizeMapParams(params) {
  return mapObjIndexed((val, key, _idx) => {
    if (key === "match") {
      return cleanMatch(val.html);
    }
    return key == "dropPin" ? val : val.toString();
  }, reject(isNil, params));
}

export async function getParcelAddresses(lat, long, map_dmp_id) {
  try {
    const response = await apiFetch(
      `${
        process.env.METROPOLIS_URL
      }api/reverseGeocode/cls?lat=${lat}&long=${long}&map_dmp_id=${map_dmp_id}`,
      {
        method: "get"
      }
    );
    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error(responseBody.error.message);
    }
    return responseBody;
  } catch (error) {
    return [];
  }
}

export function getInitialMapLatLong() {
  return async function(dispatch) {
    try {
      const response = await axios.get("https://jsonip.com?callback=?");
      const responseBody = JSON.parse(
        response.data.slice(2, response.data.length - 2)
      );
      const clientIp = responseBody.ip;
      const locationResponse = await apiFetch(
        `/api/getUserLatLong?clientIp=${clientIp}`,
        { method: "get" }
      );
      if (!locationResponse.ok) {
        return dispatch({
          ...INITIAL_MAP_PIN,
          type: CENTER_MAP_LOCATION
        });
      }
      const locationDetails = await locationResponse.json();
      const { lat, lon } = locationDetails;
      dispatch({ lat, lon, type: CENTER_MAP_LOCATION });
    } catch (e) {
      dispatch({ ...INITIAL_MAP_PIN, type: CENTER_MAP_LOCATION });
    }
  };
}

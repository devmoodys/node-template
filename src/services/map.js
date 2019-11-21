import {
  upperCaseFirstLetter,
  orderObjsByStringSimilarity
} from "helpers/strings";
import { reject, isNil, intersection } from "ramda";
import * as stateAbbreviations from "services/search/stateAbbreviations.json";
import cityHash from "services/search/cities.js";

const partnerModules = {
  cls: require("partners/cls"),
  reis: require("partners/reis")
};
// dmp_id is there to filter addresses by parcel when reverse geocoding cls.
// it doesn't necessarily have to be there if you want to reverse geocode reis, etc.
// we compare the search_dmp_id with the map_dmp_id to determine whether to show the address in map.
export async function getAddressesFromLatLong(lat, long, partner, map_dmp_id) {
  const addressObjects = await partnerModules[partner].reverseGeocode(
    lat,
    long
  );

  let propertyList = getPropertyList(addressObjects);
  if (partner === "cls") {
    propertyList = reject(
      isNil,
      propertyList.map(clsProperty => {
        const { dmp_id: search_dmp_id, reis_id: reisId } = extractId(
          clsProperty.id
        );
        if (search_dmp_id !== map_dmp_id) {
          return null;
        }
        clsProperty.reisId = reisId;
        return clsProperty;
      })
    );
  }
  return propertyList.map(listProperty => {
    return { ...listProperty, address: propertyToAddress(listProperty) };
  });
}

function getPropertyList(addressObjects) {
  return addressObjects.map(addressObject => {
    const property = addressObject.properties;
    const [long, lat] = addressObject.geometry.coordinates;
    const { id, name, locality, region, postalcode } = property;
    return { id, name, locality, region, postalcode, lat, long };
  });
}

export function propertyToAddress(property) {
  const name = property.name;
  const city = upperCaseFirstLetter(property.locality);
  const state = property.region;
  const zip = property.postalcode;
  let base = [name, city, state].join(", ");
  if (zip) {
    return base + ` ${zip}`;
  }
  return base;
}

export function getCityStateFromAddressParser(esResponse) {
  const { parser, parsed_text: parsedText } = esResponse.geocoding.query;
  if (!parsedText) {
    return { city: null, state: null };
  }

  let city = parsedText.city && parsedText.city.toLowerCase();
  let state = parsedText.state && parsedText.state.toLowerCase();

  if (!city && parser === "addressit") {
    const regions =
      parsedText.regions &&
      parsedText.regions.map(region => region.toLowerCase());
    if (regions) {
      city = regions.find(r => cityHash[r] === true);
    }
  }

  return { city, state };
}

export function filterEsFeatures(esResponse, source) {
  const { city, state } = getCityStateFromAddressParser(esResponse);
  let features = [];
  if (city && state) {
    features = esResponse.features.filter(feature => {
      return (
        sameCity(feature.properties.locality, city) &&
        sameState(feature.properties.region, state)
      );
    });
  } else if (city && !state) {
    features = esResponse.features.filter(feature =>
      sameCity(feature.properties.locality, city)
    );
  } else if (state && !city) {
    features = esResponse.features.filter(feature =>
      sameState(feature.properties.region, state)
    );
  } else {
    features = esResponse.features;
  }
  if (source) {
    features = features.filter(feature => {
      if (source === "whosonfirst") {
        return (
          feature.properties.source === source &&
          feature.properties.country === "United States"
        );
      }
      return feature.properties.source === source;
    });
  }
  // I'm limiting the number of filtered results that come back to only 10
  return orderObjsByStringSimilarity(
    esResponse.geocoding.query.text,
    features.slice(0, 10),
    feature => propertyToAddress(feature.properties)
  );
}

export function sameCity(city1, city2) {
  if (!city1 || !city2) {
    return false;
  }
  return city1.toLowerCase() === city2.toLowerCase();
}

export function sameState(state1, state2) {
  if (!state1 || !state2) {
    return false;
  }
  let state1_expanded = stateAbbreviations[state1.toUpperCase()];
  state1_expanded = state1_expanded && state1_expanded.toLowerCase();
  let state2_expanded = stateAbbreviations[state2.toUpperCase()];
  state2_expanded = state2_expanded && state2_expanded.toLowerCase();
  return (
    intersection(
      reject(isNil, [state1.toLowerCase(), state1_expanded]),
      reject(isNil, [state2.toLowerCase(), state2_expanded])
    ).length > 0
  );
}
// looks like dmp_id:xxx:reis_id:yyy:6
export function extractId(propertyId) {
  const split = propertyId.split(":");
  const dmp_id = cleanId(split[1]);
  const reis_id = cleanId(split[3]) || "noReisId";
  return { dmp_id, reis_id };
}

export function extractIdRMP(propertyId) {
  const split = propertyId.split(":");
  const retailerId = cleanId(split[1]);
  const retailerName = cleanId(split[3]);
  return { retailerId, retailerName };
}

function cleanId(id) {
  if (!id || id === "undefined") {
    return null;
  }
  return id;
}

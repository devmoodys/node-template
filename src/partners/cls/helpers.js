import { reject, isNil } from "ramda";
import zipcodes from "zipcodes";
import { pipLookup } from "partners/cls/index";
import { upperCaseFirstLetter } from "helpers/strings";
import { extractId } from "services/map";

export const DEFAULT_CLS_DATA_TAGS = ["addressInformation", "propertyType"];

const locationScoreMappings = {
  cre_of: "Office Properties",
  cre_in: "Industrial",
  cre_rt: "Retail",
  cre_ho: "Hotel",
  cre: "Overall Composite",
  cre_mf: "Multi-family (Apts)"
};

export const propertyTypeMappings = {
  OF: "Office",
  MF: "Multi-Family",
  IN: "Industrial",
  RT: "Retail",
  LO: "Hotel",
  HO: "Hotel"
};

export function locationScoreObjToReadable(locationScoreObj) {
  const clsObj = {};
  Object.keys(locationScoreObj).forEach(creScoreType => {
    if (!locationScoreMappings[creScoreType]) {
      return;
    }
    clsObj[creScoreType] = {};
    clsObj[creScoreType].description = locationScoreMappings[creScoreType];
    clsObj[creScoreType].value = locationScoreObj[creScoreType];
  });
  return clsObj;
}

export function getAddressStringHtml(streetAddress, city, st, zip) {
  return `${streetAddress ? `<em>${streetAddress}</em>` + ", " : ""}${
    city ? `<em>${city}</em>` + ", " : ""
  }${st ? `<em>${st}</em>` + " " : ""}${zip ? `<em>${zip}</em>` : ""}`;
}

export function clsPropertyToInterchangeFormat(property) {
  const { locationScoreObj } = property;

  return {
    latitude: property.lat,
    longitude: property.lon,
    lat: property.lat,
    lon: property.lon,
    locationScoreObj: locationScoreObjToReadable(locationScoreObj),
    leases: [],
    address: property.address,
    updatedAt: "2018-06-27",
    type: propertyTypeMappings[property.locationScoreObj.prp_typ],
    property_type: propertyTypeMappings[property.locationScoreObj.prp_typ],
    transportation: locationScoreObj.trnsprt,
    trnsprt_percentile: locationScoreObj.trnsprt_percentile,
    amenity: locationScoreObj.amenity,
    amenity_percentile: locationScoreObj.amenity_percentile,
    locationScore: locationScoreObj.cre,
    cre_percentile: locationScoreObj.cre_percentile,
    cre_ho: locationScoreObj.cre_ho,
    cre_ho_percentile: locationScoreObj.cre_ho_percentile,
    cre_of: locationScoreObj.cre_of,
    cre_of_percentile: locationScoreObj.cre_of_percentile,
    cre_mf: locationScoreObj.cre_mf,
    cre_mf_percentile: locationScoreObj.cre_mf_percentile,
    cre_rt: locationScoreObj.cre_rt,
    cre_rt_percentile: locationScoreObj.cre_rt_percentile,
    cre_in: locationScoreObj.cre_in,
    cre_in_percentile: locationScoreObj.cre_in_percentile,
    safety: locationScoreObj.safety,
    safety_percentile: locationScoreObj.safety_percentile,
    msa: locationScoreObj.msa,
    economicProsperity: locationScoreObj.economc,
    economc_percentile: locationScoreObj.economc_percentile,
    sptl_dm_percentile: locationScoreObj.sptl_dm_percentile,
    spatial_demand: locationScoreObj.sptl_dm,
    businessVitality: locationScoreObj.vitalty,
    vitalty_percentile: locationScoreObj.vitalty_percentile,
    economc_percentile_nat: locationScoreObj.economc_percentile_nat,
    sptl_dm_percentile_nat: locationScoreObj.sptl_dm_percentile_nat,
    vitalty_percentile_nat: locationScoreObj.vitalty_percentile_nat,
    trnsprt_percentile_nat: locationScoreObj.trnsprt_percentile_nat,
    amenity_percentile_nat: locationScoreObj.amenity_percentile_nat,
    safety_percentile_nat: locationScoreObj.safety_percentile_nat,
    cre_of_percentile_nat: locationScoreObj.cre_of_percentile_nat,
    cre_mf_percentile_nat: locationScoreObj.cre_mf_percentile_nat,
    cre_in_percentile_nat: locationScoreObj.cre_in_percentile_nat,
    cre_rt_percentile_nat: locationScoreObj.cre_rt_percentile_nat,
    cre_ho_percentile_nat: locationScoreObj.cre_ho_percentile_nat,
    cre_percentile_nat: locationScoreObj.cre_percentile_nat,
    msa_percentile_nat: locationScoreObj.cre_percentile_nat,
    reisId: property.reis_id,
    dmpId: property.dmp_id,
    match: {
      label: "Address",
      html: property.address || ""
    }
  };
}
// updatedAt is hardcoded for now.
async function clsResultToSearchResult(result) {
  const [lon, lat] = result.geometry.coordinates;
  let {
    streetAddress,
    city,
    state,
    zip,
    dmp_id,
    reis_id
  } = createCLSPropertyObj(result.properties);
  let addressObject;
  if (zip && !city && !state) {
    addressObject = zipcodes.lookup(zip.match(/\d+/)[0]);
  }
  if (!zip && !city && !state && process.env.SHOULD_DO_PIP_LOOKUP === "true") {
    addressObject = await pipLookup(lat, lon);
  }
  if (!addressObject && !dmp_id) {
    return null;
  }
  if (addressObject) {
    city = addressObject.city;
    state = addressObject.state;
  }

  return {
    dataTags: DEFAULT_CLS_DATA_TAGS,
    type: "property",
    updatedAt: "2018-06-27",
    match: {
      label: "Address",
      html: getAddressStringHtml(streetAddress, city, state, zip)
    },
    entityId: JSON.stringify({
      streetAddress,
      city,
      state,
      zip,
      lat,
      lon,
      dmp_id,
      reis_id
    }),
    ratio: result.ratio
  };
}

export async function clsResponseToSearchResults(response) {
  const filteredResults = reject(
    isNil,
    await Promise.all(
      response.map(result => {
        return clsResultToSearchResult(result);
      })
    )
  );
  return {
    total: filteredResults.length,
    results: filteredResults,
    dataTags: DEFAULT_CLS_DATA_TAGS
  };
}

export function processPipResult(result) {
  let city, state;
  if (result.region && result.region.length > 0) {
    state = result.region[0].name;
  } else if (result.county && result.county.length > 0) {
    state = result.county[0].name;
  }
  if (result.locality && result.locality.length > 0) {
    city = result.locality[0].name;
  } else if (result.localadmin && result.localadmin.length > 0) {
    city = result.localadmin[0].name;
  } else if (result.county && result.county.length > 0) {
    city = result.county[0].name;
  }
  return { city, state };
}

export function createCLSPropertyObj(property) {
  const { dmp_id, reis_id } = extractId(property.id);
  return {
    streetAddress: property.name,
    city: upperCaseFirstLetter(property.locality),
    state: property.region,
    zip: property.postalcode,
    dmp_id,
    reis_id
  };
}

import data from "./clsMappings.json";
import { isBlank } from "helpers/presence";

export function getScoreAndPercentileWithType(clsData, typeOverride) {
  if (isBlank(clsData)) {
    return { type: "", score: "" };
  }
  if (typeOverride === "undefined") {
    typeOverride = null;
  }
  let type = typeOverride || clsData.type || "";
  const apiType = data.typeToApiTypeTranslation[type.toLowerCase()];
  const percentileType =
    data.typeToApiPercentileTranslation[type.toLowerCase()];
  const score = clsData[apiType] || "";
  const percentile = clsData[percentileType] || "";
  return { type, score, percentile };
}

export function getLocationScoreTypeFromType(type) {
  return data.locationScoreTypes[type.toLowerCase()];
}

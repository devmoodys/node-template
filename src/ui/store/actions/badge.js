import { externalApiFetch } from "ui/store/actions/apiClient";
import { parse, stringify } from "query-string";
import { getScoreAndPercentileWithType } from "ui/helpers/typeScoreConversion";

export async function getBadge(queryString) {
  const queryObject = parse(queryString);
  const { address, lat, long, type: typeOverride } = queryObject;
  const token = decodeURIComponent(queryObject.token);
  let response;
  if (lat && long) {
    response = await externalApiFetch(
      `${process.env.METROPOLIS_URL}api/v1/badge/reverse?${stringify({
        lat,
        long
      })}`,
      null,
      token
    );
  } else if (address) {
    response = await externalApiFetch(
      `${process.env.METROPOLIS_URL}api/v1/badge?${stringify({ address })}`,
      null,
      token
    );
  }
  if (!response.ok) {
    throw new Error();
  }
  const responseBody = await response.json();
  const clsData = responseBody;
  const { type, score, percentile } = getScoreAndPercentileWithType(
    clsData,
    typeOverride
  );
  clsData.type = type;
  clsData.property_type = type;
  clsData.locationScore = score;
  clsData.cre_percentile = percentile;
  return clsData;
}

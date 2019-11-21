import { filter, isEmpty } from "ramda";
import { isPresent } from "./presence";

export default function joinIfPresent(values, delimiter) {
  const presentValues = filter(isPresent, values || []);
  if (isEmpty(presentValues)) {
    return null;
  }
  return presentValues.join(delimiter);
}

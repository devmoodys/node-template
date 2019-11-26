import { is } from "ramda";
import { isBlank } from "./presence";

export default function asArray(value) {
  if (isBlank(value)) {
    return [];
  }
  if (is(Array, value)) {
    return value;
  }
  return [value];
}
//

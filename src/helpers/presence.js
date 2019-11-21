import { complement, either, isEmpty, isNil } from "ramda";

export const isBlank = either(isNil, isEmpty);
export const isPresent = complement(isBlank);
export const isURIComponentPresent = val => Boolean(val) && val !== "undefined";

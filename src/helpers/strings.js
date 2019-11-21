import { compareTwoStrings } from "string-similarity";
import crypto from "crypto";
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes.bind(crypto));

export function upperCaseFirstLetter(string) {
  return (
    string &&
    string
      .split(" ")
      .map(
        substring =>
          substring.charAt(0).toUpperCase() + substring.slice(1).toLowerCase()
      )
      .join(" ")
  );
}

export function upperCaseFirstLetterOfFirstWord(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function regexpEscape(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export function makeTermInStringBold(string, termToMatch) {
  const escaped = regexpEscape(termToMatch);
  const termMatch = new RegExp(`(.*)(${escaped})(.*)`, "gi");
  return string.replace(termMatch, "$1<em>$2</em>$3");
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function orderObjsByStringSimilarity(
  comparisonString,
  objs,
  extractionFunction
) {
  const objsWithRatios = objs.map(obj => {
    const string = extractionFunction(obj);
    return {
      ...obj,
      ratio: compareTwoStrings(
        comparisonString.toLowerCase(),
        string.toLowerCase()
      )
    };
  });
  const ordered = objsWithRatios.sort((a, b) => b.ratio - a.ratio);
  return ordered;
}

export function removeHtmlFromString(str) {
  if (!str) {
    return "";
  }
  return str.replace(/<[^>]*>/g, "");
}

export async function randomBase64String() {
  const buf = await randomBytes(48);
  return buf
    .toString("base64")
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
}

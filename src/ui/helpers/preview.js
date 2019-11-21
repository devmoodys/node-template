import { find, propEq, equals } from "ramda";
import { EMPTY, FAILED, LOADING, LOADED } from "ui/store/reducers/preview";
import { isBlank } from "helpers/presence";

export function isAppLinkVisible(partner, type, status) {
  // TODO: allow CMBS loan linking once CMBS API exposes proper loans
  if ([EMPTY, FAILED].includes(status)) {
    return false;
  }
  if (partner === "cmbs" && type === "loan") {
    return false;
  }
  if (["cls", "places"].includes(partner)) {
    return false;
  }
  // reis has appPropertyId lookup when loading the preview and this resets the links, so don't display until loaded
  if (["reis"].includes(partner) && status !== LOADED) {
    return false;
  }
  return true;
}

export function isImportFormVisible(partner, result, status, partners) {
  return (
    ![
      "cls",
      "cmm",
      "places",
      "infabode",
      "commercialex",
      "enricheddata",
      "retailmarketpoint",
      "databuffet",
      "fourtwentyseven"
    ].includes(partner) &&
    status !== FAILED &&
    status !== EMPTY &&
    result.type === "property" &&
    find(propEq("partner", partner))(partners) &&
    find(propEq("partner", partner))(partners).status === "connected"
  );
}

export function isPreviewVisible(status) {
  if ([EMPTY, LOADING, LOADED, FAILED].includes(status)) {
    return true;
  }
  return false;
}

export function getTarget(view, partner, app) {
  if (view === "widget") {
    if (partner === app) {
      return "_top";
    }
  }
  return "_blank";
}

export function isPropertyLocked(data) {
  if (data === null || equals(data, [])) {
    return true;
  } else {
    return false;
  }
}

export function isPartnerLoggedIn(partner, partners) {
  if (
    isBlank(partner) ||
    isBlank(partners) ||
    isBlank(find(propEq("partner", partner))(partners))
  ) {
    return false;
  }
  return find(propEq("partner", partner))(partners).status === "disconnected"
    ? false
    : true;
}

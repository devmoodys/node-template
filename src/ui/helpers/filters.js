import { stringify } from "query-string";
import { reject } from "ramda";
import {
  partnerAppNames,
  searchForNoPartners,
  removeNullPartnerFromSearchPartners,
  NULL_PARTNER
} from "ui/helpers/apps";
import { isBlank } from "helpers/presence";

export function addFilterToSearch(history, tag, search) {
  const { q, tags, partners } = search;
  if (tags) {
    if (!tags.includes(tag)) {
      tags.push(tag);
      updateHistory(history, q, tags, partners);
    }
  } else {
    updateHistory(history, q, [tag], partners);
  }
}

export function removeFilterFromSearch(history, tag, search) {
  const { q, tags, partners } = search;
  if (tags && tags.includes(tag)) {
    const index = tags.indexOf(tag);
    tags.splice(index, 1);
    updateHistory(history, q, tags, partners);
  }
}

export function addPartnerFilterToSearch(history, partner, search) {
  let { q, tags, partners } = search;
  partners = isBlank(partners) ? Object.keys(partnerAppNames) : partners;
  if (!partners.includes(partner)) {
    partners.push(partner);
    partners = removeNullPartnerFromSearchPartners(partners);
    updateHistory(history, q, tags, partners);
  }
}

export function removePartnerFilterFromSearch(history, partner, search) {
  let { q, tags, partners } = search;
  partners = isBlank(partners) ? Object.keys(partnerAppNames) : partners;
  if (partners.includes(partner)) {
    const index = partners.indexOf(partner);
    partners.splice(index, 1);
    if (isBlank(partners)) {
      partners.push(NULL_PARTNER);
    }
    updateHistory(history, q, tags, partners);
  }
}

export function addAllPartnerFiltersToSearch(history, search) {
  let { q, tags } = search;
  const partners = Object.keys(partnerAppNames);
  updateHistory(history, q, tags, partners);
}

export function removeAllPartnerFiltersFromSearch(history, search) {
  let { q, tags } = search;
  const partners = searchForNoPartners();
  updateHistory(history, q, tags, partners);
}

export function queryString(pathname, q, tags, partners) {
  const query = stringify({ q, tags, partners });
  return `${pathname}?${query}`;
}

export function updateHistory(history, q, tags, partners) {
  if (history) {
    history.push(queryString(history.location.pathname, q, tags, partners));
  }
}

export const filterEmptyPartners = reject(count => count == 0);

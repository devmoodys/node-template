import {
  partnerAppNames,
  removeNullPartnerFromSearchPartners
} from "ui/helpers/apps";
import { isBlank } from "helpers/presence";
import { isEmpty } from "ramda";
import { stringify } from "query-string";

export function getOtherPartnersTotal(otherPartners) {
  let total = 0;

  if (!otherPartners) {
    return total;
  }

  Object.keys(otherPartners).forEach(partner => {
    const numResults = otherPartners[partner];
    total += numResults;
  });
  return total;
}

export function noResultsFound(response) {
  // this checks if the total is 0 and no other partner results exist
  return response.total == 0 && isBlank(response.otherPartners);
}

export function addPartnerToSearchQuery(partner, search, updateSearch) {
  let { q, tags, partners } = search;
  if (!partners.includes(partner)) {
    partners.push(partner);
    partners = removeNullPartnerFromSearchPartners(partners);
    updateSearch(q, tags, partners);
  }
}

export function removePartnerFromSearchQuery(partner, search, updateSearch) {
  let { q, tags, partners } = search;
  if (partners.includes(partner)) {
    const index = partners.indexOf(partner);
    partners.splice(index, 1);
    updateSearch(q, tags, partners);
  }
}

export function addAllPartnersToSearchQuery(search, updateSearch) {
  let { q, tags } = search;
  const partners = Object.keys(partnerAppNames);
  updateSearch(q, tags, partners);
}

export function removeAllPartnersFromSearchQuery(search, updateSearch) {
  let { q, tags } = search;
  const partners = [];
  updateSearch(q, tags, partners);
}

export function getWidgetPathname(history, searchParams) {
  const { location: pathname } = history;
  return pathname === "/widget/"
    ? `/?${searchParams}`
    : `/widget/?${searchParams}`;
}

export function navigateToSearch(history, q, tags, partners) {
  if (isEmpty(partners)) {
    return;
  }
  if (history) {
    const searchParams = stringify({ q, tags, partners });
    history.push(getWidgetPathname(history, searchParams));
  }
}

export function filterRelevantResults(results, relevantResults) {
  let hash = {};
  results.forEach(result => {
    hash[result.id] = true;
  });
  return relevantResults.filter(relevantResult => !hash[relevantResult.id]);
}

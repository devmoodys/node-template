import React from "react";
import moment from "moment";
import { isNil, prop, sortBy, replace } from "ramda";
import unescape from "unescape";

import { isBlank } from "helpers/presence";

export function formatDateToMMDDYY(date) {
  if (date) {
    return moment(date).format("MM/DD/YY");
  }
}

export function formatLeaseDateToMMDDYYYY(date) {
  if (date) {
    return moment(date).format("MM/DD/YYYY");
  }
}

export function formatRent(rent) {
  if (!rent) {
    return;
  }
  return formatCurrency(rent);
}

export function formatPropertySize(size) {
  if (size) {
    return size.toLocaleString();
  }
}

export function formatBoolean(value) {
  if (isNil(value)) {
    return;
  }

  return value ? "Yes" : "No";
}

export function formatNoi(noi) {
  if (isBlank(noi)) {
    return;
  }
  const firstNoi = sortBy(prop("referenceDate"), noi)[0];
  return formatDollarAmountAsOfDate(firstNoi.noi, firstNoi.referenceDate);
}

export function formatValuation(valuation) {
  if (!valuation) {
    return;
  }

  return formatDollarAmountAsOfDate(
    valuation.valuation,
    valuation.referenceDate
  );
}

export function formatCurrency(amount) {
  return amount
    ? Number(amount).toLocaleString("en", {
        style: "currency",
        currency: "USD"
      })
    : null;
}

function formatDollarAmountAsOfDate(amount, referenceDate) {
  // FIXME: why is referenceDate not already a moment?
  const date = moment(referenceDate).format("MMM YY");
  return `${formatCurrency(amount)} (${date})`;
}

export function formatDecimalToPercent(decimal) {
  if (decimal) {
    return `${decimal * 100}%`;
  } else {
    return null;
  }
}

export function highlightIfMatched(match, text, comparator) {
  if (text && match && comparator(match, text)) {
    return <span className="match-highlight">{text}</span>;
  }

  return text;
}

export function textIsAMatch(match, text) {
  return isBlank(text) ? false : text.toString() === cleanMatch(match);
}

export function matchContainsText(match, text) {
  return cleanMatch(match).includes(text.toString());
}

export function cleanMatch(match) {
  return unescapeApostrophe(unescape(replace(/<\/*[\w]+>/g, "", match)));
}

export function unescapeApostrophe(match) {
  return replace("&#x27;", "'", match);
}

export function formatNumber(number) {
  return number ? parseFloat(number) : "";
}

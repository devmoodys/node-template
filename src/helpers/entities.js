import { filter, path } from "ramda";
import moment from "moment";

export const dateTypes = [
  "updatedAt",
  "referenceDate",
  "leaseStartDate",
  "leaseEndDate",
  "originationDate",
  "maturityDate"
];

// const cantBeNull = ["lease.tenantName"];
// These special instructions are mostly for
const specialInstructions = {
  "lease.spaceType": value => {
    return value === "Other" ? "Office" : value;
  },
  "lease.tenantName": value => {
    return value ? value : "----";
  },
  "lease.leaseStartDate": value => {
    return value ? value : "----";
  },
  "lease.leaseEndDate": value => {
    return value ? value : "----";
  },
  "lease.transactionSize": value => {
    return value ? value : 0;
  },
  "property.type": value => {
    return value ? value : "Industrial";
  }
};

export function isCurrentLease({ leaseStartDate, leaseEndDate }) {
  if (!leaseStartDate || !leaseEndDate) return false;
  const now = Date.now();
  return now < new Date(leaseEndDate);
}

export function getCurrentLeases(leases) {
  return filter(isCurrentLease, leases);
}

export function extractData(propPath, data, propToMapTo) {
  if (dateTypes.includes(propToMapTo)) {
    return moment(path(propPath, data));
  }
  const propValue = path(propPath, data);
  const prop = propPath.join(".");
  if (Object.keys(specialInstructions).includes(prop)) {
    return specialInstructions[prop](propValue);
  }
  return propValue;
}

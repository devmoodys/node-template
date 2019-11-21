import {
  ascend,
  curry,
  descend,
  prop,
  path,
  sortWith,
  sortBy,
  filter,
  groupBy,
  keys,
  reverse,
  slice,
  reduce,
  pluck
} from "ramda";
import { isBlank } from "helpers/presence";

import { isCurrentLease } from "helpers/entities";

function blankLast(sortFn, valueFn, a, b) {
  const blankA = isBlank(valueFn(a));
  const blankB = isBlank(valueFn(b));

  if (blankA && blankB) {
    return 0;
  }
  if (blankA) {
    return 1;
  }
  if (blankB) {
    return -1;
  }

  return sortFn(valueFn)(a, b);
}

const ascendBlankLast = curry(blankLast)(ascend);
const descendBlankLast = curry(blankLast)(descend);

export const sortLeases = sortWith([
  ascendBlankLast(prop("tenantName")),
  descendBlankLast(prop("size")),
  descendBlankLast(prop("leaseStartDate"))
]);

export const sortProperties = sortWith([
  descendBlankLast(path(["valuations", "0", "valuation"])),
  descendBlankLast(path(["noi", "0", "noi"])),
  ascendBlankLast(prop("msa")),
  ascendBlankLast(prop("address"))
]);

export function largestTenantNames(leases) {
  const currentLeases = filter(isCurrentLease, leases);
  const groupedCurrent = groupBy(lease => {
    return lease.tenantName;
  }, currentLeases);
  const tenants = keys(groupedCurrent);
  const sortedTenants = reverse(
    sortBy(tenant => totalSqftForTenant(groupedCurrent[tenant]), tenants)
  );
  return slice(0, 5, sortedTenants);
}

export function totalSqftForTenant(leases) {
  return reduce(
    (acc, lease) => {
      return lease.transactionSize ? acc + lease.transactionSize : acc;
    },
    0,
    leases
  );
}

export function topTrancheCusipIsins(tranches) {
  return pluck("cusipIsin", tranches).slice(0, 10);
}

export function topLoanNames(loans) {
  return pluck("loanName", loans);
}

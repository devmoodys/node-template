import { mergeAll, merge } from "ramda";

const FILTERS = {
  company: (users, companyId) => {
    return users.filter(user => user.company_id === parseInt(companyId));
  },
  role: (users, role) => {
    return users.filter(user => user.role === role);
  },
  status: (users, status) => {
    return users.filter(user => user.status === status);
  }
};

export function runFiltersAfterFetch(state, users) {
  let { filters, filteredCompanyId, filteredRole, filteredStatus } = state;
  if (filters.length === 0) {
    return merge(state, { users, status: "LOADED" });
  }

  const newUserRowArray = runToggledFilters(
    filters,
    users,
    filteredCompanyId,
    filteredRole,
    filteredStatus
  );

  if (newUserRowArray.length === 0) {
    newUserRowArray.push({ nousers: true });
  }

  return merge(state, {
    users,
    filteredResults: newUserRowArray,
    filteredRole,
    filters,
    status: "LOADED"
  });
}

export function runFiltersAndReturnState(state, action, filterString) {
  const {
    users,
    filters,
    filteredCompanyId,
    filteredRole,
    filteredStatus
  } = state;
  const filterType = getFilterType(action);

  const companyId = filterType === "company" ? filterString : filteredCompanyId;
  const role = filterType === "role" ? filterString : filteredRole;
  const status = filterType === "status" ? filterString : filteredStatus;

  const newFilters =
    filterString === "all"
      ? removeAndUpdateFilters(filters, filterType)
      : addAndUpdateFilters(filters, filterType);

  const newUserRowArray = runToggledFilters(
    newFilters,
    users,
    companyId,
    role,
    status
  );

  if (newUserRowArray.length === 0 && newFilters.length > 0) {
    newUserRowArray.push({ nousers: true });
  }

  return mergeAll([
    state,
    {
      filteredResults: newUserRowArray,
      filters: newFilters,
      status: "LOADED"
    },
    returnUpdatedFilter(filterType, filterString)
  ]);
}

function getFilterType(action) {
  if (action.hasOwnProperty("companyId")) {
    return "company";
  } else if (action.hasOwnProperty("role")) {
    return "role";
  } else if (action.hasOwnProperty("status")) {
    return "status";
  }
}

function returnUpdatedFilter(filterType, newFilterString) {
  switch (filterType) {
    case "company":
      return { filteredCompanyId: newFilterString };
    case "role":
      return { filteredRole: newFilterString };
    case "status":
      return { filteredStatus: newFilterString };
  }
}

function runToggledFilters(
  filters,
  users,
  filteredCompanyId,
  filteredRole,
  filteredStatus
) {
  if (filters.length === 0) {
    return [];
  }
  let filteredResult = users;

  filters.forEach(filter => {
    switch (filter) {
      case "company":
        filteredResult = FILTERS.company(filteredResult, filteredCompanyId);
        break;
      case "role":
        filteredResult = FILTERS.role(filteredResult, filteredRole);
        break;
      case "status":
        filteredResult = FILTERS.status(filteredResult, filteredStatus);
        break;
    }
  });

  return filteredResult;
}

const removeAndUpdateFilters = (filters, filterToRemove) =>
  filters.filter(f => f !== filterToRemove);

const addAndUpdateFilters = (filters, filterToAdd) => {
  let updatedFilters = filters;

  if (updatedFilters.includes(filterToAdd)) {
    updatedFilters = removeAndUpdateFilters(updatedFilters, filterToAdd);
  }

  updatedFilters.push(filterToAdd);
  return updatedFilters;
};

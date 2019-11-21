import { apiFetch } from "./apiClient";
import { showFlash } from "./flash";

export const COMPANIES_FETCHING = "COMPANIES_FETCHING";
export const COMPANIES_FETCH_SUCCESSFUL = "COMPANIES_FETCH_SUCCESSFUL";
export const COMPANIES_FETCH_FAILED = "COMPANIES_FETCH_FAILED";

export function fetchCompanies() {
  return async function(dispatch) {
    dispatch(companiesFetching());

    try {
      const response = await apiFetch("/api/companies");
      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(responseBody.error.message);
      }
      dispatch(companiesFetchSuccessful(responseBody));
    } catch (error) {
      dispatch(companiesFetchFailed(error));
    }
  };
}

function companiesFetching() {
  return {
    type: COMPANIES_FETCHING
  };
}

function companiesFetchSuccessful(companies) {
  return {
    companies,
    type: COMPANIES_FETCH_SUCCESSFUL
  };
}

function companiesFetchFailed(error) {
  return {
    error,
    type: COMPANIES_FETCH_FAILED
  };
}

export function createNewCompany(params, history) {
  const {
    companyName,
    maxActiveUsers,
    accountActiveLengthAmmount,
    accountActiveLengthType
  } = params;
  const companyObj = {
    companyName,
    maxActiveUsers,
    accountActiveLength: `${accountActiveLengthAmmount} ${accountActiveLengthType}`
  };
  return async function(dispatch) {
    try {
      const response = await apiFetch("/api/companies/new", {
        method: "post",
        body: JSON.stringify(companyObj)
      });
      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(responseBody.error);
      }
      history.push("/admin/companies");
      dispatch(
        showFlash({
          type: "success",
          message: `Company ${companyName} was created.`
        })
      );
    } catch (e) {
      dispatch(
        showFlash({
          type: "error",
          message: `${e}`
        })
      );
    }
  };
}

export function updateCompany(companyId, endDate, maxActiveUsers) {
  const companyUpdateObj = {
    companyId,
    endDate,
    maxActiveUsers
  };
  return async function(dispatch) {
    try {
      const response = await apiFetch("/api/companies/update", {
        method: "put",
        body: JSON.stringify(companyUpdateObj)
      });
      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.error);
      }
      dispatch(
        showFlash({
          type: "success",
          message: `Company with id ${companyId} updated!`
        })
      );
      dispatch(fetchCompanies());
    } catch (e) {
      dispatch(
        showFlash({
          type: "error",
          message: `${e}`
        })
      );
    }
  };
}

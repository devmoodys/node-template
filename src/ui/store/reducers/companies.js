import { merge } from "ramda";

import {
  COMPANIES_FETCHING,
  COMPANIES_FETCH_SUCCESSFUL,
  COMPANIES_FETCH_FAILED
} from "ui/store/actions/companies";

export const FETCHING = "FETCHING";
export const LOADED = "LOADED";
export const FAILED = "FAILED";

export default function companies(
  state = { status: FETCHING, companies: [] },
  action
) {
  switch (action.type) {
    case COMPANIES_FETCHING: {
      return merge(state, { status: FETCHING });
    }
    case COMPANIES_FETCH_SUCCESSFUL: {
      const { companies } = action;
      return merge(state, { companies, status: LOADED });
    }
    case COMPANIES_FETCH_FAILED: {
      const { error } = action;
      return merge(state, { error, status: FAILED });
    }
    default:
      return state;
  }
}

import { merge } from "ramda";

import {
  USERS_FETCHING,
  USERS_FETCH_SUCCESSFUL,
  USERS_FETCH_FAILED,
  USERS_STATUS_UPDATING,
  USERS_STATUS_UPDATE_SUCCESSFUL,
  USER_DELETING,
  USER_DELETE_SUCCESSFUL,
  FILTER_USERS_BY_COMPANY,
  FILTER_USERS_BY_ROLE,
  FILTER_USERS_BY_STATUS
} from "ui/store/actions/users";

import {
  runFiltersAndReturnState,
  runFiltersAfterFetch
} from "./helpers/users";

export const FETCHING = "FETCHING";
export const UPDATING = "UPDATING";
export const UPDATED = "UPDATED";
export const LOADED = "LOADED";
export const FAILED = "FAILED";
export const DELETING = "DELETING";
export const DELETED = "DELETED";

export default function users(
  state = {
    status: FETCHING,
    filteredResults: [],
    users: [],
    filters: [],
    filteredCompanyId: "all",
    filteredRole: "all",
    filteredStatus: "all"
  },
  action
) {
  switch (action.type) {
    case USERS_FETCHING: {
      return merge(state, { status: FETCHING });
    }
    case USERS_FETCH_SUCCESSFUL: {
      const { users, currentUser } = action;
      return runFiltersAfterFetch(state, users, currentUser);
    }
    case USERS_FETCH_FAILED: {
      const { error } = action;
      return merge(state, { error, status: FAILED });
    }
    case USERS_STATUS_UPDATING: {
      return merge(state, { status: UPDATING });
    }
    case USERS_STATUS_UPDATE_SUCCESSFUL: {
      return merge(state, { status: UPDATED });
    }
    case USER_DELETING: {
      return merge(state, { status: DELETING });
    }
    case USER_DELETE_SUCCESSFUL: {
      return merge(state, { status: DELETED });
    }
    case FILTER_USERS_BY_COMPANY: {
      const { companyId } = action;
      return runFiltersAndReturnState(state, action, companyId);
    }
    case FILTER_USERS_BY_ROLE: {
      const { role } = action;
      return runFiltersAndReturnState(state, action, role);
    }
    case FILTER_USERS_BY_STATUS: {
      const { status } = action;
      return runFiltersAndReturnState(state, action, status);
    }
    default:
      return state;
  }
}

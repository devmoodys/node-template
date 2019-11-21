import { apiFetch, externalApiFetch } from "./apiClient";
import { showFlash } from "./flash";
import { stopSubmit } from "redux-form";
import { validEmail, validRole } from "ui/helpers/users";

export const USERS_FETCHING = "USERS_FETCHING";
export const USERS_FETCH_SUCCESSFUL = "USERS_FETCH_SUCCESSFUL";
export const USERS_FETCH_FAILED = "USERS_FETCH_FAILED";
export const USERS_STATUS_UPDATING = "USERS_STATUS_UPDATING";
export const USERS_STATUS_UPDATE_SUCCESSFUL = "USERS_STATUS_UPDATE_SUCCESSFUL";
export const USER_DELETING = "USER_DELETING";
export const USER_DELETE_SUCCESSFUL = "USER_DELETE_SUCCESSFUL";
export const FILTER_USERS_BY_COMPANY = "FILTER_USERS_BY_COMPANY";
export const FILTER_USERS_BY_ROLE = "FILTER_USERS_BY_ROLE";
export const FILTER_USERS_BY_STATUS = "FILTER_USERS_BY_STATUS";

export function fetchUsers() {
  return async function(dispatch, getState) {
    let { currentUser } = getState();
    dispatch(usersFetching());
    try {
      const response = await apiFetch("/api/users");
      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(responseBody.error.message);
      }
      dispatch(usersFetchSuccessful(responseBody, currentUser));
    } catch (error) {
      dispatch(usersFetchFailed(error));
    }
  };
}

export function toggleUserStatus(userId) {
  return async function(dispatch) {
    dispatch(userStatusUpdating());

    try {
      const reqBody = { userId };
      const response = await apiFetch("/api/users/toggleStatus", {
        method: "put",
        body: JSON.stringify(reqBody)
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.error);
      }
      dispatch(userStatusUpdateSuccessful());
      dispatch(fetchUsers());
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

function userStatusUpdating() {
  return {
    type: USERS_STATUS_UPDATING
  };
}

function userStatusUpdateSuccessful() {
  return {
    type: USERS_STATUS_UPDATE_SUCCESSFUL
  };
}

function usersFetching() {
  return {
    type: USERS_FETCHING
  };
}

function usersFetchSuccessful(users, currentUser) {
  return {
    users,
    currentUser,
    type: USERS_FETCH_SUCCESSFUL
  };
}

function usersFetchFailed(error) {
  return {
    error,
    type: USERS_FETCH_FAILED
  };
}

export function filterUsersByCompany(companyId) {
  return {
    companyId,
    type: FILTER_USERS_BY_COMPANY
  };
}

export function filterUsersByRole(role) {
  return {
    role,
    type: FILTER_USERS_BY_ROLE
  };
}

export function filterUsersByStatus(status) {
  return {
    status,
    type: FILTER_USERS_BY_STATUS
  };
}

export function createNewUser(params, history, access) {
  const { email, companyName, role } = params;
  const userBody = {
    email,
    companyName,
    role: access === "superadmin" ? "admin" : role
  };
  if (!validEmail(email)) {
    return stopSubmit("newUser", {
      _error: { email: "Please use a valid email." }
    });
  }

  if (!validRole(userBody.role, access)) {
    return stopSubmit("newUser", {
      _error: { role: "Please select a role." }
    });
  }

  return async function(dispatch) {
    try {
      const response = await apiFetch("/api/users/new", {
        method: "post",
        body: JSON.stringify(userBody)
      });
      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(responseBody.error);
      }
      history.push("/admin/users");
      dispatch(
        showFlash({
          type: "success",
          message: `User ${email} was created.`
        })
      );
      if (responseBody.frontendPasswordForDevs) {
        alert(
          `Password for user in development is ${
            responseBody.frontendPasswordForDevs
          }`
        );
      }
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

export function deleteUser(user) {
  return async function(dispatch) {
    const reqBody = { userId: user.id };
    dispatch(userDeleting());
    try {
      const response = await apiFetch("/api/users/delete", {
        method: "delete",
        body: JSON.stringify(reqBody)
      });
      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.error.message);
      }
      dispatch(userDeleteSuccessful());
      dispatch(
        showFlash({
          type: "success",
          message: `${user.email} has been deleted`
        })
      );
      dispatch(fetchUsers());
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

export function requestPasswordChange(email) {
  return async function(dispatch) {
    const reqBody = { email };
    try {
      const response = await apiFetch("/api/requestPassChange", {
        method: "post",
        body: JSON.stringify(reqBody)
      });
      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(responseBody.error);
      }
      dispatch(
        showFlash({
          type: "success",
          message: responseBody.message
        })
      );
      setTimeout(() => window.close(), 1500);
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

export function resetPassword(email, tempPassword, newPassword, token) {
  return async function(dispatch) {
    const reqBody = { email, tempPassword, newPassword };
    try {
      const response = await externalApiFetch(
        "/api/v1/resetPassword",
        {
          method: "post",
          body: JSON.stringify(reqBody)
        },
        decodeURIComponent(token)
      );
      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.error);
      }
      dispatch(
        showFlash({
          type: "success",
          message: "Password was reset successfully!"
        })
      );
      setTimeout(() => (window.location.pathname = "/login"), 1500);
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

export function userDeleting() {
  return {
    type: USER_DELETING
  };
}

export function userDeleteSuccessful() {
  return {
    type: USER_DELETE_SUCCESSFUL
  };
}

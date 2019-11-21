export const TOGGLE_ACCOUNT_DROP_DOWN = "TOGGLE_ACCOUNT_DROP_DOWN";
export const HIDE_ACCOUNT_DROP_DOWN = "HIDE_ACCOUNT_DROP_DOWN";
export const SHOW_APPS_SIDE_BAR = "SHOW_APPS_SIDE_BAR";
export const HIDE_APPS_SIDE_BAR = "HIDE_APPS_SIDE_BAR";
export const SHOW_APPS_MODAL = "SHOW_APPS_MODAL";
export const HIDE_APPS_MODAL = "HIDE_APPS_MODAL";

export function toggleDropDown() {
  return async function(dispatch) {
    // only want to do this if current state is closed
    dispatch({ type: TOGGLE_ACCOUNT_DROP_DOWN });
  };
}

export function hideDropDown() {
  return async function(dispatch) {
    dispatch({ type: HIDE_ACCOUNT_DROP_DOWN });
  };
}

export function showAppsModal() {
  return { type: SHOW_APPS_MODAL };
}

export function hideAppsModal() {
  return { type: HIDE_APPS_MODAL };
}

export const SHOW_LOGIN_MODAL = "SHOW_LOGIN_MODAL";
export const HIDE_LOGIN_MODAL = "HIDE_LOGIN_MODAL";

export const SHOW_ENTERPRISE_MODAL = "SHOW_ENTERPRISE_MODAL";
export const HIDE_ENTERPRISE_MODAL = "HIDE_ENTERPRISE_MODAL";

export const SHOW_INDIVIDUAL_MODAL = "SHOW_INDIVIDUAL_MODAL";
export const HIDE_INDIVIDUAL_MODAL = "HIDE_INDIVIDUAL_MODAL";

export function showLoginModal() {
  return {
    type: SHOW_LOGIN_MODAL
  };
}

export function hideLoginModal() {
  return {
    type: HIDE_LOGIN_MODAL
  };
}

export function showEnterpriseModal() {
  return {
    type: SHOW_ENTERPRISE_MODAL
  };
}

export function hideEnterpriseModal() {
  return {
    type: HIDE_ENTERPRISE_MODAL
  };
}

export function showIndividualModal() {
  return {
    type: SHOW_INDIVIDUAL_MODAL
  };
}

export function hideIndividualModal() {
  return {
    type: HIDE_INDIVIDUAL_MODAL
  };
}

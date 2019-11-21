export const UPDATE_SELECTION = "UPDATE_SELECTION";
export const CLEAR_SELECTION = "CLEAR_SELECTION";
export const IN_PARTNERS_VIEW = "IN_PARTNERS_VIEW";
export const NOT_IN_PARTNERS_VIEW = "NOT_IN_PARTNERS_VIEW";
export const IN_ALL_COLORED = "IN_ALL_COLORED";
export const NOT_IN_ALL_COLORED = "NOT_IN_IN_ALL_COLORED";

export function updateSelection(partner) {
  return {
    partner,
    type: UPDATE_SELECTION
  };
}

export function clearSelection() {
  return {
    type: CLEAR_SELECTION
  };
}

export function inPartnersView() {
  return {
    type: IN_PARTNERS_VIEW
  };
}

export function notInPartnersView() {
  return {
    type: NOT_IN_PARTNERS_VIEW
  };
}

export function inColored() {
  return {
    type: IN_ALL_COLORED
  };
}

export function notInColored() {
  return {
    type: NOT_IN_ALL_COLORED
  };
}

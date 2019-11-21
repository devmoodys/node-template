export const SHOW_DELETE_MODAL = "SHOW_DELETE_MODAL";
export const HIDE_DELETE_MODAL = "HIDE_DELETE_MODAL";

export function showDeleteModal(user) {
  return { user, type: SHOW_DELETE_MODAL };
}

export function hideDeleteModal() {
  return { type: HIDE_DELETE_MODAL };
}

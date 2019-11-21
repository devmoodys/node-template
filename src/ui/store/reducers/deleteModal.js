import { merge } from "ramda";
import {
  SHOW_DELETE_MODAL,
  HIDE_DELETE_MODAL
} from "ui/store/actions/deleteModal";

export default function deleteModal(
  state = { isOpen: false, userToDelete: {} },
  action
) {
  switch (action.type) {
    case SHOW_DELETE_MODAL:
      return merge(state, { userToDelete: action.user, isOpen: true });
    case HIDE_DELETE_MODAL:
      return merge(state, { isOpen: false });
    default:
      return state;
  }
}

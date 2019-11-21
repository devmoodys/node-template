import { merge } from "ramda";
import {
  SHOW_LOGIN_MODAL,
  HIDE_LOGIN_MODAL,
  SHOW_ENTERPRISE_MODAL,
  HIDE_ENTERPRISE_MODAL,
  SHOW_INDIVIDUAL_MODAL,
  HIDE_INDIVIDUAL_MODAL
} from "ui/store/actions/mainLoginPage";

export default function mainLoginPage(
  state = { login: false, enterprise: false, individual: false },
  action
) {
  switch (action.type) {
    case SHOW_LOGIN_MODAL: {
      return merge(state, {
        login: true,
        individual: false,
        enterprise: false
      });
    }
    case HIDE_LOGIN_MODAL: {
      return merge(state, {
        login: false
      });
    }
    case SHOW_ENTERPRISE_MODAL: {
      return merge(state, {
        enterprise: true,
        login: false,
        individual: false
      });
    }
    case HIDE_ENTERPRISE_MODAL: {
      return merge(state, {
        enterprise: false
      });
    }
    case SHOW_INDIVIDUAL_MODAL: {
      return merge(state, {
        individual: true,
        login: false,
        enterprise: false
      });
    }
    case HIDE_INDIVIDUAL_MODAL: {
      return merge(state, {
        individual: false
      });
    }
    default:
      return state;
  }
}

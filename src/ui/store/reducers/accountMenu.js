import { merge } from "ramda";
import {
  TOGGLE_ACCOUNT_DROP_DOWN,
  HIDE_ACCOUNT_DROP_DOWN,
  SHOW_APPS_SIDE_BAR,
  HIDE_APPS_SIDE_BAR,
  SHOW_APPS_MODAL,
  HIDE_APPS_MODAL
} from "ui/store/actions/accountMenu";

export default function accountMenu(
  state = { dropDown: false, appsSideBar: false, appsModal: false },
  action
) {
  switch (action.type) {
    case TOGGLE_ACCOUNT_DROP_DOWN: {
      return merge(state, {
        dropDown: !state.dropDown
      });
    }
    case HIDE_ACCOUNT_DROP_DOWN: {
      return merge(state, {
        dropDown: false
      });
    }
    case SHOW_APPS_SIDE_BAR: {
      return merge(state, {
        appsSideBar: true,
        dropDown: false
      });
    }
    case HIDE_APPS_SIDE_BAR: {
      return merge(state, {
        appsSideBar: false
      });
    }
    case SHOW_APPS_MODAL: {
      return merge(state, {
        appsModal: true,
        dropDown: false
      });
    }
    case HIDE_APPS_MODAL: {
      return merge(state, {
        appsModal: false
      });
    }
    default:
      return state;
  }
}

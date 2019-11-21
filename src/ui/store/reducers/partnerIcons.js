import { merge } from "ramda";

import {
  UPDATE_SELECTION,
  CLEAR_SELECTION,
  IN_PARTNERS_VIEW,
  NOT_IN_PARTNERS_VIEW,
  IN_ALL_COLORED,
  NOT_IN_ALL_COLORED
} from "../actions/partnerIcons";

export default function partnerIcons(
  state = { partner: "", partnerView: false, allColor: true },
  action
) {
  switch (action.type) {
    case UPDATE_SELECTION: {
      const { partner } = action;
      return merge(state, {
        partner
      });
    }
    case CLEAR_SELECTION: {
      return merge(state, {
        partner: ""
      });
    }
    case IN_PARTNERS_VIEW: {
      return merge(state, { partnerView: true });
    }
    case NOT_IN_PARTNERS_VIEW: {
      return merge(state, { partnerView: false });
    }
    case IN_ALL_COLORED: {
      return merge(state, { allColor: true });
    }
    case NOT_IN_ALL_COLORED: {
      return merge(state, { allColor: false });
    }
    default: {
      return state;
    }
  }
}

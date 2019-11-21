import { merge } from "ramda";
import { OPEN_FILTER_PANEL, CLOSE_FILTER_PANEL } from "ui/store/actions/filter";

export const OPEN = "OPEN";
export const CLOSED = "CLOSED";

export default function expandFilters(state = {}, action) {
  switch (action.type) {
    case OPEN_FILTER_PANEL: {
      return merge(state, {
        status: OPEN
      });
    }
    case CLOSE_FILTER_PANEL: {
      return merge(state, { status: CLOSED });
    }
    default:
      return state;
  }
}

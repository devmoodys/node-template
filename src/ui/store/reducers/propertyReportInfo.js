import {
  ADD_PROPERTY_REPORT_INFO,
  CLEAR_PROPERTY_REPORT_INFO
} from "ui/store/actions/mapWidget";

export default function propertyReportInfo(state, action) {
  const initialState = {};
  switch (action.type) {
    case ADD_PROPERTY_REPORT_INFO: {
      return action.parcelInfo;
    }
    case CLEAR_PROPERTY_REPORT_INFO: {
      return initialState;
    }
    default: {
      return { ...initialState, ...state };
    }
  }
}

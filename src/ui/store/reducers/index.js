import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { reducer as reduxAsyncConnect } from "redux-connect";

import authenticated from "ui/store/reducers/authenticated";
import flash from "ui/store/reducers/flash";
import expandFilters from "ui/store/reducers/filter";
import currentUser from "ui/store/reducers/currentUser";
import accountMenu from "ui/store/reducers/accountMenu";
import propertyReportInfo from "ui/store/reducers/propertyReportInfo";
import mapWidget from "ui/store/reducers/mapWidget";
import users from "ui/store/reducers/users";
import loginError from "ui/store/reducers/loginError";
import companies from "ui/store/reducers/companies";
import mainLoginPage from "ui/store/reducers/mainLoginPage";
import partnerIcons from "ui/store/reducers/partnerIcons";

const rootReducer = combineReducers({
  reduxAsyncConnect,
  authenticated,
  loginError,
  flash,
  expandFilters,
  currentUser,
  accountMenu,
  propertyReportInfo,
  mapWidget,
  users,
  companies,
  mainLoginPage,
  partnerIcons,
  form: formReducer
});

export default rootReducer;

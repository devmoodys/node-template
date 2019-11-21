import React from "react";
import { path } from "ramda";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import { AppContainer } from "react-hot-loader";
import { loadOnServer, ReduxAsyncConnect } from "redux-connect";
import { getCompany } from "services/companies";
import { getUserLoginTypes } from "services/users";
import moment from "moment";
import url from "url";

import buildStore from "ui/store";

export default async function buildServer(routes, request, response) {
  response.locals.flash = request.flash("error");
  const loginError = response.locals.flash[0];
  const authenticated = Boolean(request.user);
  const userEmail = path(["user", "email"], request);
  const userId = path(["user", "id"], request);
  const role = path(["user", "role"], request);
  const companyId = path(["user", "company_id"], request);
  const status = path(["user", "status"], request);
  const company = companyId ? await getCompany(companyId) : null;
  const termsAcceptedAt = path(["user", "termsAcceptedAt"], request);
  const loginTypes = getUserLoginTypes(request.user);
  const currentUser = {
    id: userId,
    email: userEmail,
    termsAcceptedAt: termsAcceptedAt && moment(termsAcceptedAt).valueOf(),
    role: role,
    company,
    status,
    loginTypes
  };
  const store = buildStore({ authenticated, currentUser, loginError });
  const location = url.parse(request.url);

  await loadOnServer({ store, location, routes, helpers: { userId } });

  const context = request;
  const renderedString = renderToString(
    <Provider store={store}>
      <StaticRouter location={request.url} context={context}>
        <AppContainer>
          <ReduxAsyncConnect routes={routes} helpers={{}} />
        </AppContainer>
      </StaticRouter>
    </Provider>
  );

  const storeState = JSON.stringify(store.getState());

  return { context, storeState, renderedString };
}

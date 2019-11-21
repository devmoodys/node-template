import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { match } from "ramda";
import Terms from "ui/components/terms/Terms";
import { parse } from "query-string";
import { statusActive, companyTermActive } from "helpers/auth";

function AuthenticatedRoute(props) {
  const { component: Component, authenticated, currentUser, ...rest } = props;
  const paramString = rest.location && rest.location.search;
  if (
    authenticated &&
    currentUser.termsAcceptedAt &&
    statusActive(currentUser.status) &&
    companyTermActive(currentUser.company)
  ) {
    return <Component {...rest} />;
  } else if (
    authenticated &&
    statusActive(currentUser.status) &&
    companyTermActive(currentUser.company)
  ) {
    return <Terms currentUser={currentUser} />;
  } else if (
    !authenticated &&
    paramString &&
    paramString.length > 0 &&
    parse(paramString).token
  ) {
    return <Redirect to={`/verified${paramString}`} />;
  } else {
    const { location } = rest;
    const { pathname } = location;
    if (match(/widget/g, pathname).length > 0) {
      return <Redirect to="/widget/login" />;
    }
    return <Redirect to="/login" />;
  }
}

AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  currentUser: PropTypes.any,
  termsAcceptedAt: PropTypes.number,
  company: PropTypes.any,
  status: PropTypes.string
};

function mapStateToProps({ authenticated, currentUser }) {
  return { authenticated, currentUser };
}

const ConnectedAuthenticateRoute = connect(mapStateToProps)(AuthenticatedRoute);

export default function requiresAuthentication(component) {
  return function _requiresAuthentication(props) {
    return <ConnectedAuthenticateRoute {...props} component={component} />;
  };
}

import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { hasAdminAccess } from "helpers/authorization";

function AuthenticateAdmin({
  component: Component,
  authenticated,
  role,
  ...rest
}) {
  if (hasAdminAccess(role) && authenticated) {
    return <Component {...rest} />;
  } else {
    return <Redirect to="/login" />;
  }
}

AuthenticateAdmin.propTypes = {
  component: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired
};

function mapStateToProps({ authenticated, currentUser }) {
  const { role } = currentUser;
  return { authenticated, role };
}

const ConnectedAdminRoute = connect(mapStateToProps)(AuthenticateAdmin);

export default function requiresAdmin(component) {
  return function _requiresAdmin(props) {
    return <ConnectedAdminRoute {...props} component={component} />;
  };
}

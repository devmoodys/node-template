import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router";

export default function RedirectWithStatus({ from, to, statusCode }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.statusCode = statusCode;
        }
        return <Redirect from={from} to={to} />;
      }}
    />
  );
}

RedirectWithStatus.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  statusCode: PropTypes.number
};

import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";

export default function Status({ code, children }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.statusCode = code;
        }
        return children;
      }}
    />
  );
}

Status.propTypes = {
  code: PropTypes.number,
  children: PropTypes.node
};

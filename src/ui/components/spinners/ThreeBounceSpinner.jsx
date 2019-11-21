import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function ThreeBounceSpinner({ type }) {
  const spinnerClass = classNames("ThreeBounceSpinner", {
    [`ThreeBounceSpinner--${type}`]: type
  });
  return (
    <div className={spinnerClass}>
      <div className="ThreeBounceSpinner__bounce1" />
      <div className="ThreeBounceSpinner__bounce2" />
      <div className="ThreeBounceSpinner__bounce3" />
    </div>
  );
}

ThreeBounceSpinner.propTypes = {
  type: PropTypes.string
};

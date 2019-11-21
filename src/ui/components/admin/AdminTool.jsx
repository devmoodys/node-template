import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { Link } from "react-router-dom";

export default function AdminTool({ label, className, to }) {
  return (
    <Link to={to} className="AdminTool">
      <div className={cx("AdminTool__icon", `AdminTool__icon--${className}`)} />
      <div className="AdminTool__label">{label}</div>
    </Link>
  );
}

AdminTool.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
};

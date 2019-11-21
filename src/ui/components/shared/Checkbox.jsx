import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default function Checkbox({ className, checked, children, onClick }) {
  let image;
  if (checked === "mixed") {
    image = require("../../images/icon-check-indeterminate.svg");
  } else if (checked) {
    image = require("../../images/icon-check-on.svg");
  } else {
    image = require("../../images/icon-check-off.svg");
  }

  return (
    <div className={cx("Checkbox", className)} onClick={onClick}>
      <img src={image} />
      {children && <span className="Checkbox__label">{children}</span>}
    </div>
  );
}

Checkbox.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired
};

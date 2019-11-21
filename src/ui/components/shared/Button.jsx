import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default function Button({ children, className, disabled, onClick }) {
  return (
    <button
      className={cx("Button", className)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func
};

Button.defaultProps = {
  disabled: false
};

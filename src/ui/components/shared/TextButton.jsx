import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default function TextButton({ children, className, onClick, isSmall }) {
  const css = cx("TextButton", { "TextButton--small": isSmall }, className);
  return (
    <span className={css} onClick={onClick}>
      {children}
    </span>
  );
}

TextButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  isSmall: PropTypes.bool.isRequired
};

TextButton.defaultProps = {
  isSmall: false
};

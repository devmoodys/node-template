import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default function IconButton({ className, onClick, src }) {
  return (
    <img src={src} onClick={onClick} className={cx("IconButton", className)} />
  );
}

IconButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired
};

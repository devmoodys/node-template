import React from "react";
import PropTypes from "prop-types";

export default function ColorIndicator({ children, color }) {
  const style = {
    backgroundColor: color,
    height: 20,
    width: 4,
    marginRight: 6
  };
  return <div style={style}>{children}</div>;
}

ColorIndicator.propTypes = {
  children: PropTypes.object,
  color: PropTypes.string
};

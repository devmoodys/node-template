import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default function RetinaImage({ className, image }) {
  const src1x = require(`../../images/${image}`);
  const src2x = require(`../../images/${image.replace(/\.png$/, "@2x.png")}`);
  const srcSet = `${src1x} 1x, ${src2x} 2x`;

  return (
    <img className={cx("RetinaImage", className)} src={src1x} srcSet={srcSet} />
  );
}

RetinaImage.propTypes = {
  className: PropTypes.string,
  image: PropTypes.string.isRequired
};

RetinaImage.defaultProps = {};

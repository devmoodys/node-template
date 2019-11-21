import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default function Alert({
  alertActive,
  count,
  className,
  imageClassName,
  countClassName,
  icon
}) {
  return (
    <div className={cx("Alert", className)}>
      {alertActive && <img src={icon} className={imageClassName} />}
      {count > 0 && <sup className={countClassName}>{count}</sup>}
    </div>
  );
}

Alert.propTypes = {
  alertActive: PropTypes.bool.isRequired,
  count: PropTypes.number,
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  countClassName: PropTypes.string,
  icon: PropTypes.string.isRequired
};

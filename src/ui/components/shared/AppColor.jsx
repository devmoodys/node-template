import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default function AppColor({ children, className, partner }) {
  const css = cx("AppColor", `AppColor--${partner}`, className);
  return <div className={css}>{children}</div>;
}

AppColor.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  partner: PropTypes.string.isRequired
};

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import MainHeader from "./MainHeader";

export default function MainLayout({ children, className }) {
  return (
    <div className={cx("MainLayout", className)}>
      <MainHeader />
      {children}
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

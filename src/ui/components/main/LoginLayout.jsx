import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import LoginHeader from "./LoginHeader";

export default function LoginLayout({ children, className }) {
  return (
    <div className={cx("MainLayout", className)}>
      <LoginHeader />
      {children}
    </div>
  );
}

LoginLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

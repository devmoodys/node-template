import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default function GhostButtonLink({ children, className, href, target }) {
  return (
    <a className={cx("GhostButtonLink", className)} href={href} target={target}>
      {children}
    </a>
  );
}

GhostButtonLink.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  target: PropTypes.string
};

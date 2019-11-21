import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function NavLink({ to, children, className }) {
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

NavLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  children: PropTypes.node,
  className: PropTypes.string
};

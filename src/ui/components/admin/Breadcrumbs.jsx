import React from "react";
import PropTypes from "prop-types";
import NavLink from "ui/components/shared/NavLink";

export default function Breadcrumbs({ breadcrumbs }) {
  return (
    <div className="Breadcrumbs">
      {breadcrumbs && transformCrumbs(breadcrumbs)}
    </div>
  );
}

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.array
};

function transformCrumbs(breadcrumbs) {
  return breadcrumbs.map((crumb, i) => {
    if (i > 0) {
      return (
        <div
          className="Breadcrumbs__breadcrumb-with-separator"
          key={`breadcrumb-${i}`}
        >
          <div className="Breadcrumbs__separator">:</div>
          <NavLink className="Breadcrumbs__breadcrumb" to={crumb.path}>
            {crumb.label}
          </NavLink>
        </div>
      );
    }

    return (
      <NavLink
        className="Breadcrumbs__breadcrumb"
        to={crumb.path}
        key={`breadcrumb-${i}`}
      >
        {crumb.label}
      </NavLink>
    );
  });
}

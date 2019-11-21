import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import AdminHeader from "./AdminHeader";
import Flash from "ui/components/notification/Flash";
import Breadcrumbs from "./Breadcrumbs";

export default function AdminLayout({
  children,
  className,
  breadcrumbs,
  title
}) {
  return (
    <div className={cx("AdminLayout", className)}>
      <AdminHeader />
      <Flash />
      <div className="AdminLayout__body">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="AdminLayout__title">{title}</div>
        {children}
      </div>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  breadcrumbs: PropTypes.array,
  title: PropTypes.string
};

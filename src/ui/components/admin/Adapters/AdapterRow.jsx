import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import NavLink from "ui/components/shared/NavLink";
import AppColor from "ui/components/shared/AppColor";
import { partnerAppNames } from "ui/helpers/apps";

export default function AdapterRow({ adapter, partner }) {
  return (
    <NavLink className="AdapterRow" to={`/admin/adapter/${adapter.id}`}>
      <AppColor partner={partner} className="ms-column-1" />
      <div className={cx("AdapterRow__details", "ms-column-2")}>
        {adapter.name}
      </div>
      <div className={cx("AdapterRow__details", "ms-column-3")}>
        {partnerAppNames[adapter.origin]}
      </div>
      <div className={cx("AdapterRow__details", "ms-column-4")}>
        {partnerAppNames[adapter.destination]}
      </div>
    </NavLink>
  );
}

AdapterRow.propTypes = {
  adapter: PropTypes.object,
  partner: PropTypes.string
};

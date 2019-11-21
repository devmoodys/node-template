import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import AppColor from "ui/components/shared/AppColor";

export default function AdapterDetailRow({ from, to, type, desc, partner }) {
  return (
    <div className="AdapterDetailRow">
      <AppColor partner={partner} className="ms-column-1" />
      <div className={cx("AdapterDetailRow--from", "ms-column-2")}>{from}</div>
      <div className={cx(`AdapterDetailRow--${type}`, "ms-column-3")} />
      <div className={cx(`AdapterDetailRow--to--${type}`, "ms-column-4")}>
        {to}
      </div>
      <div className={cx("AdapterDetailRow--desc", "ms-column-5")}>{desc}</div>
    </div>
  );
}

AdapterDetailRow.propTypes = {
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  desc: PropTypes.string,
  partner: PropTypes.string.isRequired
};

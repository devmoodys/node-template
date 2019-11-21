import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import AdapterDetailRow from "ui/components/admin/Adapters/Detail/AdapterDetailRow";

export default function AdapterDetailMapping({ adapter, destination, origin }) {
  return (
    <div className="AdapterDetailMapping">
      <div className="AdapterDetailMapping__grid-header">
        <div
          className={cx(
            "AdapterDetailMapping__grid-header__column",
            "ms-column-1"
          )}
        >{`Destination (${destination})`}</div>
        <div
          className={cx(
            "AdapterDetailMapping__grid-header__column",
            "ms-column-2"
          )}
        >{`Origin (${origin})`}</div>
        <div
          className={cx(
            "AdapterDetailMapping__grid-header__column",
            "ms-column-3"
          )}
        >
          Description
        </div>
      </div>
      <div className="AdapterDetail__grid">
        {adapter.map((row, idx) => {
          if (row.type === "header") {
            return (
              <div className="AdapterDetailHeader" key={idx}>
                {row.name}
              </div>
            );
          } else {
            return (
              <AdapterDetailRow
                key={idx}
                from={row.key}
                to={row.value}
                type={row.type}
                desc={row.desc}
                partner={row.partner}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

AdapterDetailMapping.propTypes = {
  adapter: PropTypes.array.isRequired,
  origin: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired
};

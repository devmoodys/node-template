import React from "react";
import PropTypes from "prop-types";

import AdapterRow from "./AdapterRow";

export default function PartnerAdapters({ adapters, partner }) {
  const adapterRows = adapters[partner].map((adapter, i) => (
    <AdapterRow adapter={adapter} partner={partner} key={`adapter-row-${i}`} />
  ));
  return (
    <div className="PartnerAdapter">
      <div
        className={`PartnerAdapter__logo PartnerAdapter__logo--${partner}`}
      />
      <div className="PartnerAdapter__table">{adapterRows}</div>
    </div>
  );
}

PartnerAdapters.propTypes = {
  adapters: PropTypes.object,
  partner: PropTypes.string
};

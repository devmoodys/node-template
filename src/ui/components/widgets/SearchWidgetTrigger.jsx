import React from "react";

export default function SearchWidgetTrigger() {
  return (
    <div className="SearchWidgetTrigger metropolis-search-widget-trigger">
      <img
        src={require("../../images/icon-search-white.svg")}
        className="SearchWidgetTrigger__spyglass metropolis-search-widget-trigger"
      />
      <hr className="SearchWidgetTrigger__line" />
    </div>
  );
}

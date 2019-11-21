import React from "react";

import SearchWidgetTrigger from "ui/components/widgets/SearchWidgetTrigger";
import { initializeSearchWidget } from "ui/helpers/searchWidget";

export default class SearchWidget extends React.Component {
  componentDidMount() {
    initializeSearchWidget(window, document);
  }

  render() {
    return (
      <div>
        <SearchWidgetTrigger />
      </div>
    );
  }
}

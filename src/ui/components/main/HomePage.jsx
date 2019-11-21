import React from "react";
import { asyncConnect } from "redux-connect";
import PropTypes from "prop-types";
import cx from "classnames";
import MainLayout from "./MainLayout";
import MapWidget from "ui/components/widgets/MapWidget";
import { userAcceptedTOS } from "ui/helpers/users";
import requiresAuthentication from "ui/components/routing/AuthenticatedRoute";
import { parse } from "query-string";
import { pipe, defaultTo, prop, merge } from "ramda";
import { dropPins } from "ui/store/actions/mapWidget";
import { clearPropertyReportInfo } from "ui/store/actions/mapWidget";

async function setMapWidget({ location, store, _helpers }) {
  const params = pipe(prop("search"), defaultTo(""), parse)(location);
  const pins =
    params.lat && params.lon
      ? [merge(params, { dropPin: true, center: false })]
      : [];
  store.dispatch(dropPins(pins));
}

export class HomePage extends React.Component {
  closeReportHandler = () => {
    this.props.closeReport();
  };
  render() {
    const { accepted, className, propertyReportInfo } = this.props;
    if (accepted && propertyReportInfo.properties) {
      return (
        <div>
          <div
            className={"MainHeader__closeReport"}
            onClick={this.closeReportHandler}
          >
            Close Report and Return to Map
          </div>
          <MapWidget propertyReportInfo={propertyReportInfo} />
        </div>
      );
    }
    return (
      <MainLayout className={cx("HomePage", className)}>
        {accepted && <MapWidget />}
      </MainLayout>
    );
  }
}

HomePage.propTypes = {
  accepted: PropTypes.bool.isRequired,
  className: PropTypes.string,
  getPartnerConnections: PropTypes.func,
  closeReport: PropTypes.func,
  propertyReportInfo: PropTypes.object
};

function mapStateToProps({ currentUser, propertyReportInfo }) {
  return {
    accepted: userAcceptedTOS(currentUser),
    propertyReportInfo
  };
}
function mapDispatchToProps(dispatch) {
  return {
    closeReport: () => dispatch(clearPropertyReportInfo())
  };
}

export default asyncConnect(
  [{ key: "mapWidget", promise: setMapWidget }],
  mapStateToProps,
  mapDispatchToProps
)(requiresAuthentication(HomePage));

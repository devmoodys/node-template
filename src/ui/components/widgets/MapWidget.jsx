import React from "react";
import Safe from "react-safe";
import { withRouter } from "react-router";
import { initializeMapWidget } from "ui/helpers/mapWidget";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { merge } from "ramda";
import { getBadge } from "ui/store/actions/badge";
import {
  dropPins,
  clearPins,
  centerMap,
  addPropertyReportInfo,
  updateParcelShadingSpecs,
  setCustomWeights,
  getTheInitialCustomWeights,
  updateCustomWeights,
  getParcelAddresses,
  getInitialMapLatLong
} from "ui/store/actions/mapWidget";
import { sendMessageToCurrentWindow } from "ui/helpers/messaging";
import { parse } from "query-string";

class MapWidget extends React.Component {
  constructor(props) {
    super(props);
    this.widget = null;
    this.widgetEl = null;
  }

  componentDidUpdate() {
    this.widget = initializeMapWidget(window, document, this.props);
  }

  componentDidMount() {
    this.props.getInitialCustomWeights(this.props.currentUser.id);
    const { location: { search } } = this.props;
    const pin = parse(search);
    if (pin.getPin === "true") {
      getBadge(search).then(responseBody => {
        this.props.dropPins([
          merge(responseBody, {
            dropPin: true,
            center: false
          })
        ]);
      });
    } else if (pin.getPin === "false") {
      this.props.getInitialMapLatLong();
    } else if (pin.lat && pin.lon) {
      this.props.dropPins([
        merge(pin, {
          match: { label: "Address", html: pin.matchHTML },
          dropPin: true,
          center: false
        })
      ]);
    } else {
      this.props.getInitialMapLatLong();
    }
    const { handleMessage } = this.props;
    window.addEventListener("message", e => handleMessage(e, this.props));
  }

  componentWillUnmount() {
    if (this.widget) {
      this.widget.destroy();
      this.widget = null;
    }
  }

  render() {
    return (
      <div>
        <div id="widget-el" />
        <Safe.script src="/public/compstak/CompStak.js" />
      </div>
    );
  }
}

MapWidget.propTypes = {
  handleMessage: PropTypes.func,
  getInitialCustomWeights: PropTypes.func,
  getInitialMapLatLong: PropTypes.func,
  dropPins: PropTypes.func,
  location: PropTypes.object,
  currentUser: PropTypes.object
};

function mapStateToProps(state) {
  const { mapWidget, currentUser } = state;
  if (!mapWidget.pins[0]) {
    return { pins: [] };
  }
  mapWidget.currentUser = currentUser;
  return mapWidget;
}

function mapDispatchToProps(dispatch) {
  return {
    handleMessage: (event, prevProps) => {
      const { action, payload } = event.data;
      if (action === "metropolis.dropPin") {
        if (payload.pins && payload.isParcelPreview && !prevProps.clearPins) {
          dispatch(clearPins(payload.pins));
        } else if (!payload.pins || !payload.isParcelPreview) {
          dispatch(
            dropPins(
              payload.map(pin => merge(pin, { dropPin: true, center: false }))
            )
          );
        }
      } else if (action === "metropolis.centerMap") {
        dispatch(centerMap(payload));
      } else if (action === "metropolis.updateCustomWeights") {
        dispatch(setCustomWeights(payload));
        dispatch(updateCustomWeights(payload));
      } else if (action === "metropolis.getParcelAddresses") {
        const { lat, long, map_dmp_id } = payload;
        getParcelAddresses(lat, long, map_dmp_id).then(addressObjs => {
          sendMessageToCurrentWindow("metropolis.setParcelAddresses", {
            addressObjs
          });
        });
      } else if (action === "metropolis.setParcelShading") {
        dispatch(updateParcelShadingSpecs(payload));
      } else if (action === "metropolis.generateReport") {
        dispatch(addPropertyReportInfo(payload));
      }
    },
    getInitialCustomWeights: userId => {
      dispatch(getTheInitialCustomWeights(userId));
    },
    getInitialMapLatLong: () => {
      dispatch(getInitialMapLatLong());
    },
    dropPins: pins => dispatch(dropPins(pins))
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MapWidget)
);

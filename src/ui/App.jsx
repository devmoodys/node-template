import "react-dates/initialize";
import PropTypes from "prop-types";
import React from "react";
import renderRoutes from "react-router-config/renderRoutes";
import Safe from "react-safe";
import Favicon from "react-favicon";

export default class App extends React.Component {
  render() {
    const { route } = this.props;
    return (
      <div>
        <Favicon url="public/favicon.ico" />
        <Safe.script
          type="text/javascript"
          src="https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.0.5/es6-promise.auto.js"
        />
        <Safe.script
          type="text/javascript"
          src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.2/fetch.min.js"
        />
        <Safe.script
          type="text/javascript"
          src="https://cdnjs.cloudflare.com/ajax/libs/sp-pnp-js/2.0.1/pnp.min.js"
        />
        {renderRoutes(route.routes)}
      </div>
    );
  }
}

App.propTypes = {
  route: PropTypes.object
};

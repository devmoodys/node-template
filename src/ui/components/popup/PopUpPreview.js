import React from "react";
import PropTypes from "prop-types";

import CLSBadge from "./CLSBadge.js";
// import LowerPopUp from "./LowerPopUp.js";

export default class PopupPreview extends React.Component {
  render() {
    const { type, score, address, /*properties,*/ typeOverride } = this.props;

    return (
      <div className="PopupPreview__preview_container">
        <img
          src={require("../../images/moodys-logo-verified.svg")}
          className="LoginForm__logo-image"
        />
        <div className="PopupPreview__content">
          <CLSBadge typeOverride={typeOverride} type={type} score={score} />
          <div className="PopupPreview__upper_content_info">
            <div className="PopupPreview__title">Commercial Location Score</div>
            <div className="PopupPreview__address">{address}</div>
          </div>
        </div>
        {/* <LowerPopUp propertyType={type} properties={properties} /> */}
      </div>
    );
  }
}

PopupPreview.propTypes = {
  type: PropTypes.string,
  typeOverride: PropTypes.string,
  score: PropTypes.number,
  address: PropTypes.string,
  properties: PropTypes.object
};

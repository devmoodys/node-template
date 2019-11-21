import React from "react";
import PropTypes from "prop-types";
import { isURIComponentPresent } from "helpers/presence";

export default class CLSBadge extends React.Component {
  render() {
    const location_score = this.props.score;
    let { type, typeOverride } = this.props;
    const typeStyle =
      type && type.length > 8
        ? "CLSBadge__type_container CLSBadge__type_container_long"
        : "CLSBadge__type_container";

    return (
      <div className="CLSBadge__container">
        <div className="CLSBadge__top_section">
          <img
            className="CLSBadge__hexagon_patterned"
            src={require("./hexagon-patterned.svg")}
          />
          <img className="CLSBadge__hexagon" src={require("./hex-badge.png")} />
          <div
            className={
              isURIComponentPresent(typeOverride)
                ? "CLSBadge__score_type_override"
                : "CLSBadge__score"
            }
          >
            {location_score}
          </div>
          {type &&
            !isURIComponentPresent(typeOverride) && (
              <div className={typeStyle}>
                <div className="CLSBadge__type">{type}</div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

CLSBadge.propTypes = {
  score: PropTypes.number,
  type: PropTypes.string,
  typeOverride: PropTypes.string
};

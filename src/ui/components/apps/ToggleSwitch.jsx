import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default function ToggleSwitch({ handleToggle, isOn, className }) {
  const classes = cx(
    "ToggleSwitch",
    {
      "ToggleSwitch--on": isOn,
      "ToggleSwitch--off": !isOn
    },
    className
  );

  return (
    <div className={classes} onClick={handleToggle}>
      <div className="ToggleSwitch__knob" />
    </div>
  );
}

ToggleSwitch.propTypes = {
  className: PropTypes.string,
  handleToggle: PropTypes.func.isRequired,
  isOn: PropTypes.bool.isRequired
};

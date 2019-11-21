import React from "react";
import PropTypes from "prop-types";
import { partnerIdentifierToAppName } from "ui/helpers/apps";
import { map } from "ramda";

function AssumptionsMessage({ assumptions }) {
  if (assumptions && assumptions.length > 0) {
    return (
      <div>
        <div>Please note:</div>
        {map(assumption => <div>{assumption}</div>, assumptions)}
      </div>
    );
  } else {
    return null;
  }
}

AssumptionsMessage.propTypes = {
  assumptions: PropTypes.array
};

export function ImportSuccessMessage({ partner, deepLink, assumptions }) {
  let success = "";
  if (partner && deepLink) {
    success = (
      <div>
        Your property has successfully imported into{" "}
        {partnerIdentifierToAppName(partner)}. See it{" "}
        <a href={deepLink} target="blank">
          here.
        </a>
      </div>
    );
  } else {
    success = <div>Your property has successfully imported.</div>;
  }
  return (
    <div>
      {success}
      {<AssumptionsMessage assumptions={assumptions} />}
    </div>
  );
}

ImportSuccessMessage.propTypes = {
  partner: PropTypes.string,
  deepLink: PropTypes.string,
  assumptions: PropTypes.array
};

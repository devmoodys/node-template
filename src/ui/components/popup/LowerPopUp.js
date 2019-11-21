import React from "react";
import PropTypes from "prop-types";

import Donut from "./Donut.js";
import data from "ui/helpers/clsMappings.json";

export default class LowerPopUp extends React.Component {
  generateInitialRefObjs = () => {
    const weightsByTypeObj = {};
    const type = this.props.propertyType.includes("--")
      ? "office"
      : this.props.propertyType.toLowerCase() === "multifamily"
        ? "multi-family"
        : this.props.propertyType;

    // filtering relevant subcomponent weights by property type
    data.weights.forEach(function(el) {
      if (
        data.propertyTypeAbbreviationToTypeTranslation[
          el.prp_type
        ].toLowerCase() === type.toLowerCase()
      ) {
        weightsByTypeObj[el.component_type] = el.weight;
      }
    });
    const weightsPerType = {};
    const sunburstData = data.typeOrder.map((component_type, idx) => {
      const typeTranslated = data.componentTranslations[component_type];
      const weight = !this.props.properties[typeTranslated]
        ? 0
        : weightsByTypeObj[component_type];

      weightsPerType[component_type] = weight;
      return {
        clr: data.colors[idx],
        children: [],
        bigness: weight
      };
    });
    return {
      weightsPerType,
      sunburstData,
      type
    };
  };

  render() {
    const { propertyType, properties } = this.props;
    const { weightsPerType, sunburstData } = this.generateInitialRefObjs();
    return (
      <div className="LowerPopUp__container">
        {propertyType && (
          <Donut
            type={propertyType}
            currentDataType={"Percentiles"}
            properties={properties}
            weightsPerType={weightsPerType}
            sunburstData={sunburstData}
          />
        )}
      </div>
    );
  }
}

LowerPopUp.propTypes = {
  propertyType: PropTypes.string,
  properties: PropTypes.object
};

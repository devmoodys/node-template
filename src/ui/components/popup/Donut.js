import React from "react";
import ColorIndicator from "./ColorIndicator.js";
import PropTypes from "prop-types";

import { Sunburst } from "react-vis";
import data from "ui/helpers/clsMappings.json";
import { getLocationScoreTypeFromType } from "ui/helpers/typeScoreConversion";

export default class DonutChart extends React.Component {
  getOverallPercentile = component => {
    const { properties } = this.props;
    const percentile = this.getPercentileByComponent(component);
    if (!properties || !percentile) {
      return;
    }
    const showWhich = properties.msa
      ? "msa"
      : properties.division ? "division" : "none";
    const areaDescripPCTL =
      showWhich !== "none" && component.includes("location_score") ? (
        this.getRegionDescription(showWhich, properties[showWhich])
      ) : (
        <span />
      );

    return (
      <span>
        <span>{`${percentile} PCTL`}</span>
        {areaDescripPCTL}
      </span>
    );
  };

  getPercentileByComponent = component => {
    const { properties } = this.props;
    const translations = {
      economc: properties["economc_percentile"],
      vitalty: properties["vitalty_percentile"],
      amenity: properties["amenity_percentile"],
      trnsprt: properties["trnsprt_percentile"],
      safety: properties["safety_percentile"],
      sptl_dm: properties["sptl_dm_percentile"],
      location_score_retail: properties["cre_rt_percentile"],
      location_score_hotel: properties["cre_ho_percentile"],
      location_score_industrial: properties["cre_in_percentile"],
      location_score_multifamily: properties["cre_mf_percentile"],
      location_score_office: properties["cre_of_percentile"]
    };
    return translations[component];
  };
  renderTypeScorePercentiles() {
    const {
      componentTranslations,
      colorTranslations,
      componentDisplayNames
    } = data;

    return Object.keys(componentTranslations).map((component, idx) => {
      return (
        <div
          key={`${component}_${idx}_score_percentile`}
          className={`Donut__component Donut__${component}`}
        >
          <div className="Donut__component_container">
            <ColorIndicator color={colorTranslations[component]} />
            <div className="Donut__component_info_container">
              <div>{componentDisplayNames[component]}</div>
              <span className="Donut__component_info_number">
                {`${this.getPercentileByComponent(component)} PCTL`}
              </span>
            </div>
          </div>
        </div>
      );
    });
  }
  getRegionDescription = (category, value) => {
    if (category === "msa") {
      const msa =
        value.length <= 17
          ? value
          : value[17] === " " ? value.slice(0, 17) : `${value.slice(0, 17)}...`;
      return <span>, MSA: {msa} </span>;
    } else if (category === "division") {
      const division = data.divisions[value];
      if (division) {
        return <span>, Division: {division} </span>;
      }
    }
    return <span />;
  };

  render() {
    const sunburstData = { children: this.props.sunburstData };
    const { type } = this.props;
    const locationScoreType = getLocationScoreTypeFromType(type);

    return (
      <div className="Donut__container">
        <div className="Donut__percentile_header">Component Percentiles</div>

        <div className="Donut__location_score">
          {this.getOverallPercentile(locationScoreType)}
        </div>

        <div className="Donut__chart_container">
          {this.renderTypeScorePercentiles()}
          <div className="Donut__chart">
            <Sunburst
              colorType="literal"
              color="#ffffff"
              title="testing"
              animation={{ damping: 80, stiffness: 300 }}
              data={sunburstData}
              style={sunBurstStyle}
              height={150}
              width={150}
              margin={{ top: 50, bottom: 50, left: 50, right: 50 }}
              getLabel={d => d.name}
              getSize={d => d.bigness}
              getColor={d => d.clr}
              padAngle={() => 0.02}
              hideRootNode
            />
          </div>
        </div>
      </div>
    );
  }
}

const sunBurstStyle = {
  stroke: "#fff",
  color: "#4286f4",
  text: { color: "#ffffff" }
};

DonutChart.propTypes = {
  type: PropTypes.string,
  properties: PropTypes.object,
  sunburstData: PropTypes.array
};

import React from "react";

import VideoDemo from "./VideoDemo";

export default function MainLoginPageInfoDetail() {
  return (
    <div className="MainLoginPageInfoDetail">
      <div className="MainLoginPageInfoDetail__howDoesItWork">
        <h3>How does the Model Work?</h3>
        <p>
          Moody’s Analytics has developed Commercial Location Score for real
          estate lenders and investors as well as for location-sensitive
          commercial businesses, to resolve the long-standing issue of
          consistent location evaluation. In developing this solution, we
          utilize a wide variety of data sources and modern technologies from
          multiple disciplines including finance, geospatial analyses, and
          information science. We use a systematic approach focusing on key
          factors affecting location evaluation along six major dimensions. Each
          of these factors can be quantified in an objective manner based on
          fine-grain data collected from various sources. These Commercial
          Location Score Components are listed below.
        </p>
      </div>
      <div className="MainLoginPageInfoDetail__features">
        <div className="MainLoginPageInfoDetail__features-column ms-column-1">
          <img
            src={require("../../images/economic_prosperity.svg")}
            className="MainLoginPageInfoDetail__features-image"
          />
          <div className="MainLoginPageInfoDetail__features-title">
            Economic Prosperity
          </div>
          <div className="MainLoginPageInfoDetail__features-description">
            Visualize the amount of wealth and economic activity based on a
            relationship of net income to payroll expenses.
          </div>
        </div>
        <div className="MainLoginPageInfoDetail__features-column ms-column-2">
          <img
            src={require("../../images/business_vitality.svg")}
            className="MainLoginPageInfoDetail__features-image"
          />
          <div className="MainLoginPageInfoDetail__features-title">
            Business Vitality
          </div>
          <div className="MainLoginPageInfoDetail__features-description">
            Get a read of the business environment based on how competitive the
            business landscape is with surrounding areas.
          </div>
        </div>
        <div className="MainLoginPageInfoDetail__features-column ms-column-3">
          <img
            src={require("../../images/spatial_demand.svg")}
            className="MainLoginPageInfoDetail__features-image"
          />
          <div className="MainLoginPageInfoDetail__features-title">
            Spatial Demand
          </div>
          <div className="MainLoginPageInfoDetail__features-description">
            See the level of interest for core commercial properties in a
            neighborhood based on the current property demand.
          </div>
        </div>
      </div>
      <div className="MainLoginPageInfoDetail__features">
        <div className="MainLoginPageInfoDetail__features-column ms-column-1">
          <img
            src={require("../../images/transportation.svg")}
            className="MainLoginPageInfoDetail__features-image"
          />
          <div className="MainLoginPageInfoDetail__features-title">
            Transportation
          </div>
          <div className="MainLoginPageInfoDetail__features-description">
            Establish the level of accessibility to transportation based on a
            location’s proximity to highways and subway systems.
          </div>
        </div>
        <div className="MainLoginPageInfoDetail__features-column ms-column-2">
          <img
            src={require("../../images/amenity.svg")}
            className="MainLoginPageInfoDetail__features-image"
          />
          <div className="MainLoginPageInfoDetail__features-title">
            Amenities
          </div>
          <div className="MainLoginPageInfoDetail__features-description">
            Determine the measure of accessible restaurants, museums and parks
            in a specific area based on variety and count.
          </div>
        </div>
        <div className="MainLoginPageInfoDetail__features-column ms-column-3">
          <img
            src={require("../../images/safety.svg")}
            className="MainLoginPageInfoDetail__features-image"
          />
          <div className="MainLoginPageInfoDetail__features-title">Safety</div>
          <div className="MainLoginPageInfoDetail__features-description">
            Project the safety of a particular area with a weighted score based
            on the number of violent and property crimes.
          </div>
        </div>
      </div>
      <VideoDemo />
    </div>
  );
}

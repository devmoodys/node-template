import React from "react";

export default function VideoDemo() {
  return (
    <div className="VideoDemo">
      <h3>How do I use Commercial Location Score?</h3>
      <div className="VideoDemo__content">
        <div className="VideoDemo__content__text">
          <h4>Prospect and Explore</h4>
          <p>
            Evaluate a parcel for development or alternative uses. Recalibrate
            scoring by property type. Compare parcels within a market and
            nationwide.
          </p>
          <h4>Screening Tool</h4>
          <p>
            Quickly understand an unfamiliar market or submarket through
            different categorical vantage points. Identify main retail arteries,
            prime office locations and areas of concern.
          </p>
          <h4>Comparative Analysis</h4>
          <p>
            Compare and validate observations from Commercial Location Score
            against various data sources for Appraisals, ASR, Market Data
            Reports.
          </p>
          <h4>Monitoring</h4>
          <p>
            Pin a Saved Search list to analyze points of concern and track
            performance through time. Investigate properties with low composite
            and categorical scores.
          </p>
        </div>
        <div className="VideoDemo__content__video">
          <video controls>
            <source src="/public/CLS-Teaser.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}

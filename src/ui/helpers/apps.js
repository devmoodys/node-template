import React from "react";
import { defaultTo, flip, pipe, prop } from "ramda";

export const NULL_PARTNER = "none";

export const partnerAppNames = {
  cls: "Commercial Location Score",
  infabode: "Infabode",
  commercialex: "Commercial Exchange",
  enricheddata: "Enriched Data",
  cmbs: "SFPortal (CMBS)",
  cmm: "CMM™",
  compstak: "CompStak",
  val: "Val",
  retailmarketpoint: "Retail MarketPoint",
  interchange: "Interchange",
  places: "-",
  reis: "Reis",
  databuffet: "Data Buffet",
  fourtwentyseven: "FourTwentySeven"
};

export const partnerApps = {
  reis: "Reis",
  cls: "CLS",
  cmm: "CMM™",
  fourtwentyseven: "FourTwentySeven",
  databuffet: "Data Buffet",
  cmbs: "SFPortal (CMBS)",
  compstak: "CompStak",
  val: "Val",
  commercialex: "Commercial Exchange",
  infabode: "Infabode",
  enricheddata: "Enriched Data",
  retailmarketpoint: "Retail MarketPoint"
};

export function renderDescription(selected) {
  switch (selected) {
    case "cls": {
      return "An innovative new quantitative scoring tool that objectively assesses property desirability.";
    }
    case "fourtwentyseven": {
      return "Help you reduce risks, identify new opportunities, and build resilience in the face of climate change.";
    }
    case "databuffet": {
      return "Trusted provider of global economic analysis, data, forecasts, scenarios, models and advisory services.";
    }
    case "retailmarketpoint": {
      return "Evaluate any location in the U.S. for any retail brand or concept with BrandScore™.";
    }
    case "enricheddata": {
      return "National CRE Data and Application Suite specifically created for professionals to identify, analyze, value and manage assets.";
    }
    case "reis": {
      return "Instant access to every commercially zoned parcel in the nation.";
    }
    case "cmm": {
      return "The leading analytical model for managing CRE mortgage loans.";
    }
    case "cmbs": {
      return "Dependable, real-time analytics and data for CMBS market participants.";
    }
    case "compstak": {
      return "Timely, analyst-reviewed commercial lease comps, sales comps, and property details.";
    }
    case "val": {
      return "Powerful property valuation and cash flow modeling.";
    }
    case "commercialex": {
      return "Your national commercial real estate database.";
    }
    case "infabode": {
      return "Your one-stop shop for real estate industry research and insights.";
    }
    default: {
      return "";
    }
  }
}

export function partnerAppSites(partner) {
  switch (partner) {
    case "cls": {
      return process.env.CLS_URL;
    }
    case "fourtwentyseven": {
      return "http://427mt.com/";
    }
    case "databuffet": {
      return "https://www.economy.com/";
    }
    case "retailmarketpoint": {
      return "https://retailmarketpoint.com/";
    }
    case "enricheddata": {
      return "https://www.enrichedrealestate.com/";
    }
    case "reis": {
      return "https://se.reis.com/";
    }
    case "cmm": {
      return "https://cmm.moodysanalytics.com/#/portfolio/portfolio-list";
    }
    case "cmbs": {
      return "https://www.sfportal.com/";
    }
    case "compstak": {
      return "https://compstak.com/login";
    }
    case "val": {
      return "https://moodys-app.rockportval.com/";
    }
    case "commercialex": {
      return "https://commercialexchange.com/";
    }
    case "infabode": {
      return "https://www.infabode.com/";
    }
    default: {
      return "";
    }
  }
}

export const partnerIdentifierToAppName = pipe(
  flip(prop)(partnerAppNames),
  defaultTo("Unknown")
);

export function formatConnectionMessage(status, connectedAs) {
  switch (status) {
    case "connected": {
      return connectedAs ? `Connected as ${connectedAs}` : "Connected";
    }
    case "error": {
      return (
        <div>
          <img
            src={require("../images/icon-warning-red.svg")}
            className="AppConnectionStatus__icon"
          />
          <span>Login failed; please reconnect</span>
        </div>
      );
    }
    default: {
      return "Not connected";
    }
  }
}

export function filterConnectedPartners(partners, partnerConnections) {
  const connectedPartners = [];
  partnerConnections.forEach(partnerConnection => {
    if (
      partnerConnection.status === "connected" &&
      partners.includes(partnerConnection.partner)
    ) {
      connectedPartners.push(partnerConnection.partner);
    }
  });
  return connectedPartners;
}

export function searchForNoPartners() {
  return [NULL_PARTNER];
}

export function removeNullPartnerFromSearchPartners(partners) {
  const nullPartnerIndex = partners.indexOf(NULL_PARTNER);
  if (nullPartnerIndex !== -1) {
    partners.splice(nullPartnerIndex, 1);
  }
  return partners;
}

export function getPartnerCountForDisplay(
  partnerCounts,
  otherPartnerCounts,
  partner
) {
  let count;
  if (partnerCounts) {
    count = partnerCounts[partner];
  }
  if (otherPartnerCounts && !count) {
    count = otherPartnerCounts[partner];
  }
  return count || 0;
}

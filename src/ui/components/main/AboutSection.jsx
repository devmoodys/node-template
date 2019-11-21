import React from "react";

export default function AboutSection() {
  return (
    <div className="AboutSection">
      <h3 className="AboutSection__header-bold">
        <img
          className="AboutSection__m-logo"
          src={require("ui/images/moodys-logo.svg")}
        />
      </h3>
      <p className="AboutSection__header">
        Moody&apos;s is an essential component of the global capital markets,
        providing credit ratings, research, tools and analysis that contribute
        to transparent and integrated financial markets. Moody&apos;s
        Corporation (NYSE: MCO) is the parent company of Moody&apos;s Investors
        Service, which provides credit ratings and research covering debt
        instruments and securities, and Moody&apos;s Analytics, which offers
        leading-edge software, advisory services and research for credit and
        economic analysis and financial risk management. The Corporation, which
        reported revenue of $4.4 billion in 2018, employs approximately 13,200
        people worldwide and maintains a presence in 42 countries. Further
        information is available at www.moodys.com.
      </p>
      <h3 className="AboutSection__header-bold">
        <img
          className="AboutSection__ma-logo"
          src={require("ui/images/ma-logo-blue.svg")}
        />
      </h3>
      <p className="AboutSection__header">
        Moody’s Analytics provides financial intelligence and analytical tools
        to help business leaders make better, faster decisions. Our deep risk
        expertise, expansive information resources, and innovative application
        of technology help our clients confidently navigate an evolving
        marketplace.
      </p>
      <p className="AboutSection__header">
        Moody’s Analytics completed the acquisition of REIS on October 12, 2018.
        The combination of Reis’s extensive data and Moody’s Analytics’
        specialized capabilities aims to enhance analytical practices in the CRE
        market and contribute to the efficiency and liquidity of capital flows.
        The acquisition further expanded Moody&apos;s Analytics’ network of data
        and analytics providers in the CRE space, including recent investments
        in start-ups that apply innovative approaches and new technologies to
        source data and deliver tools to the market.
      </p>
      <h3 className="AboutSection__header-bold">
        <img
          className="AboutSection__reis-logo"
          src={require("ui/images/REIS-logo-black.svg")}
        />
      </h3>
      <p className="AboutSection__header">
        Reis is a leading provider of U.S. commercial real estate (CRE) data.
        Over nearly 40 years, Reis has compiled a rich archive of detailed
        information on some 18 million properties nationwide. Providing analysis
        and forecasts covering 275 metropolitan markets and 7,700 submarkets,
        Reis has become the data set of choice for CRE professionals, including
        property developers, managers, investors, lenders and brokers.
      </p>
    </div>
  );
}

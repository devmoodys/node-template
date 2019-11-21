import React from "react";

export default function MainLoginPageInfoFooter() {
  return (
    <div className="MainLoginPageInfoFooter">
      <div className="MainLoginPageInfoFooter__section">
        <div className="MainLoginPageInfoFooter__section__container">
          <a href="https://www.moodysanalytics.com/">
            <img src={require("../../images/ma-logo-footer.svg")} />
          </a>
          <p>
            7 World Trade Center
            <br />
            at 250 Greenwich Street
            <br />
            New York, NY 10007
            <br />
            USA
          </p>
        </div>
        <div className="MainLoginPageInfoFooter__section__container">
          <p className="header">Contact Client Services</p>
          <ul>
            <li>Americas: +1-212-553-1653</li>
            <li>EMEA: +44-20-7772-5454</li>
            <li>Asia: +852-3551-3077</li>
            <li>Japan: +81-3-5408-4100</li>
            <li>China: +86-10-6319-6580</li>
            <li>
              Email:{" "}
              <a href="https://www.moodysanalytics.com/contact-us">
                Contact Support
              </a>
            </li>
          </ul>
        </div>
        <div className="MainLoginPageInfoFooter__section__container">
          <p className="header">Support & Helpful Links</p>
          <ul>
            <li>
              <a href="https://www.moodysanalytics.com/product-support">
                Web Support
              </a>
            </li>
            <li>
              <a href="https://www.moodysanalytics.com/about-us/history">
                About Us
              </a>
            </li>
            <li>
              <a href="https://www.moodys.com/privatepolicy.aspx?lang=en&cy=global">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="https://www.moodys.com/termsofuseinfo.aspx?lang=en&cy=global">
                Terms of Use
              </a>
            </li>
            <li>
              <a href="https://www.moodysanalytics.com/">Learn More</a>
            </li>
          </ul>
        </div>
        <div className="MainLoginPageInfoFooter__section__container">
          <p className="header">Access Your Account</p>
          <ul>
            <li>
              <a href={process.env.CLS_URL + "admin"}>User Settings</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="MainLoginPageInfoFooter__copywright">
        © 2018 Moody&apos;s Analytics, Inc. and/or its licensors and affiliates.
        All Rights Reserved.
      </div>
    </div>
  );
}

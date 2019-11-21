import React from "react";
import moment from "moment";

import {
  formatBoolean,
  formatDateToMMDDYY,
  formatNoi,
  formatPropertySize,
  formatRent,
  formatValuation,
  formatDecimalToPercent,
  highlightIfMatched,
  textIsAMatch,
  matchContainsText,
  cleanMatch
} from "../formatters";

describe("Formatters", () => {
  describe("formatDateToMMDDYY", () => {
    it("formats YYYY-MM-DD to MM/DD/YY", () => {
      expect(formatDateToMMDDYY("2007-10-15")).toEqual("10/15/07");
    });

    it("formats a moment to MM/DD/YY", () => {
      expect(formatDateToMMDDYY(moment("2007-10-15"))).toEqual("10/15/07");
    });

    it("returns undefined when date is null", () => {
      expect(formatDateToMMDDYY(null)).toBeUndefined();
    });
  });

  describe("formatRent", () => {
    it("formats rent with 2 decimal places and $ prefix", () => {
      const rent = 425.123456;
      expect(formatRent(rent)).toEqual("$425.12");
    });

    it("returns undefined when rent is null", () => {
      expect(formatRent(null)).toBeUndefined();
    });
  });

  describe("formatPropertySize", () => {
    it("formats property size to comma version of size", () => {
      const size = 1234567890;
      expect(formatPropertySize(size)).toEqual("1,234,567,890");
    });

    it("returns undefined when size is null", () => {
      expect(formatPropertySize(null)).toBeUndefined();
    });
  });

  describe("formatBoolean", () => {
    it("returns undefined when value is null", () => {
      expect(formatBoolean(null)).toBeUndefined();
    });

    it("returns 'Yes' when value is true", () => {
      expect(formatBoolean(true)).toEqual("Yes");
    });

    it("returns 'No' when value is false", () => {
      expect(formatBoolean(false)).toEqual("No");
    });
  });

  describe("formatNoi", () => {
    it("returns undefined when noi is null", () => {
      expect(formatNoi(null)).toBeUndefined();
    });

    it("returns undefined when noi is empty", () => {
      expect(formatNoi([])).toBeUndefined();
    });

    it("formats earliest NOI and reference date", () => {
      const date = "2018-03-02";
      const noi = [
        { referenceDate: moment(date).add(1, "days"), noi: 123.45 },
        { referenceDate: moment(date), noi: 300.12 }
      ];

      expect(formatNoi(noi)).toEqual("$300.12 (Mar 18)");
    });
  });

  describe("formatValuation", () => {
    it("returns undefined when valuation is null", () => {
      expect(formatValuation(null)).toBeUndefined();
    });

    it("formats valuation and reference date", () => {
      const date = "2018-03-02";
      const valuation = { referenceDate: moment(date), valuation: 100.02 };

      expect(formatValuation(valuation)).toEqual("$100.02 (Mar 18)");
    });
  });

  describe("formatDecimalToPercent", () => {
    it("formats a decimal value to a percentage", () => {
      expect(formatDecimalToPercent(0.25)).toEqual("25%");
      expect(formatDecimalToPercent(1.234)).toEqual("123.4%");
      expect(formatDecimalToPercent(0.00002)).toEqual("0.002%");
    });

    it("returns null when no decimal is passed", () => {
      expect(formatDecimalToPercent(null)).toBeNull();
    });
  });

  describe("highlightIfMatched", () => {
    describe("when textIsAMatch is passed as comparator", () => {
      const match = "<em>322 A Street</em>, LLC";
      let text;

      function subject() {
        return highlightIfMatched(match, text, textIsAMatch);
      }

      describe("when text equals match", () => {
        it("returns text wrapped in a match highlight span", () => {
          text = "322 A Street, LLC";
          expect(subject()).toEqual(
            <span className="match-highlight">322 A Street, LLC</span>
          );
        });
      });

      describe("when text does not equal match", () => {
        it("returns the original text", () => {
          text = "Extra 322 A Street, LLC thing";
          expect(subject()).toEqual("Extra 322 A Street, LLC thing");
        });
      });
    });

    describe("when matchContainsText is passed as the comparator", () => {
      const match = "Extra <em>322 A Street</em>, LLC thing";
      let text;

      function subject() {
        return highlightIfMatched(match, text, matchContainsText);
      }

      describe("when text equals match", () => {
        it("returns text wrapped in a match highlight span", () => {
          text = "Extra 322 A Street, LLC thing";
          expect(subject()).toEqual(
            <span className="match-highlight">
              Extra 322 A Street, LLC thing
            </span>
          );
        });
      });

      describe("when match contains text", () => {
        it("returns text wrapped in a match highlight span", () => {
          text = "322 A Street, LLC";
          expect(subject()).toEqual(
            <span className="match-highlight">322 A Street, LLC</span>
          );
        });
      });

      describe("when match does not contain text", () => {
        it("returns the original text", () => {
          text = "Not a match";
          expect(subject()).toEqual("Not a match");
        });
      });
    });
  });

  describe("textIsAMatch", () => {
    describe("when text equals match", () => {
      it("returns true", () => {
        const match = "<em>322 A Street</em>, LLC";
        const text = "322 A Street, LLC";
        expect(textIsAMatch(match, text)).toEqual(true);
      });
    });

    describe("when text does not equal match", () => {
      describe("when text contains match", () => {
        it("returns false", () => {
          const match = "<em>322 A Street</em>, LLC";
          const text = "Extra 322 A Street, LLC thing";
          expect(textIsAMatch(match, text)).toEqual(false);
        });
      });

      describe("when text does not contain match", () => {
        it("returns false", () => {
          const match = "<em>322 A Street</em>, LLC";
          const text = "Not a match";
          expect(textIsAMatch(match, text)).toEqual(false);
        });
      });
    });
  });

  describe("matchContainsText", () => {
    describe("when text equals match", () => {
      it("returns true", () => {
        const match = "<em>322 A Street</em>, LLC";
        const text = "322 A Street, LLC";
        expect(matchContainsText(match, text)).toEqual(true);
      });
    });

    describe("when match contains text", () => {
      it("returns true", () => {
        const match = "Extra <em>322 A Street</em>, LLC thing";
        const text = "322 A Street, LLC";
        expect(matchContainsText(match, text)).toEqual(true);
      });
    });

    describe("when match does not contain text", () => {
      it("returns false", () => {
        const match = "<em>322 A Street</em>, LLC";
        const text = "Not a match";
        expect(matchContainsText(match, text)).toEqual(false);
      });
    });
  });

  describe("cleanMatch", () => {
    it("removes html from match string", () => {
      const match = "<em>322 A Street</em>, LLC";
      expect(cleanMatch(match)).toEqual("322 A Street, LLC");
    });

    it("unescapes html entities", () => {
      const match =
        "<em>322 &amp; Howard A Street</em>, &lt;example&gt; LLC &lt;&#60;&gt;&#62;&amp;&#38;&quot;&#34;&apos;&#39;";
      expect(cleanMatch(match)).toEqual(
        "322 & Howard A Street, <example> LLC <<>>&&\"\"''"
      );
      expect(cleanMatch("<em>Moody&#x27;s</em>")).toEqual("Moody's");
    });
  });
});

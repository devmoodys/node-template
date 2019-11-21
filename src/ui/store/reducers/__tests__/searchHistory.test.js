import { RECENT_SEARCHES_SUCCESSFUL } from "ui/store/actions/searchHistory";
import searchHistory from "../searchHistory";

describe("searchHistory", () => {
  describe("given a state", () => {
    const state = {};
    const searches = [{ q: "thing" }];

    describe("given a `RECENT_SEARCHES_SUCCESSFUL` action", () => {
      const action = {
        mostRecentSearches: searches,
        type: RECENT_SEARCHES_SUCCESSFUL
      };

      it("returns the app as the new state", () => {
        expect(searchHistory(state, action)).toEqual({
          mostRecentSearches: searches
        });
      });
    });

    describe("given any other action", () => {
      const action = { type: "FIZZ_BUZZ", foo: "bar" };

      it("returns the state unchange", () => {
        expect(searchHistory(state, action)).toEqual(state);
      });
    });
  });
});

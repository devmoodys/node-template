import { SET_EMBEDDED_APP } from "ui/store/actions/searchWidget";
import searchWidget from "../searchWidget";

describe("searchWidget", () => {
  describe("given a state", () => {
    const state = {};
    const app = "MY_APP";

    describe("given a `SET_EMBEDDED_APP` action", () => {
      const action = {
        app,
        type: SET_EMBEDDED_APP
      };

      it("returns the app as the new state", () => {
        expect(searchWidget(state, action)).toEqual({ app });
      });
    });

    describe("given any other action", () => {
      const action = { type: "FIZZ_BUZZ", foo: "bar" };

      it("returns the state unchange", () => {
        expect(searchWidget(state, action)).toEqual(state);
      });
    });
  });
});

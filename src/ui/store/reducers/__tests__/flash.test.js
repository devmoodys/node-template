import { FLASH_SHOW } from "ui/store/actions/flash";

import flash from "../flash";

describe("flash", () => {
  describe("given a state", () => {
    const state = { type: "error", message: "thing " };

    describe("given a `FLASH_SHOW` action", () => {
      const action = {
        type: FLASH_SHOW,
        flash: { type: "foo", message: "bar" }
      };

      it("returns the wrapped flash message as the new state", () => {
        expect(flash(state, action)).toEqual(action.flash);
      });
    });

    describe("given a `FLASH_CLEAR` action", () => {
      const action = { type: "FLASH_CLEAR" };

      it("returns an empty object as the new state", () => {
        expect(flash(state, action)).toEqual({});
      });
    });

    describe("given any other action", () => {
      const action = { type: "FIZZ_BUZZ", foo: "bar" };

      it("returns the state unchange", () => {
        expect(flash(state, action)).toEqual(state);
      });
    });
  });
});

import {
  DEFAULT_ADAPTERS_FETCHING,
  DEFAULT_ADAPTERS_FETCH_SUCCESSFUL,
  DEFAULT_ADAPTERS_FETCH_FAILED
} from "ui/store/actions/defaultAdapters";
import adapters, { FETCHING, LOADED, FAILED } from "../defaultAdapters";

describe("defaultAdapters", () => {
  const adapterData = [
    {
      id: 1,
      name: "CMM Export Adapter",
      origin: "cmm",
      destination: "interchange",
      is_default: true
    },
    {
      id: 2,
      name: "Val Export Adapter",
      origin: "val",
      destination: "interchange",
      is_default: true
    }
  ];

  describe("given a DEFAULT_ADAPTERS_FETCHING action", () => {
    const state = {};
    const action = {
      type: DEFAULT_ADAPTERS_FETCHING
    };

    it("returns a new state with the status set to 'FETCHING'", () => {
      expect(adapters(state, action)).toEqual({
        status: FETCHING
      });
    });
  });

  describe("given a DEFAULT_ADAPTERS_FETCH_SUCCESSFUL action", () => {
    describe("when health is healthy", () => {
      const state = {};
      const action = {
        adapters: adapterData,
        type: DEFAULT_ADAPTERS_FETCH_SUCCESSFUL
      };

      it("returns a new state with the status set to 'LOADED' and adapters", () => {
        expect(adapters(state, action)).toEqual({
          adapters: adapterData,
          status: LOADED
        });
      });
    });
  });

  describe("given a USERS_FETCH_FAILED action", () => {
    const state = {};
    const action = {
      error: "ERROR",
      type: DEFAULT_ADAPTERS_FETCH_FAILED
    };

    it("returns a new state with the status set to 'FAILED' with the error", () => {
      expect(adapters(state, action)).toEqual({
        error: "ERROR",
        status: FAILED
      });
    });
  });

  describe("given any other action", () => {
    const state = {};
    const action = { type: "FIZZ_BUZZ", foo: "bar" };

    it("returns the state unchange", () => {
      expect(adapters(state, action)).toEqual(state);
    });
  });
});

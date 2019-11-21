import {
  COMPANIES_FETCHING,
  COMPANIES_FETCH_SUCCESSFUL,
  COMPANIES_FETCH_FAILED
} from "ui/store/actions/companies";
import companies, { FETCHING, LOADED, FAILED } from "../companies";

describe("users", () => {
  const userData = [
    { company: "Company 1" },
    { company: "Company 2" },
    { company: "Company 3" }
  ];

  describe("given a COMPANIES_FETCHING action", () => {
    const state = {};
    const action = {
      type: COMPANIES_FETCHING
    };

    it("returns a new state with the status set to 'FETCHING'", () => {
      expect(companies(state, action)).toEqual({
        status: FETCHING
      });
    });
  });

  describe("given a COMPANIES_FETCH_SUCCESSFUL action", () => {
    describe("when health is healthy", () => {
      const state = {};
      const action = {
        companies: userData,
        type: COMPANIES_FETCH_SUCCESSFUL
      };

      it("returns a new state with the status set to 'LOADED' and companies", () => {
        expect(companies(state, action)).toEqual({
          companies: userData,
          status: LOADED
        });
      });
    });
  });

  describe("given a COMPANIES_FETCH_FAILED action", () => {
    const state = {};
    const action = {
      error: "ERROR",
      type: COMPANIES_FETCH_FAILED
    };

    it("returns a new state with the status set to 'FAILED' with the error", () => {
      expect(companies(state, action)).toEqual({
        error: "ERROR",
        status: FAILED
      });
    });
  });

  describe("given any other action", () => {
    const state = {};
    const action = { type: "FIZZ_BUZZ", foo: "bar" };

    it("returns the state unchange", () => {
      expect(companies(state, action)).toEqual(state);
    });
  });
});

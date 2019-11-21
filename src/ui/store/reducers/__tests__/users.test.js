import {
  USERS_FETCHING,
  USERS_FETCH_SUCCESSFUL,
  USERS_FETCH_FAILED,
  USERS_STATUS_UPDATING,
  USERS_STATUS_UPDATE_SUCCESSFUL,
  USER_DELETING,
  USER_DELETE_SUCCESSFUL
} from "ui/store/actions/users";
import users, {
  FETCHING,
  UPDATING,
  UPDATED,
  LOADED,
  FAILED,
  DELETING,
  DELETED
} from "../users";

describe("users", () => {
  const userData = [
    { email: "email1@mail.com" },
    { email: "email2@mail.com" },
    { email: "email3@mail.com" }
  ];

  describe("given a USERS_FETCHING action", () => {
    const state = {};
    const action = {
      type: USERS_FETCHING
    };

    it("returns a new state with the status set to 'FETCHING'", () => {
      expect(users(state, action)).toEqual({
        status: FETCHING
      });
    });
  });

  describe("given a USERS_FETCH_SUCCESSFUL action", () => {
    describe("when health is healthy", () => {
      const state = { filters: [] };
      const action = {
        users: userData,
        type: USERS_FETCH_SUCCESSFUL
      };

      it("returns a new state with the status set to 'LOADED' and users", () => {
        expect(users(state, action)).toEqual({
          filters: [],
          users: userData,
          status: LOADED
        });
      });
    });
  });

  describe("given a USERS_FETCH_FAILED action", () => {
    const state = {};
    const action = {
      error: "ERROR",
      type: USERS_FETCH_FAILED
    };

    it("returns a new state with the status set to 'FAILED' with the error", () => {
      expect(users(state, action)).toEqual({
        error: "ERROR",
        status: FAILED
      });
    });
  });

  describe("given a USERS_STATUS_UPDATING action", () => {
    const state = {};
    const action = { type: USERS_STATUS_UPDATING };

    it("returns a new state with the status set to 'UPDATING'", () => {
      expect(users(state, action)).toEqual({
        status: UPDATING
      });
    });
  });

  describe("given a USERS_STATUS_UPSATE_SUCCESSFUL action", () => {
    const state = {};
    const action = { type: USERS_STATUS_UPDATE_SUCCESSFUL };

    it("returns a new state with the status set to 'UPDATED'", () => {
      expect(users(state, action)).toEqual({
        status: UPDATED
      });
    });
  });

  describe("given a USER_DELETING action", () => {
    const state = {};
    const action = { type: USER_DELETING };

    it("returns a new state with the status set to 'DELETING'", () => {
      expect(users(state, action)).toEqual({
        status: DELETING
      });
    });
  });

  describe("given a USER_DELETE_SUCESSFUL action", () => {
    const state = {};
    const action = { type: USER_DELETE_SUCCESSFUL };

    it("returns a new state with the status set to 'DELETING'", () => {
      expect(users(state, action)).toEqual({
        status: DELETED
      });
    });
  });

  describe("given any other action", () => {
    const state = {};
    const action = { type: "FIZZ_BUZZ", foo: "bar" };

    it("returns the state unchange", () => {
      expect(users(state, action)).toEqual(state);
    });
  });
});

import {
  PREVIEW_ENTITY_LOADING,
  PREVIEW_ENTITY_LOADED,
  PREVIEW_ENTITY_FAILED
} from "ui/store/actions/preview";

import { default as preview, EMPTY, LOADING, LOADED, FAILED } from "../preview";

describe("preview", () => {
  describe("on PREVIEW_ENTITY_LOADING", () => {
    const type = PREVIEW_ENTITY_LOADING;
    const result = { id: "whatevs" };
    const action = { type, result };

    it("sets `result` to the passed result", () => {
      const state = {};
      expect(preview(state, action).result).toBe(result);
    });

    it("clears `error`", () => {
      const state = { error: new Error("some bad ju-ju") };
      expect(preview(state, action).error).toBeNull();
    });

    it("sets the `status` to `LOADING`", () => {
      const state = { status: EMPTY };
      expect(preview(state, action).status).toEqual(LOADING);
    });

    it("clears the `data`", () => {
      const state = { data: { id: "whatevs" } };
      expect(preview(state, action).data).toBeNull();
    });
  });

  describe("on PREVIEW_ENTITY_LOADED", () => {
    const type = PREVIEW_ENTITY_LOADED;
    const data = { id: "whatevs", field: "foo" };
    const action = { type, data };

    it("clears `error`", () => {
      const state = { error: new Error("some bad ju-ju") };
      expect(preview(state, action).error).toBeNull();
    });

    it("sets the status to `LOADED`", () => {
      const state = { status: LOADING };
      expect(preview(state, action).status).toEqual(LOADED);
    });

    it("sets `data` to the passed data", () => {
      const state = {};
      expect(preview(state, action).data).toBe(data);
    });
  });

  describe("on PREVIEW_ENTITY_FAILED", () => {
    const type = PREVIEW_ENTITY_FAILED;
    const error = new Error("boo-urns");
    const action = { type, error };

    it("does not change the `result`", () => {
      const state = { result: { id: "whatevs" } };
      expect(preview(state, action).result).toBe(state.result);
    });

    it("sets `error` to the passed error", () => {
      const state = {};
      expect(preview(state, action).error).toBe(error);
    });

    it("sets the `status` to `FAILED`", () => {
      const state = { status: LOADING };
      expect(preview(state, action).status).toEqual(FAILED);
    });

    it("clears the `data`", () => {
      const state = { data: { id: "whatevs" } };
      expect(preview(state, action).data).toBeNull();
    });
  });

  describe("on any other action", () => {
    it("leaves the state unchanged", () => {
      const state = {
        selectedResult: { id: "whatevs" },
        status: "LOADED",
        data: { id: "whatevs", field: "123" }
      };
      expect(preview(state, { type: "UNHANDLED_ACTION_TYPE" })).toEqual(state);
    });
  });
});

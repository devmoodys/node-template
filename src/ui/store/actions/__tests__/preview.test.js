import {
  selectResult,
  PREVIEW_ENTITY_LOADING,
  PREVIEW_ENTITY_LOADED,
  PREVIEW_ENTITY_FAILED
} from "../preview";

jest.mock("ui/store/actions/apiClient", () => {
  return {
    apiFetch: jest.fn().mockReturnValue(Promise.resolve({}))
  };
});

describe("selectResult", () => {
  const apiClientModule = require("ui/store/actions/apiClient");

  describe("given a property result", () => {
    const result = {
      links: { self: "/api/entities/foo/bar/baz" },
      type: "property"
    };
    const actionCreator = selectResult(result);

    describe("then given a store dispatch", () => {
      let dispatch;
      let getState;

      beforeEach(() => {
        dispatch = jest.fn();
        getState = jest
          .fn()
          .mockReturnValue({ search: { partners: [], tags: [] } });
      });

      afterEach(() => {
        fetch.resetMocks();
      });

      it("fetches the entity data from the API", async () => {
        await actionCreator(dispatch, getState);
        expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
          "/api/entities/foo/bar/baz"
        );
      });

      describe("and if the entity is successfully loaded", () => {
        const data = { id: "whatevs", field: "foo" };

        beforeEach(() => {
          apiClientModule.apiFetch.mockReturnValue(
            Promise.resolve({
              ok: true,
              json: jest.fn().mockReturnValue(Promise.resolve(data))
            })
          );
        });

        it("dispatches a PREVIEW_ENTITY_LOADED with the entity data", async () => {
          await actionCreator(dispatch, getState);
          expect(dispatch).toHaveBeenCalledWith({
            data,
            type: PREVIEW_ENTITY_LOADED
          });
        });
      });

      describe("and if the entity failed to load", () => {
        const error = new Error("a bad thing");

        beforeEach(() => {
          apiClientModule.apiFetch.mockReturnValue(Promise.reject(error));
        });

        it("dispatches a PREVIEW_ENTITY_FAILED with the error", async () => {
          await actionCreator(dispatch, getState);
          expect(dispatch).toHaveBeenCalledWith({
            error,
            type: PREVIEW_ENTITY_FAILED
          });
        });
      });
    });
  });

  describe("given a loan result", () => {
    const result = {
      links: { self: "/api/entities/foo/bar/baz", type: "loan" }
    };
    const actionCreator = selectResult(result);

    describe("then given a store dispatch", () => {
      let dispatch;
      let getState;

      beforeEach(() => {
        dispatch = jest.fn();
        getState = jest
          .fn()
          .mockReturnValue({ search: { partners: [], tags: [] } });
      });

      it("dispatches a PREVIEW_ENTITY_LOADING with the result", async () => {
        await actionCreator(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith({
          result,
          type: PREVIEW_ENTITY_LOADING
        });
      });

      it("fetches the entity data from the API", async () => {
        await actionCreator(dispatch, getState);
        expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
          "/api/entities/foo/bar/baz"
        );
      });

      describe("and if the entity is successfully loaded", () => {
        const data = { id: "whatevs", loanId: "foo" };

        beforeEach(() => {
          apiClientModule.apiFetch.mockReturnValue(
            Promise.resolve({
              ok: true,
              json: jest.fn().mockReturnValue(Promise.resolve(data))
            })
          );
        });

        it("dispatches a PREVIEW_ENTITY_LOADED with the entity data", async () => {
          await actionCreator(dispatch, getState);
          expect(dispatch).toHaveBeenCalledWith({
            data,
            type: PREVIEW_ENTITY_LOADED
          });
        });
      });

      describe("and if the entity failed to load", () => {
        const error = new Error("a bad thing");

        beforeEach(() => {
          apiClientModule.apiFetch.mockReturnValue(Promise.reject(error));
        });

        it("dispatches a PREVIEW_ENTITY_FAILED with the error", async () => {
          await actionCreator(dispatch, getState);
          expect(dispatch).toHaveBeenCalledWith({
            error,
            type: PREVIEW_ENTITY_FAILED
          });
        });
      });
    });
  });
});

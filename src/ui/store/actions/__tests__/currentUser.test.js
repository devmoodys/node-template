import { acceptTerms } from "../currentUser";

jest.mock("ui/store/actions/apiClient", () => {
  return {
    apiFetch: jest.fn().mockReturnValue(
      Promise.resolve({
        ok: true,
        json: jest.fn().mockReturnValue(Promise.resolve({}))
      })
    )
  };
});
const apiClientModule = require("ui/store/actions/apiClient");

let dispatch;
let mockLocation;

beforeEach(() => {
  dispatch = jest.fn();
  mockLocation = { reload: jest.fn() };
});

describe("acceptTerms", () => {
  let actionCreator;

  beforeEach(() => {
    actionCreator = acceptTerms(mockLocation);
  });

  describe("given a store dispatch", () => {
    it("attempts to fetch the route to accept the terms", async () => {
      await actionCreator(dispatch);
      expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
        "/api/accept_terms",
        { method: "post" }
      );
    });

    describe("if API call is successful", () => {
      it("reloads the window", async () => {
        await actionCreator(dispatch);
        expect(mockLocation.reload).toHaveBeenCalled();
      });
    });
  });
});

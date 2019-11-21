import { SET_EMBEDDED_APP, setEmbeddedApp } from "../searchWidget";
import mockStore from "__tests__/support/mockStore";

let store;
const app = "MY_APP";

beforeEach(() => {
  store = mockStore({});
});

afterEach(() => {
  fetch.resetMocks();
});

describe("setEmbeddedApp", () => {
  let actionCreator;

  describe("when app is passed", () => {
    beforeEach(() => {
      actionCreator = setEmbeddedApp(app);
    });

    it("dispatches SET_EMBEDDED_APP with app", async () => {
      await store.dispatch(actionCreator);
      expect(store.getActions()).toContainEqual({
        app,
        type: SET_EMBEDDED_APP
      });
    });
  });

  describe("when no app is passed", () => {
    beforeEach(() => {
      actionCreator = setEmbeddedApp(undefined);
    });

    it("does not dispatch", async () => {
      await store.dispatch(actionCreator);
      expect(store.getActions()).not.toContainEqual({
        app,
        type: SET_EMBEDDED_APP
      });
    });
  });
});

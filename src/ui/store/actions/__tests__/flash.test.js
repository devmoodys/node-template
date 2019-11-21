import mockStore from "__tests__/support/mockStore";
import { showFlash, clearFlash, FLASH_SHOW, FLASH_CLEAR } from "../flash";

describe("showFlash", () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  describe("given an error flash object", () => {
    const flash = { type: "error", message: "something went wrong" };

    it("it dispatches a FLASH_SHOW action", async () => {
      await store.dispatch(showFlash(flash));
      expect(store.getActions()).toEqual([{ type: FLASH_SHOW, flash }]);
    });
  });

  describe("given a success flash object", () => {
    const flash = { type: "success", message: "terrific!" };

    it("it dispatches a FLASH_SHOW and then a FLASH_CLEAR action", async () => {
      await store.dispatch(showFlash(flash));
      expect(store.getActions()).toEqual([{ type: FLASH_SHOW, flash }]);

      jest.runAllTimers();

      expect(store.getActions()).toEqual([
        { type: FLASH_SHOW, flash },
        { type: FLASH_CLEAR }
      ]);
    });
  });
});

describe("clearFlash", () => {
  it("returns a FLASH_CLEAR action", () => {
    expect(clearFlash().type).toEqual(FLASH_CLEAR);
  });
});

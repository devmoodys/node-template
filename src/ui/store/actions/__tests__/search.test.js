import mockStore from "__tests__/support/mockStore";
import { PREVIEW_ENTITY_CLEAR } from "ui/store/actions/preview";
import {
  fetchSearchResults,
  SEARCH_RUNNING,
  SEARCH_SUCCESSFUL,
  SEARCH_FAILED
} from "ui/store/actions/search";

describe("fetchSearchResults", () => {
  const userId = 123;
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  describe("api returns a response", () => {
    const apiResponse = {
      response: {
        total: 0,
        results: [],
        dataTags: [],
        partners: {},
        otherPartners: {}
      },
      relevantResponse: {
        total: 0,
        results: [],
        dataTags: [],
        partners: {},
        otherPartners: {}
      },
      newsResponse: undefined
    };

    beforeEach(() => {
      fetch.mockResponse(JSON.stringify(apiResponse));
    });

    it("gets data in the payload", () => {
      return store
        .dispatch(
          fetchSearchResults(userId, "cake", ["tag1", "tag2"], ["cmm"], true)
        )
        .then(() => {
          // return of async actions
          expect(store.getActions()).toEqual([
            { type: PREVIEW_ENTITY_CLEAR },
            {
              type: SEARCH_RUNNING,
              q: "cake",
              tags: ["tag1", "tag2"],
              partners: ["cmm"],
              singlePartner: true
            },
            {
              q: "cake",
              tags: ["tag1", "tag2"],
              partners: ["cmm"],
              singlePartner: true,
              type: SEARCH_SUCCESSFUL,
              ...apiResponse
            }
          ]);
        });
    });
  });

  describe("api returns an error", () => {
    const error = new Error("onoz!");
    beforeEach(() => {
      fetch.mockReject(error);
    });
    it("gets error message", () => {
      return store
        .dispatch(fetchSearchResults(userId, "pie", ["apple"], ["cmm"], true))
        .then(() => {
          // return of async actions
          expect(store.getActions()).toEqual([
            { type: PREVIEW_ENTITY_CLEAR },
            {
              type: SEARCH_RUNNING,
              q: "pie",
              tags: ["apple"],
              partners: ["cmm"],
              singlePartner: true
            },
            {
              type: SEARCH_FAILED,
              q: "pie",
              tags: ["apple"],
              partners: ["cmm"],
              singlePartner: true,
              error: error
            }
          ]);
        });
    });
  });
});

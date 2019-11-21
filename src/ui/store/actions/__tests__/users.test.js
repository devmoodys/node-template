import {
  fetchUsers,
  toggleUserStatus,
  createNewUser,
  deleteUser,
  USERS_FETCHING,
  USERS_FETCH_SUCCESSFUL,
  USERS_FETCH_FAILED,
  USERS_STATUS_UPDATING,
  USERS_STATUS_UPDATE_SUCCESSFUL,
  USER_DELETING,
  USER_DELETE_SUCCESSFUL
} from "../users";
import { FLASH_SHOW } from "../flash";
import mockStore from "__tests__/support/mockStore";

jest.mock("ui/store/actions/apiClient", () => {
  return {
    apiFetch: jest.fn().mockReturnValue(Promise.resolve({}))
  };
});
const apiClientModule = require("ui/store/actions/apiClient");

let store;
let dispatch;

beforeEach(() => {
  store = mockStore({});
  dispatch = jest.fn();
});

afterEach(() => {
  apiClientModule.apiFetch.mockClear();
});

describe("fetchUsers", () => {
  const actionCreator = fetchUsers();

  describe("given a store dispatch", () => {
    it("dispatches a USERS_FETCHING", async () => {
      await store.dispatch(actionCreator);
      expect(store.getActions()).toContainEqual({
        type: USERS_FETCHING
      });
    });

    describe("if the users are successfully fetched", () => {
      const users = [
        { email: "email1@mail.com" },
        { email: "email2@gmail.com" }
      ];

      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(
          Promise.resolve({
            ok: true,
            json: jest.fn().mockReturnValue(Promise.resolve(users))
          })
        );
      });

      it("dispatches USERS_FETCH_SUCCESSFUL with users", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          users,
          type: USERS_FETCH_SUCCESSFUL
        });
      });
    });

    describe("if the fetch failed", () => {
      const error = new Error("a bad thing");

      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(Promise.reject(error));
      });

      it("dispatches USERS_FETCH_FAILED with error", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          error,
          type: USERS_FETCH_FAILED
        });
      });
    });
  });
});

describe("createNewUser", () => {
  describe("when email is not valid", () => {
    const actionCreator = createNewUser({ email: "asdf" }, jest.fn());

    it("does not call create api endpoint", async () => {
      await store.dispatch(actionCreator);
      expect(apiClientModule.apiFetch).not.toHaveBeenCalled();
    });
  });

  describe("when all params are valid", () => {
    const params = {
      email: "my@email.com"
    };
    let history = {
      location: { pathname: "/admin/users/new" },
      push: path => {
        history.location.pathname = path;
      }
    };
    const actionCreator = createNewUser(params, history);

    afterEach(() => {
      history.location.pathname = "/admin/users/new";
    });

    it("calls /api/users/new with params", async () => {
      await store.dispatch(actionCreator);
      expect(apiClientModule.apiFetch).toHaveBeenCalledWith("/api/users/new", {
        method: "post",
        body: JSON.stringify(params)
      });
    });

    describe("when response is ok", () => {
      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(
          Promise.resolve({
            ok: true,
            json: jest.fn().mockReturnValue(Promise.resolve({}))
          })
        );
      });
      it("redirects page to /admin/users", async () => {
        await store.dispatch(actionCreator);
        expect(history.location.pathname).toEqual("/admin/users");
      });

      it("dispatches FLASH_SHOW with success message", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toEqual([
          {
            type: FLASH_SHOW,
            flash: {
              message: "User my@email.com was created.",
              type: "success"
            }
          }
        ]);
      });
    });

    describe("when response is not ok", () => {
      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(
          Promise.reject("An error occurred")
        );
      });
      it("does not redirect", async () => {
        await store.dispatch(actionCreator);
        expect(history.location.pathname).toEqual("/admin/users/new");
      });

      it("dispatches FLASH_SHOW with error message", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toEqual([
          {
            type: FLASH_SHOW,
            flash: {
              message: "An error occurred",
              type: "error"
            }
          }
        ]);
      });
    });
  });
});

describe("toggleUserStatus", () => {
  const actionCreator = toggleUserStatus();

  describe("given a store dispatch", () => {
    it("dispatches a USERS_STATUS_UPDATING", async () => {
      await store.dispatch(actionCreator);
      expect(store.getActions()).toContainEqual({
        type: USERS_STATUS_UPDATING
      });
    });

    it("attempts to toggle the user's status", async () => {
      await actionCreator(dispatch);
      expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
        "/api/users/toggleStatus",
        { body: "{}", method: "put" }
      );
    });
  });

  describe("if the user's status is sucessfully updated", () => {
    beforeEach(() => {
      apiClientModule.apiFetch.mockReturnValue(
        Promise.resolve({
          ok: true
        })
      );
    });

    it("dispatches USERS_STATUS_UPDATE_SUCCESSFUL with users", async () => {
      await store.dispatch(actionCreator);
      expect(store.getActions()).toContainEqual({
        type: USERS_STATUS_UPDATE_SUCCESSFUL
      });
    });
  });

  describe("when response is not ok", () => {
    beforeEach(() => {
      apiClientModule.apiFetch.mockReturnValue(
        Promise.reject("An error occurred")
      );
    });
    it("dispatches FLASH_SHOW with error message", async () => {
      await store.dispatch(actionCreator);
      expect(store.getActions()).toEqual([
        {
          type: "USERS_STATUS_UPDATING"
        },
        {
          type: FLASH_SHOW,
          flash: {
            message: "An error occurred",
            type: "error"
          }
        }
      ]);
    });
  });
});

describe("deleteUser", () => {
  const actionCreator = deleteUser({ id: 1 });

  describe("give a store dispatch", () => {
    it("dispatches a USER_DELETING", async () => {
      await store.dispatch(actionCreator);
      expect(store.getActions()).toContainEqual({
        type: USER_DELETING
      });
    });

    it("attempts to delete the user", async () => {
      const body = { userId: 1 };
      await actionCreator(dispatch);
      expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
        "/api/users/delete",
        {
          body: JSON.stringify(body),
          method: "delete"
        }
      );
    });

    describe("if the user is sucessfuly deleted", () => {
      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(
          Promise.resolve({
            ok: true
          })
        );
      });

      it("dispatches USERS_FETCH_SUCCESSFUL with users", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          type: USER_DELETE_SUCCESSFUL
        });
      });
    });

    describe("when response is not ok", () => {
      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(Promise.reject("a bad thing"));
      });

      it("dispatches FLASH_SHOW with error message", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toEqual([
          { type: USER_DELETING },
          {
            flash: { message: "a bad thing", type: "error" },
            type: FLASH_SHOW
          }
        ]);
      });
    });
  });
});

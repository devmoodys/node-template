import mockStore from "__tests__/support/mockStore";
import {
  SHOW_DELETE_MODAL,
  HIDE_DELETE_MODAL,
  showDeleteModal,
  hideDeleteModal
} from "../deleteModal";

describe("Delete Modal", () => {
  let store;
  const user = { id: 1, email: "user@client.net" };

  beforeEach(() => {
    store = mockStore({});
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it("it dispatches a SHOW_DELETE_MODAL action", async () => {
    await store.dispatch(showDeleteModal(user));
    expect(store.getActions()).toEqual([
      {
        type: SHOW_DELETE_MODAL,
        user
      }
    ]);
  });

  it("it dispatches a HIDE_DELETE_MODAL action", async () => {
    await store.dispatch(hideDeleteModal(user));
    expect(store.getActions()).toEqual([
      {
        type: HIDE_DELETE_MODAL
      }
    ]);
  });
});

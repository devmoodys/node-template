import { logout } from "../local";

describe("logout", () => {
  describe("given a request and a response", () => {
    let request = null,
      response = null;

    beforeEach(() => {
      request = { logout: jest.fn() };
      response = { redirect: jest.fn() };

      logout(request, response);
    });

    it("calls logout on the request", () => {
      expect(request.logout).toHaveBeenCalled();
    });

    it("redirects to the login path", () => {
      expect(response.redirect).toHaveBeenCalled();
    });
  });
});

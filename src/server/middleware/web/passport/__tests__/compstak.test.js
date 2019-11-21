import { oauthVerify } from "../compstak";

jest.mock("partners/compstak", () => {
  return {
    storeOAuthCredentials: jest.fn().mockReturnValue(Promise.resolve(true))
  };
});

describe("oauthVerify", () => {
  const accessToken = "TOKEN";
  const refreshToken = "REFRESH";
  const validSeconds = 7200;
  const user = { id: 123 };
  const request = { user };
  const params = { expires_in: validSeconds };
  const mockCompstakModule = require("partners/compstak");

  it("stores the access token as the user's credentials", done => {
    oauthVerify(request, accessToken, refreshToken, params, null, () => {
      expect(mockCompstakModule.storeOAuthCredentials).toHaveBeenCalledWith(
        user.id,
        { accessToken, refreshToken, validSeconds }
      );
      done();
    });
  });

  it("passes the user to the passport callback", done => {
    oauthVerify(
      request,
      accessToken,
      refreshToken,
      params,
      null,
      (_, verifyResult) => {
        expect(verifyResult).toEqual(user);
        done();
      }
    );
  });
});

import { oauthVerify } from "../val";
import { sign } from "jsonwebtoken";

jest.mock("partners/val", () => {
  return {
    storeOAuthCredentials: jest.fn().mockReturnValue(Promise.resolve(true))
  };
});
const mockValModule = require("partners/val");

jest.mock("queues/val", () => {
  return { valIndexUserPropertiesQueue: { add: jest.fn() } };
});

describe("oauthVerify", () => {
  const accessToken = "TOKEN";
  const refreshToken = "REFRESH";
  const validSeconds = 7200;
  const id_token = sign({ email: "val@email.com" }, process.env.JWT_KEY);
  const user = { id: 123 };
  const request = { user };
  const params = { id_token, expires_in: validSeconds };

  it("stores the user's credentials", done => {
    oauthVerify(request, accessToken, refreshToken, params, null, () => {
      expect(mockValModule.storeOAuthCredentials).toHaveBeenCalledWith(
        user.id,
        {
          accessToken,
          refreshToken,
          validSeconds,
          email: "val@email.com"
        }
      );
      done();
    });
  });

  it("it enqueues a job to index all of the user's VAL properties", done => {
    const mockAddToValIndexUserPropertiesQueue = require("queues/val")
      .valIndexUserPropertiesQueue.add;

    oauthVerify(request, accessToken, refreshToken, params, null, () => {
      expect(mockAddToValIndexUserPropertiesQueue).toHaveBeenCalledWith({
        userId: user.id
      });
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

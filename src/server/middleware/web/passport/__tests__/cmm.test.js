import { cmmTokenImplicitAuth, cmmCredsImplicitAuth } from "../cmm";
import moment from "moment";

jest.mock("partners/cmm", () => {
  return {
    identifyUserViaJWT: jest.fn().mockReturnValue(Promise.resolve({})),
    authenticate: jest.fn().mockReturnValue(Promise.resolve({})),
    cleanAuthId: jest.fn().mockReturnValue("RAD_USERNAME")
  };
});

jest.mock("services/partnerCredentials", () => {
  return {
    findUserIdByPartnerAuthId: jest.fn().mockReturnValue(Promise.resolve({})),
    storeCredentials: jest.fn().mockReturnValue(Promise.resolve(true))
  };
});

jest.mock("services/users", () => {
  const today = new Date();
  const tomorrow = new Date();
  return {
    findUserByEmail: jest.fn().mockReturnValue(Promise.resolve({})),
    create: jest.fn().mockReturnValue(Promise.resolve({})),
    find: jest.fn().mockReturnValue(
      Promise.resolve({
        status: "active",
        company: {
          end_date: tomorrow.setDate(today.getDate() + 1)
        }
      })
    ),
    updateUserLoginTypes: jest.fn()
  };
});

const mockCmmModule = require("partners/cmm");
const mockPartnerCredentials = require("services/partnerCredentials");
const mockUsers = require("services/users");

const username = "RAD_USERNAME";
const password = "SUPER_SECRET_PASSWORD";
const userEmail = "rad_user@email.com";
const tomorrow = moment(new Date()).add(1, "days");
const userId = "USER_ID";
const user = { id: userId };
const token = "MY_TOKEN";
const validAuthResponse = {
  authId: username,
  credentials: { token, expiresAt: tomorrow },
  email: userEmail
};

describe("cmmTokenImplicitAuth", () => {
  async function subject() {
    return cmmTokenImplicitAuth(token);
  }

  describe("when the token is valid", () => {
    beforeEach(() => {
      mockCmmModule.identifyUserViaJWT.mockReturnValue(
        Promise.resolve(validAuthResponse)
      );
    });

    describe("when there is a user with a matching cmm authId", () => {
      beforeEach(() => {
        mockPartnerCredentials.findUserIdByPartnerAuthId.mockReturnValue(
          Promise.resolve(userId)
        );
      });
      it("stores the updated credentials for the user", async () => {
        await subject();
        expect(mockPartnerCredentials.storeCredentials).toHaveBeenCalledWith(
          userId,
          "cmm",
          validAuthResponse.credentials,
          username
        );
      });

      it("returns the userId", async () => {
        expect(await subject()).toEqual({ id: userId });
      });
    });

    describe("when there is not a user with a matching cmm authId", () => {
      beforeEach(() => {
        mockPartnerCredentials.findUserIdByPartnerAuthId.mockReturnValue(
          Promise.resolve(null)
        );
      });
      describe("when there is a user with a matching email", () => {
        beforeEach(() => {
          mockUsers.findUserByEmail.mockReturnValue(user);
        });
        it("stores the authId for that user", async () => {
          await subject();
          expect(mockPartnerCredentials.storeCredentials).toHaveBeenCalledWith(
            userId,
            "cmm",
            validAuthResponse.credentials,
            username
          );
        });
        it("returns the userId", async () => {
          expect(await subject()).toEqual({ id: userId });
        });
      });

      describe("when there is not a user with a matching email", () => {
        beforeEach(() => {
          mockUsers.findUserByEmail.mockReturnValue(Promise.resolve(null));
          mockUsers.create.mockReturnValue(Promise.resolve({ id: userId }));
        });
        it("creates a user with email and authId from cmm token", async () => {
          await subject();
          expect(mockUsers.create).toHaveBeenCalledWith(
            userEmail,
            null,
            "user"
          );
        });
        it("stores the credentials and authId", async () => {
          await subject();
          expect(mockPartnerCredentials.storeCredentials).toHaveBeenCalledWith(
            userId,
            "cmm",
            validAuthResponse.credentials,
            username
          );
        });
        it("returns the userId", async () => {
          expect(await subject()).toEqual({ id: userId });
        });
      });
    });
  });
});

describe("cmmCredsImplicitAuth", () => {
  async function subject() {
    return cmmCredsImplicitAuth(username, password);
  }

  describe("when username and password are vaild in cmm", () => {
    beforeEach(() => {
      mockCmmModule.authenticate.mockReturnValue(
        Promise.resolve(validAuthResponse)
      );
    });
    describe("when there is a user with a matching cmm authId", () => {
      beforeEach(() => {
        mockPartnerCredentials.findUserIdByPartnerAuthId.mockReturnValue(
          Promise.resolve(userId)
        );
      });
      it("stores the updated credentials for the user", async () => {
        await subject();
        expect(mockPartnerCredentials.storeCredentials).toHaveBeenCalledWith(
          userId,
          "cmm",
          validAuthResponse.credentials,
          username
        );
      });

      it("returns the userId", async () => {
        expect(await subject()).toEqual({ id: userId });
      });
    });

    describe("when there is not a matching cmm authId", () => {
      beforeEach(() => {
        mockPartnerCredentials.findUserIdByPartnerAuthId.mockReturnValue(
          Promise.resolve(null)
        );
      });

      describe("when there is a user with a matching email", () => {
        beforeEach(() => {
          mockUsers.findUserByEmail.mockReturnValue(user);
        });

        it("stores the authId for that user", async () => {
          await subject();
          expect(mockPartnerCredentials.storeCredentials).toHaveBeenCalledWith(
            userId,
            "cmm",
            validAuthResponse.credentials,
            username
          );
        });
        it("returns the userId", async () => {
          expect(await subject()).toEqual({ id: userId });
        });
      });

      describe("when there is not a user with a matching email", () => {
        beforeEach(() => {
          mockUsers.findUserByEmail.mockReturnValue(Promise.resolve(null));
          mockUsers.create.mockReturnValue(Promise.resolve({ id: userId }));
        });
        it("creates a user with email and authId from cmm token", async () => {
          await subject();
          expect(mockUsers.create).toHaveBeenCalledWith(
            userEmail,
            null,
            "user"
          );
        });
        it("stores the credentials and authId", async () => {
          await subject();
          expect(mockPartnerCredentials.storeCredentials).toHaveBeenCalledWith(
            userId,
            "cmm",
            validAuthResponse.credentials,
            username
          );
        });
        it("returns the userId", async () => {
          expect(await subject()).toEqual({ id: userId });
        });
      });
    });
  });

  describe("when username and password are not valid in cmm", () => {
    beforeEach(() => {
      mockCmmModule.authenticate.mockReturnValue(Promise.resolve(null));
    });
    it("returns false", async () => {
      expect(await subject()).toEqual(false);
    });
  });
});

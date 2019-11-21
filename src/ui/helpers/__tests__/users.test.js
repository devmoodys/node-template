import {
  validEmail,
  validPassword,
  validConfirmPassword
} from "ui/helpers/users";

describe("validEmail", () => {
  describe("when email is properly formatted", () => {
    it("returns true", () => {
      expect(validEmail("my@email.com")).toEqual(true);
    });
  });

  describe("when email is empty", () => {
    it("returns false", () => {
      expect(validEmail("")).toEqual(false);
    });
  });

  describe("when email is not properly formatted", () => {
    it("returns false", () => {
      expect(validEmail("asdf")).toEqual(false);
    });
  });
});

describe("validPassword", () => {
  describe("when password is not empty", () => {
    it("returns true", () => {
      expect(validPassword("password")).toEqual(true);
    });
  });

  describe("when password is empty string", () => {
    it("returns false", () => {
      expect(validPassword("")).toEqual(false);
    });
  });

  describe("when password is null", () => {
    it("returns false", () => {
      expect(validPassword(null)).toEqual(false);
    });
  });

  describe("when password is undefined", () => {
    it("returns false", () => {
      expect(validPassword(undefined)).toEqual(false);
    });
  });
});

describe("validConfirmPassword", () => {
  describe("when password and confirmPassword match", () => {
    it("returns true", () => {
      expect(validConfirmPassword("password", "password")).toEqual(true);
    });
  });

  describe("when password and confirmPassword do not match", () => {
    it("returns false", () => {
      expect(validConfirmPassword("password", "wrongpassword")).toEqual(false);
    });
  });
});

import EmailValidator from "email-validator";
import { isPresent } from "helpers/presence";
import { hasSuperAdminAccess } from "helpers/authorization";

export function userAcceptedTOS(user) {
  const { termsAcceptedAt } = user;
  return termsAcceptedAt ? true : false;
}

export function validEmail(email) {
  return EmailValidator.validate(email);
}

export function validPassword(password) {
  return isPresent(password);
}

export function validConfirmPassword(password, confirmedPassword) {
  return password === confirmedPassword;
}

export function validRole(role, access) {
  if (hasSuperAdminAccess(access)) {
    return role === "user" || role === "admin";
  }
  return true;
}

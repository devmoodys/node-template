export function hasAdminAccess(role) {
  return role === "admin" || role === "superadmin";
}

export function hasExclusiveAdminAccess(role) {
  return role === "admin";
}

export function hasSuperAdminAccess(role) {
  return role === "superadmin";
}

export function creationAllowed(access, roleToCreate) {
  switch (roleToCreate) {
    case "admin":
      return hasAdminAccess(access);
    case "user":
      return hasExclusiveAdminAccess(access);
    default:
      return false;
  }
}

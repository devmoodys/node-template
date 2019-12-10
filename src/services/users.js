import { compare, hash } from "bcryptjs";
import { contains, reject, isNil } from "ramda";
import moment from "moment";
import connection from "systems/db";
import { getCompany } from "./companies";
import { statusActive, companyTermActive } from "helpers/auth";
import asArray from "helpers/asArray";
import ApiClient from "services/users/apiClient";
const apiClient = new ApiClient();

function toUser(row) {
  const {
    id,
    email,
    terms_accepted_at: termsAcceptedAt,
    role,
    company_id,
    status,
    notice_email_sent,
    login_types
  } = row;
  return {
    id,
    email,
    termsAcceptedAt,
    role,
    company_id,
    status,
    notice_email_sent,
    login_types
  };
}

export async function find(id) {
  const user = await apiClient.getUser("id", id);
  if (!user) {
    return false;
  }
  return toUser(user);
}

export async function authenticate(email, password) {
  if (!password) {
    return false;
  }
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Username cannot be found");
  }

  const { encrypted_password: encryptedPassword, status, company_id } = user;
  const company = await getCompany(company_id);
  // TEMP
  if (!statusActive(status)) {
    throw new Error("Your account has been deactivated");
  }

  if (!companyTermActive(company)) {
    throw new Error("Your company subscription has expired");
  }

  if (!encryptedPassword) {
    throw new Error("Invalid password");
  }
  const result = await compare(password, encryptedPassword);

  if (!result) {
    throw new Error("Invalid password");
  }
  return toUser(user);
}

export async function create(
  email,
  password,
  role,
  companyName,
  company_id = null,
  created_by_id = null
) {
  const encrypted_password = await hash(password, 10);

  const roles = ["user", "admin", "superadmin"];
  const acceptableRole = contains(role, roles) ? role : "user";

  await apiClient.createUser(companyName, {
    email: email.toLowerCase(),
    encrypted_password,
    company_id,
    created_by_id,
    role: acceptableRole
  });
  const user = await findUserByEmail(email.toLowerCase());
  return toUser(user);
}

export async function findUserByEmail(email) {
  const user = await apiClient.getUser("email", email.toLowerCase());
  return user;
}

export async function acceptTermsOfService(user) {
  await apiClient.updateUser("email", user.email, {
    terms_accepted_at: moment()
  });
}

export async function allUsersOfCompany(companyId, page) {
  const users = await apiClient.getUsers("company_id", companyId, page);
  users.sort((userA, userB) => {
    return userA.email >= userB.email ? 1 : -1;
  });
  return users.map(user => toUser(user));
}

export async function allActiveUsersOfCompany(companyId) {
  let page = 1;
  let users = [];
  let moreUsers = [];
  while (true) {
    try {
      moreUsers = await apiClient.getUsers("company_id", companyId, page);
    } catch (e) {
      break;
    }
    users = users.concat(moreUsers);
    page++;
  }
  return reject(
    isNil,
    users.map(user => {
      if (user.status !== "active") {
        return null;
      }
      return user;
    })
  );
}

export async function allUsers(page) {
  const users = await apiClient.getUsers("email", "all", page);
  users.sort((userA, userB) => {
    return userA.email >= userB.email ? 1 : -1;
  });

  return users.map(user => toUser(user));
}
// Maybe try to return to this later if company name is needed with the users.
// export async function allUsers() {
//   const userRows = await connection("users")
//     .leftOuterJoin("companies", "users.company_id", "companies.id")
//     .select([
//       "users.id",
//       "users.email",
//       "users.role",
//       "users.company_id",
//       "users.status",
//       "users.notice_email_sent",
//       "users.login_types",
//       "companies.company_name"
//     ])
//     .orderBy("users.email", "asc");

//   return userRows;
// }

export async function deactivate(user) {
  await apiClient.updateUser("email", user.email, {
    status: "inactive"
  });
}

export async function activate(user) {
  await apiClient.updateUser("email", user.email, {
    status: "active"
  });
}
export async function updateNoticeEmailSent(user) {
  await apiClient.updateUser("email", user.email, {
    notice_email_sent: true
  });
  return user;
}

export async function updateUserLoginTypes(user, loginType) {
  const loginTypes = getUserLoginTypes(user);
  if (!loginTypes.includes(loginType)) {
    loginTypes.push(loginType);
    await apiClient.updateUser("email", user.email, {
      login_types: JSON.stringify(loginTypes)
    });
    const userObj = await find(user.id);
    return { ...userObj, login_types: loginTypes };
  }
  return user;
}

export function getUserLoginTypes(user) {
  if (!user) {
    return [];
  }
  const loginTypes = user.login_types
    ? asArray(JSON.parse(user.login_types))
    : [];
  return loginTypes;
}

export async function setTemporaryPassword(user, tempPassword) {
  const hashedTempPassword = await hash(tempPassword, 10);
  await apiClient.updateUser("email", user.email, {
    temp_password: hashedTempPassword,
    temp_password_expire_time: moment().add(15, "minutes")
  });
}

export async function getInitialCustomWeights(userId) {
  const matchingEntries = await connection("custom_weights").where({
    user_id: userId
  });
  return matchingEntries;
}

export async function setUsersCustomWeights(
  user_id,
  property_type,
  safety,
  trnsprt,
  vitalty,
  economc,
  sptl_dm,
  amenity
) {
  let matchingEntry = await connection("custom_weights")
    .select(["user_id", "property_type"])
    .where({
      user_id: user_id,
      property_type: property_type
    })
    .first();

  if (matchingEntry) {
    const newRecord = await connection("custom_weights").insert([
      {
        user_id: user_id,
        property_type: property_type,
        safety: safety,
        trnsprt: trnsprt,
        vitalty: vitalty,
        economc: economc,
        sptl_dm: sptl_dm,
        amenity: amenity
      }
    ]);
    return newRecord;
  } else {
    const updatedEntry = await connection("custom_weights")
      .where({
        user_id: user_id,
        property_type: property_type
      })
      .update({
        safety: safety,
        trnsprt: trnsprt,
        vitalty: vitalty,
        economc: economc,
        sptl_dm: sptl_dm,
        amenity: amenity
      })
      .returning("*");
    return updatedEntry;
  }
}

export async function checkTemporaryPassword(user, tempPassword) {
  const {
    temp_password: hashedTempPassword,
    temp_password_expire_time: expireTime
  } = user;

  if (!hashedTempPassword || !expireTime) {
    return false;
  }
  const correctTempPassword = await compare(tempPassword, hashedTempPassword);
  return correctTempPassword && moment() < moment(expireTime);
}

export async function changePassword(user, newPassword) {
  const newHashedPassword = await hash(newPassword, 10);
  await apiClient.updateUser("email", user.email, {
    encrypted_password: newHashedPassword
  });
}

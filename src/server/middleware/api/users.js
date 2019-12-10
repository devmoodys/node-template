import {
  allUsersOfCompany,
  allActiveUsersOfCompany,
  allUsers,
  create,
  remove,
  deactivate,
  activate,
  find,
  setUsersCustomWeights,
  getInitialCustomWeights,
  findUserByEmail,
  getUserLoginTypes,
  setTemporaryPassword
} from "services/users";
import { findCompanyByName, getCompany } from "services/companies";
import {
  getWelcomeEmailType,
  sendWelcomeEmail,
  sendCredentialsEmail,
  sendPasswordChangeEmail
} from "services/email/email";
import { customPassword } from "services/password";
import { creationAllowed } from "helpers/authorization";
import { randomBase64String } from "helpers/strings";
import authenticationClient from "server/middleware/externalAPI/v1/authenticationClient";

export async function users(req, res) {
  const companyId = req.user.company_id;
  const role = req.user.role;
  const { page } = req.query;
  let users;
  if (role === "superadmin") {
    users = await allUsers(page);
  } else if (role === "admin") {
    users = await allUsersOfCompany(companyId, page);
  }
  res.json(users);
}

async function getActiveUsersAndCompanyObj(companyId) {
  let activeUsers = [];
  let company = null;
  if (companyId) {
    company = await getCompany(companyId);
    activeUsers = await allActiveUsersOfCompany(companyId);
  }
  return { activeUsers, company };
}

function canAddUsers(activeUsers, company) {
  return (
    activeUsers && company && activeUsers.length < company.max_active_users
  );
}

async function getNewUserCompany(currentUser, companyName) {
  const roleMap = {
    admin: async function() {
      return await getCompany(currentUser.company_id);
    },
    superadmin: async function() {
      if (!companyName) {
        return null;
      }
      return await findCompanyByName(companyName);
    }
  };
  return await roleMap[currentUser.role]();
}

export async function newUser(req, res) {
  const { email, role, companyName } = req.body;
  const createdById = req.user.id;

  const company = await getNewUserCompany(req.user, companyName);
  // console.log("yooo", companyName, companyId);
  if (!company) {
    return res.status(403).send({
      error: "Company does not exist to add user to!"
    });
  }

  const { activeUsers } = await getActiveUsersAndCompanyObj(company.id);

  if (!canAddUsers(activeUsers, company)) {
    return res.status(403).send({
      error: `Cannot add more than the max amount of users for company, which is ${company.max_active_users}`
    });
  }

  try {
    if (creationAllowed(req.user.role, role)) {
      const password = customPassword();
      let frontendPasswordForDevs = null;

      if (process.env.SHOULD_SEND_EMAILS === "true") {
        const emailType = getWelcomeEmailType(req.user.role, role);
        await sendWelcomeEmail(email, emailType);
        await sendCredentialsEmail(email, password);
      } else {
        frontendPasswordForDevs = password;
      }

      const user = await create(
        email,
        password,
        role,
        company.company_name,
        company.id,
        createdById
      );

      res.json({ ...user, frontendPasswordForDevs });
    } else {
      res.status(403).send({
        error: `You are a ${req.user.role}. You do not have permission to create a user with the role ${role}`
      });
    }
  } catch (error) {
    res.status(409).send({ error: `${email} already exists.` });
  }
}

function canUpdateUserData(currentUser, user) {
  if (currentUser.id === user.id) {
    return false;
  }
  if (currentUser.role === "superadmin") {
    return true;
  } else if (currentUser.role === "admin") {
    return currentUser.company_id === user.company_id;
  }
  return false;
}

export async function toggleStatus(req, res) {
  const { userId } = req.body;
  const currentUser = req.user;
  const user = await find(userId);

  if (!canUpdateUserData(currentUser, user)) {
    return res.status(403).send({
      error: "Cannot toggle status of this user!"
    });
  }

  if (user) {
    if (user.status === "active") {
      await deactivate(user);
    } else if (user.status === "inactive") {
      const { activeUsers, company } = await getActiveUsersAndCompanyObj(
        user.company_id
      );
      if (company && activeUsers.length >= company.max_active_users) {
        return res.status(403).send({
          error: `Can't activate more than max active users which is ${company.max_active_users}`
        });
      }
      await activate(user);
    }
    return res.sendStatus(200);
  } else {
    res.status(403).send({ error: "User does not exist!" });
  }
}

export async function getCustomizedWeights(req, res) {
  const records = await getInitialCustomWeights(req.user.id);
  res.json(records);
}

// This can be done later.
export async function customizeWeights(req, res) {
  const {
    user_id,
    property_type,
    safety,
    trnsprt,
    vitalty,
    economc,
    sptl_dm,
    amenity
  } = req.body;
  const record = await setUsersCustomWeights(
    user_id,
    property_type,
    safety,
    trnsprt,
    vitalty,
    economc,
    sptl_dm,
    amenity
  );
  res.json({ message: `Custom weights were updated!`, body: record });
}

export async function requestPasswordChange(req, res) {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  // if email doesn't exist, we still say email was sent to prevent guessing attacks.
  if (!user) {
    return res.json({ message: `Password Reset email was sent to ${email}!` });
  }
  const loginTypes = getUserLoginTypes(user);
  // TEMP
  if (!loginTypes.includes("local")) {
    return res.status(409).send({ error: "This user cannot reset password!" });
  }
  const tempPassword = await randomBase64String();
  await setTemporaryPassword(user, tempPassword);
  const externalAuthenticationClient = new authenticationClient();
  const token = await externalAuthenticationClient.authenticate();
  await sendPasswordChangeEmail(email, tempPassword, token);
  res.json({ message: `Password Reset email was sent to ${email}!` });
}

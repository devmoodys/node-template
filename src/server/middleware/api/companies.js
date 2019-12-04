import {
  createCompany,
  getCompanies,
  updateEndDate,
  updateMaxActiveUsers
} from "services/companies";
import { allActiveUsersOfCompany } from "services/users";
import moment from "moment";

export async function companies(req, res) {
  const companies = await getCompanies();
  res.json(companies);
}

export async function newCompany(req, res) {
  const { companyName, maxActiveUsers, accountActiveLength } = req.body;
  try {
    const company = await createCompany(
      companyName,
      maxActiveUsers,
      accountActiveLength
    );
    res.json(company);
  } catch (error) {
    res.status(409).send({ error: `${companyName} already exists.` });
  }
}

async function validMaxActiveUsers(companyId, maxActiveUsers) {
  const activeUsers = await allActiveUsersOfCompany(companyId);
  return maxActiveUsers >= activeUsers.length;
}

export async function updateCompany(req, res) {
  let { companyId, endDate, maxActiveUsers } = req.body;
  if (
    !moment(endDate).isValid() ||
    typeof maxActiveUsers !== "number" ||
    maxActiveUsers <= 0
  ) {
    return res.status(409).send({ error: "invalid input" });
  }
  const isValidMaxActiveUsers = await validMaxActiveUsers(
    companyId,
    maxActiveUsers
  );
  if (!isValidMaxActiveUsers) {
    return res.status(409).send({
      error: "Max active users must be more than current active users!"
    });
  }
  try {
    await updateEndDate(companyId, endDate);
    await updateMaxActiveUsers(companyId, maxActiveUsers);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ error: error.detail });
  }
}

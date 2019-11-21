import connection from "systems/db";
import moment from "moment";
import { isBlank } from "helpers/presence";

const DEFAULT_COMPANY_PARTNER_PERMISSIONS = [
  "cls",
  "cmbs",
  "cmm",
  "compstak",
  "val",
  "reis",
  "infabode",
  "commercialex",
  "enricheddata",
  "retailmarketpoint",
  "databuffet",
  "fourtwentyseven"
];

export async function findCompanyByName(companyName) {
  const companies = await connection("companies").where(
    "company_name",
    companyName
  );
  return companies[0];
}

export async function createCompany(
  companyName,
  maxActiveUsers,
  accountActiveLength = "2 weeks"
) {
  const endDate = moment().add(...accountActiveLength.split(" "));
  const noticeDate = moment(endDate).subtract(1, "week");
  const companies = await connection
    .insert({
      company_name: companyName,
      max_active_users: maxActiveUsers,
      end_date: endDate,
      notice_date: noticeDate
    })
    .into("companies")
    .returning("*");
  return companies[0];
}

export async function getCompany(companyId) {
  if (isBlank(companyId)) {
    return null;
  }
  const companies = await connection("companies").where("id", companyId);
  return companies[0];
}

export async function getCompanies() {
  const companies = await connection.raw(
    "SELECT companies.id, companies.company_name, companies.max_active_users, companies.created_at, companies.end_date, companies.notice_date, count(distinct s.id)::integer as active_users FROM companies LEFT JOIN (SELECT * FROM users where status = 'active') s on s.company_id = companies.id GROUP BY companies.id ORDER BY companies.company_name"
  );
  return companies.rows;
}

export async function updateEndDate(companyId, endDate) {
  const noticeDate = moment(endDate).subtract(1, "week");
  await connection("companies")
    .where("id", companyId)
    .update({ end_date: moment(endDate), notice_date: noticeDate });
}

export async function updateMaxActiveUsers(companyId, maxActiveUsers) {
  await connection("companies")
    .where("id", companyId)
    .update({ max_active_users: maxActiveUsers });
}

export async function getCompanyPartnerPermissions(companyId) {
  const permissions = await connection("company_partner_permissions").where(
    "company_id",
    companyId
  );
  if (permissions.length === 0) {
    return DEFAULT_COMPANY_PARTNER_PERMISSIONS;
  }
  return permissions.map(permission => permission.partner);
}

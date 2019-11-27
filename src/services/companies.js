import connection from "systems/db";
import moment from "moment";
import { isBlank } from "helpers/presence";
import ApiClient from "services/companies/apiClient";

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
  const apiClient = new ApiClient();
  const company = await apiClient.getCompany("company_name", companyName);
  return company;
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
  const apiClient = new ApiClient();
  const company = await apiClient.getCompany("id", companyId);
  return company;
}

export async function getCompanies() {
  const apiClient = new ApiClient();
  const companies = await apiClient.getCompanies(1);
  return companies;
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

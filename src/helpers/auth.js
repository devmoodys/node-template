export const companyTermActive = company => {
  // Exception for developer created accounts and superadmin
  if (company === null) return true;
  const currDate = new Date();
  const endDate = new Date(company.end_date);
  return currDate <= endDate;
};

export const statusActive = status => status === "active";

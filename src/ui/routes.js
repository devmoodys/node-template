// import CmmLoginPage from "ui/components/main/CmmLoginPage";
import MainLoginPage from "ui/components/main/MainLoginPage";
import VerifiedLoginPapge from "ui/components/main/VerifiedLoginPapge";
import HomePage from "ui/components/main/HomePage";
import AdminHomePage from "ui/components/admin/AdminHomePage";
import NotFound from "ui/components/routing/NotFound";
import App from "ui/App";
import UsersDashboard from "ui/components/admin/users/UsersDashboard";
import AddNewUserPage from "ui/components/admin/users/AddNewUserPage";
import CompanyDashboard from "./components/admin/Company/CompanyDashboard";
import AddNewCompanyPage from "./components/admin/Company/AddNewCompanyPage";
import ResetPassword from "./components/account/ResetPassword.jsx";

export default [
  {
    path: "/",
    component: App,
    routes: [
      { path: "/admin/companies/new", component: AddNewCompanyPage },
      { path: "/admin/companies", component: CompanyDashboard },
      { path: "/admin/users/new", component: AddNewUserPage },
      { path: "/admin/users", component: UsersDashboard },
      { path: "/resetPassword", component: ResetPassword },
      { path: "/admin", component: AdminHomePage },
      { path: "/verified", component: VerifiedLoginPapge },
      { path: "/login", component: MainLoginPage },
      // { path: "/cmm/login", component: CmmLoginPage },
      { exact: true, path: "/", component: HomePage },
      { component: NotFound }
    ]
  }
];

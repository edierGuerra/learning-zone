// SharedRouters.tsx

import { Route } from "react-router-dom";
import InstitutionPage from "../pages/about/Institution";
import { AboutUs } from "../pages/about/TeamInfo";
import { SitePolicies } from "../pages/info/SitePolicies";
import ComplaintPage from "../pages/feedbackform/ComplaintPage";
import errorsRouters from "./Errors";

export const sharedRoutes = [
  <Route key="aboutInstitution" path="/aboutInstitution" element={<InstitutionPage />} />,
  <Route key="aboutUs" path="/aboutUs" element={<AboutUs />} />,
  <Route key="sitePolicies" path="/sitePolicies" element={<SitePolicies />} />,
  <Route key="siteSugerences" path="/siteSugerences" element={<ComplaintPage />} />,
  ...errorsRouters
  

];

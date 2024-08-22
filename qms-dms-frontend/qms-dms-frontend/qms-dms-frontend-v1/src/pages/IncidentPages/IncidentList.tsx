import {
  isAdminUser,
  isManagerUser,
  isQualityUser,
  isRoleUser,
} from "../../service/AuthService";

import IncidentListGridPage from "./IncidentListGridPage";
import IncidentListComponent from "../../component/Incident/IncidentListComponent";

const IncidentList = () => {
  return (
    <>
      {isQualityUser() && <IncidentListGridPage />}

      {isAdminUser() && <IncidentListGridPage />}

      {isRoleUser() && <IncidentListComponent />}

      {isManagerUser() && <IncidentListComponent />}
    </>
  );
};

export default IncidentList;

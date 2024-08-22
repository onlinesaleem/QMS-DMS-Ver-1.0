import { Paper, Typography } from "@mui/material";

import IncidentFinalReportGridPage from "./IncidentFinalReportGridPage";

const IncidentResponseReport = () => {
  return (
   
      <Paper
        sx={{ marginTop: "10%", flexDirection: "row", alignContent: "center" }}
      >
        <Typography sx={{ alignItems: "center" }}>Incident List</Typography>

        <IncidentFinalReportGridPage />
      </Paper>
    
  )
}

export default IncidentResponseReport;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchIncidentById } from "../../service/IncidentService";
import {
  Alert,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  Divider,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

import QualityResponseViewByIncidentId from "../../pages/IncidentPages/QualityResponseViewByIncidentId";
import IncidentResponseReport from "../../component/Incident/IncidentResponseReport";

const IncidentReportById: React.FC = () => {
  const [incidentData, setIncidentData] = useState<any>({});
  const [selectedTab, setSelectedTab] = useState(0);
  const { incId } = useParams<{ incId: string }>();

  useEffect(() => {
    if (incId) {
      fetchIncidentData();
    }
  }, [incId]);

  const fetchIncidentData = () => {
    if (!incId) return;

    fetchIncidentById(incId)
      .then((response: any) => {
        setIncidentData(response.data);
        console.log("The incident ID is", incId);
      })
      .catch((error: any) => {
        console.error("Error fetching incident data:", error);
      });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
      <Card sx={{ padding: 3, boxShadow: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h5" align="center" sx={{ marginBottom: 3, fontWeight: "bold" }}>
          Incident Details
        </Typography>

        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="General Info" />
          <Tab label="Severity & Impact" />
          <Tab label="Communication" />
        </Tabs>

        <Box hidden={selectedTab !== 0} sx={{ marginTop: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
            General Information
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">Incident Date</Typography>
              <Typography>{incidentData.incDate}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">Incident Time</Typography>
              <Typography>{incidentData.incTime}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">Involved Person</Typography>
              <Typography>{incidentData.involvedPerson}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">Task Assigned</Typography>
              <Typography>{incidentData.tassigned ? "Yes" : "No"}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box hidden={selectedTab !== 1} sx={{ marginTop: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>Severity & Impact</Typography>
          <Divider sx={{ marginY: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">Severity Type</Typography>
              <Typography>{incidentData.incseverity?.severType || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">Score</Typography>
              <Typography>{incidentData.incseverity?.score || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Details</Typography>
              <Typography>{incidentData.incseverity?.sverDtls || "N/A"}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box hidden={selectedTab !== 2} sx={{ marginTop: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>Communication</Typography>
          <Divider sx={{ marginY: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">External Communication</Typography>
              <Typography>{incidentData.externalCommunication || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">Relative Communication</Typography>
              <Typography>{incidentData.relativeCommunication || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">Patient Communication</Typography>
              <Typography>{incidentData.patientCommunication || "N/A"}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>Details of Incident</Typography>
          <Typography>{incidentData.detailsOfIncident}</Typography>
        </Box>
      </Card>

      {/* Related Reports */}
      <Paper sx={{ marginTop: 4, padding: 3 }}>
        {incidentData.tassigned ? (
          <IncidentResponseReport incRefId={incId as string} Isassign={incidentData.tassigned} />
        ) : (
          <Alert variant="filled" severity="info">
            <Typography>No task assigned for this incident.</Typography>
          </Alert>
        )}
      </Paper>

      <Paper sx={{ marginTop: 4, padding: 3 }}>
        <Typography variant="h6">Quality Action</Typography>
        {incidentData.tassigned && <QualityResponseViewByIncidentId incId={incId || ""} />}
      </Paper>
    </Box>
  );
};

export default IncidentReportById;

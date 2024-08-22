import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchIncidentById
  
} from "../../service/IncidentService";
import {
  Alert,
  
  Card,
  CardContent,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import IncidentResponseReport from "./IncidentResponseReport";
import QualityResponseViewByIncidentId from "../../pages/IncidentPages/QualityResponseViewByIncidentId";

interface Iprops{
  PropsIncId:number;
}

const IncidentFormViewById = ({PropsIncId}:Iprops) => {

  const [incDate, setIncdate] = useState("");
  
  
  const [detailsOfIncident, setDetailsOfIncident] = useState("");
  const [involvedPerson, setInvolvedPerson] = useState("");
  
 

  const [injury, setInjury] = useState("");
  const [typeOfInjury, setTypeOfInjury] = useState("");
  const [levelOfHarm, setLevelOfHarm] = useState("");
  const [likelihoodCategory, setLikelihoodCategory] = useState("");
  const [medicationError, setMedicationError] = useState("");
  const [externalCommunication, setExternalCommunication] = useState("");
  const [relativeCommunication, setRelativeCommunication] = useState("");
  const [patientCommunication, setPatientCommunication] = useState("");
  const [contributeFactorOne, setContributeFactorOne] = useState("");
  const [contributeFactorTwo, setContributeFactorTwo] = useState("");
  const [contributeFactorThree, setContributeFactorThree] = useState("");

  const [incTime, setIncTime] = useState("");



  const [floorName, setFloorName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [severType, setSeverType] = useState("");
  const [sverDtls, setSverDtls] = useState("");
  const [score, setScore] = useState("");
  const [taskAssign, setTaskassign] = useState("");
  


  const { incId } = useParams<{ incId: string }>();


  useEffect(() => {
    incidentById();
  }, []);



  function  incidentById() {
    // const id = `${incId}`;
    // console.log("the selected id is" + id);
    fetchIncidentById(PropsIncId)
      .then((response: any) => {
        setIncdate(response.data.incDate);
        setIncTime(response.data.incTime);
        setFloorName(response.data.incfloor.floorName);
        setLocationName(response.data.inclocation.locationName);
        setInvolvedPerson(response.data.involvedPerson);
        setSeverType(response.data.incseverity.severType);
        setScore(response.data.incseverity.score);
        setSverDtls(response.data.incseverity.sverDtls);
        
        setDetailsOfIncident(response.data.detailsOfIncident);
        setInjury(response.data.injury);
        setTypeOfInjury(response.data.typeOfInjury);
        setLevelOfHarm(response.data.levelOfHarm);
        setLikelihoodCategory(response.data.likelihoodCategory);
        setMedicationError(response.data.medicationError);
        setExternalCommunication(response.data.externalCommunication);
        setRelativeCommunication(response.data.relativeCommunication);
        setPatientCommunication(response.data.patientCommunication);
        setContributeFactorOne(response.data.contributeFactorOne);
        setContributeFactorTwo(response.data.contributeFactorTwo);
        setContributeFactorThree(response.data.contributeFactorThree);
        setTaskassign(response.data.tassigned);
        console.log(response.data);
        console.log(response.data.tassigned);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  return (
    <>
      <br></br> <br></br> <br></br>
      <Card style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 5px" }}>
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            style={{ marginBottom: "5%" }}
          >
            Incident Form
          </Typography>
          <form>
            <Grid container spacing={3}>
              <Grid xs={12} sm={6} item>
                <TextField
                  type="date"
                  placeholder="enter the incident date"
                  label="Incident date"
                  InputLabelProps={{
                    style: { top: "-0.9rem" },
                  }}
                  variant="outlined"
                  fullWidth
                  required
                  name="incDate"
                  value={incDate}
                  onChange={(e) => setIncdate(e.target.value)}
                />
              </Grid>

              <Grid xs={12} sm={6} item>
                <TextField
                  type="time"
                  label="enter the incident time"
                  variant="outlined"
                  fullWidth
                  required
                  name="incTime"
                  value={incTime}
                  InputLabelProps={{
                    style: { top: "-0.9rem" },
                  }}
                />
              </Grid>

              <Grid xs={12} item>
                <TextField
                  label="Involved Person/Staff/Visitor"
                  placeholder="Enter the involved person"
                  variant="outlined"
                  fullWidth
                  required
                  name="involvedPerson"
                  value={involvedPerson}
                />
              </Grid>


              <hr></hr>
              <Grid xs={12} item>
                <FormLabel id="injury">Injury</FormLabel>
                <RadioGroup rowaria-labelledby="Injury" name="injury" row>
                  <FormControlLabel
                    value={injury}
                    control={<Radio />}
                    label={injury}
                    checked
                  />
                </RadioGroup>
              </Grid>
              <Grid container spacing={4}>
                <Grid item style={{ marginLeft: "2%" }}>
                  {injury === "Yes" && <Typography>Type of injury</Typography>}

                  {injury === "Yes" && (
                    <Select
                      label={typeOfInjury}
                      name={typeOfInjury}
                      value={typeOfInjury}
                    >
                      <MenuItem value={typeOfInjury}>{typeOfInjury}</MenuItem>
                    </Select>
                  )}
                </Grid>

                <Grid item xs="auto">
                  {injury === "Yes" && <Typography>Level of Harm</Typography>}

                  {injury === "Yes" && (
                    <Select
                      label="Level of Harm"
                      name="levelOfHarm"
                      value={levelOfHarm}
                    >
                      <MenuItem value={levelOfHarm}>{levelOfHarm}</MenuItem>
                    </Select>
                  )}
                </Grid>

                <Grid item xs="auto">
                  {injury === "Yes" && (
                    <Typography>likelihoodCategory</Typography>
                  )}

                  {injury === "Yes" && (
                    <Select
                      name="likelihoodCategory"
                      value={likelihoodCategory}
                    >
                      <MenuItem value={likelihoodCategory}>
                        {likelihoodCategory}
                      </MenuItem>
                    </Select>
                  )}
                </Grid>

                <Grid item xs="auto">
                  {injury === "Yes" && (
                    <Typography>For Medication Error only</Typography>
                  )}
                  {injury === "Yes" && (
                    <Select name="medicationError" value={medicationError}>
                      <MenuItem value={medicationError}>
                        {medicationError}
                      </MenuItem>
                    </Select>
                  )}
                </Grid>
              </Grid>
              <hr></hr>

              <Grid container spacing={3}>
                <Grid item xs="auto" style={{ marginLeft: "2%" }}>
                  <FormLabel id="externalCommunication">
                    Other Department/External Bodies Informed?
                  </FormLabel>
                  <RadioGroup
                    rowaria-labelledby="externalCommunication"
                    name="externalCommunication"
                    row
                  >
                    <FormControlLabel
                      value={externalCommunication}
                      control={<Radio />}
                      label={externalCommunication}
                      checked
                    />
                  </RadioGroup>
                </Grid>

                <Grid item xs="auto">
                  <FormLabel id="externalCommunication">
                    Relatives Informed?
                  </FormLabel>
                  <RadioGroup
                    rowaria-labelledby="externalCommunication"
                    name="relativeCommunication"
                    row
                  >
                    <FormControlLabel
                      value={relativeCommunication}
                      control={<Radio />}
                      label={relativeCommunication}
                      checked
                    />
                  </RadioGroup>
                </Grid>

                <Grid item xs="auto">
                  <FormLabel id="externalCommunication">
                    Patient Informed?
                  </FormLabel>
                  <RadioGroup
                    rowaria-labelledby="patientCommunication"
                    name="relatipatientCommunicationveCommunication"
                    row
                  >
                    <FormControlLabel
                      value={patientCommunication}
                      control={<Radio />}
                      label={patientCommunication}
                      checked
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs="auto" style={{ marginLeft: "2%" }}>
                  <Typography>
                    Contributing Factors(Choose Top 3 Only)
                  </Typography>
                  <Select
                    name="contributeFactorOne"
                    value={contributeFactorOne}
                  >
                    <MenuItem value={contributeFactorOne}>
                      {contributeFactorOne}
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs="auto">
                  <Typography>Contributing Factors 2</Typography>
                  <Select
                    name={contributeFactorTwo}
                    value={contributeFactorTwo}
                  >
                    <MenuItem value={contributeFactorTwo}>
                      {contributeFactorTwo}
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs="auto">
                  <Typography>Contributing Factors 3</Typography>
                  <Select
                    name="contributeFactorThree"
                    value={contributeFactorThree}
                    defaultChecked
                  >
                    <MenuItem value={contributeFactorThree}>
                      {contributeFactorThree}
                    </MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <Grid xs={12} item>
                <TextField
                  label="Details of incident"
                  multiline
                  maxRows={10}
                  fullWidth
                  name="detailsOfIncident"
                  value={detailsOfIncident}
                  placeholder="details of the incident"
                />
              </Grid>
              <Grid xs={12} sm={4} item>
                <Typography>Location</Typography>
                <Select name={locationName} value={locationName}>
                  <MenuItem value={locationName}>{locationName}</MenuItem>
                </Select>
              </Grid>

              <Grid xs={12} sm={4} item>
                <Typography>Floor {floorName}</Typography>
                <Select
                  name={floorName}
                  value={floorName}
                  className="form-select"
                >
                  <MenuItem value={floorName}>{floorName}</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12}>
                <FormLabel id="Severity">Severity</FormLabel>
                <RadioGroup rowaria-labelledby="Severity" name="serverityId">
                  <>
                    <FormControlLabel
                      value={severType}
                      control={<Radio />}
                      label={severType}
                      defaultValue={severType}
                      checked
                    />

                    <Typography>{sverDtls}</Typography>

                    <Typography>Score: [{score}]</Typography>
                  </>
                </RadioGroup>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Paper sx={{ marginTop: "8px", width: "80", padding: "2%" }}>
        {taskAssign ? (
          <IncidentResponseReport incRefId={incId} Isassign={taskAssign} />
        ) : (
          <Alert variant="filled" severity="info">
            {" "}
            <Typography>task not assign.</Typography>{" "}
          </Alert>
        )}
      </Paper>
      <Paper sx={{ marginTop: "8px", width: "80", padding: "2%" }}>
        <Typography>Quality Action</Typography>
      {(taskAssign) && <QualityResponseViewByIncidentId incId={incId} />}
      </Paper> 
    </>
  );
};

export default IncidentFormViewById;

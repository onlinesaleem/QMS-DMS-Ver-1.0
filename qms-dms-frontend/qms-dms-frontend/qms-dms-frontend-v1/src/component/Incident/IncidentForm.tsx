import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllFloors,
  getAllLocations,
  getAllSeverity,
  incEventCategory,
  saveIncidents,
} from "../../service/IncidentService";
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";

const IncidentForm = () => {
  const [incDate, setIncdate] = useState('');
  const [locationId, setLocationId] = useState('');
  const [floorId, setFloorId] = useState('');
  const [detailsOfIncident, setDetailsOfIncident] = useState('');
  const [involvedPerson, setInvolvedPerson] = useState('');
  const [serverityId, setServerityId] = useState('');
  const [injury, setInjury] = useState('');
  const [typeOfInjury, setTypeOfInjury] = useState('');
  const [levelOfHarm, setLevelOfHarm] = useState('');
  const [likelihoodCategory, setLikelihoodCategory] = useState('');
  const [medicationError, setMedicationError] = useState('');
  const [externalCommunication, setExternalCommunication] = useState('');
  const [relativeCommunication, setRelativeCommunication] = useState('');
  const [patientCommunication, setPatientCommunication] = useState('');
  const [contributeFactorOne, setContributeFactorOne] = useState('');
  const [contributeFactorTwo, setContributeFactorTwo] = useState('');
  const [contributeFactorThree, setContributeFactorThree] = useState('');
  const [eventCategoryId, setEventCategoryId] = useState('');
  const [incTime, setIncTime] = useState('');

  const [severity, setSeverity] = useState([]);
  const [locations, setLocations] = useState([]);
  const [floors, setFloors] = useState([]);
  const [eventCategory, setEventCategory] = useState([]);
  const [detailsOfIncidentError, setDetailsOfIncidentError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    listFloors();
    listLocations();
    listSeverity();
    incEvenCategoryList();
  }, []);

  const listFloors = async () => {
    try {
      const response = await getAllFloors();
      setFloors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const listLocations = async () => {
    try {
      const response = await getAllLocations();
      setLocations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const incEvenCategoryList = async () => {
    try {
      const response = await incEventCategory();
      setEventCategory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const listSeverity = async () => {
    try {
      const response = await getAllSeverity();
      setSeverity(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetailsOfIncidentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length > 1999) {
      setDetailsOfIncidentError('Character limit exceeded. Maximum allowed characters are 1999.');
    } else {
      setDetailsOfIncidentError('');
      setDetailsOfIncident(inputValue);
    }
  };

  const saveIncident = async (e: any) => {
    e.preventDefault();

    if (detailsOfIncident.length > 1999) {
      setDetailsOfIncidentError('Character limit exceeded. Maximum allowed characters are 1999.');
      return;
    }

    const incDatas = {
      incDate,
      incTime,
      floorId,
      locationId,
      serverityId,
      involvedPerson,
      detailsOfIncident,
      injury,
      typeOfInjury,
      levelOfHarm,
      likelihoodCategory,
      medicationError,
      externalCommunication,
      relativeCommunication,
      patientCommunication,
      contributeFactorOne,
      contributeFactorTwo,
      contributeFactorThree,
      eventCategoryId,
    };

    try {
      await saveIncidents(incDatas);
      navigate("/incident-list");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }} mt={6} >
      <Card sx={{ maxWidth: 900, margin: "auto", padding: 4, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Incident Report Form
          </Typography>
          <Divider sx={{ marginBottom: 3 }} />

          <form onSubmit={saveIncident}>
            <Grid container spacing={3}>

              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  label="Incident Date"
                  variant="outlined"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  value={incDate}
                  onChange={(e) => setIncdate(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  type="time"
                  label="Incident Time"
                  variant="outlined"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  value={incTime}
                  onChange={(e) => setIncTime(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Involved Person/Staff/Visitor"
                  placeholder="Enter the name"
                  variant="outlined"
                  fullWidth
                  required
                  value={involvedPerson}
                  onChange={(e) => setInvolvedPerson(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Injury</FormLabel>
                  <RadioGroup
                    row
                    value={injury}
                    onChange={(e) => setInjury(e.target.value)}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {injury === "Yes" && (
                <>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Type of Injury</InputLabel>
                      <Select
                        value={typeOfInjury}
                        onChange={(e) => setTypeOfInjury(e.target.value)}
                      >
                        <MenuItem value="Physical">Physical</MenuItem>
                        <MenuItem value="Psychological">Psychological</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Level of Harm</InputLabel>
                      <Select
                        value={levelOfHarm}
                        onChange={(e) => setLevelOfHarm(e.target.value)}
                      >
                        <MenuItem value="Insignificant">Insignificant</MenuItem>
                        <MenuItem value="Minor">Minor</MenuItem>
                        <MenuItem value="Moderate">Moderate</MenuItem>
                        <MenuItem value="Major">Major</MenuItem>
                        <MenuItem value="Catastrophic">Catastrophic</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Likelihood Category</InputLabel>
                      <Select
                        value={likelihoodCategory}
                        onChange={(e) => setLikelihoodCategory(e.target.value)}
                      >
                        <MenuItem value="Rare">Rare</MenuItem>
                        <MenuItem value="Unlikely">Unlikely</MenuItem>
                        <MenuItem value="Likely">Likely</MenuItem>
                        <MenuItem value="Almost Certain">Almost Certain</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Medication Error</InputLabel>
                      <Select
                        value={medicationError}
                        onChange={(e) => setMedicationError(e.target.value)}
                      >
                        <MenuItem value="A">A</MenuItem>
                        <MenuItem value="B">B</MenuItem>
                        <MenuItem value="C">C</MenuItem>
                        <MenuItem value="D">D</MenuItem>
                        <MenuItem value="E">E</MenuItem>
                        <MenuItem value="F">F</MenuItem>
                        <MenuItem value="G">G</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={4}>
                <FormControl component="fieldset">
                  <FormLabel>Other Department/External Bodies Informed?</FormLabel>
                  <RadioGroup row value={externalCommunication} onChange={(e) => setExternalCommunication(e.target.value)}>
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl component="fieldset">
                  <FormLabel>Relatives Informed?</FormLabel>
                  <RadioGroup row value={relativeCommunication} onChange={(e) => setRelativeCommunication(e.target.value)}>
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl component="fieldset">
                  <FormLabel>Patient Informed?</FormLabel>
                  <RadioGroup row value={patientCommunication} onChange={(e) => setPatientCommunication(e.target.value)}>
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                    <FormControlLabel value="NA" control={<Radio />} label="N/A" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Additional fields remain the same */}
                {/* Contributing Factors */}
                <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Contributing Factors 1</InputLabel>
                  <Select
                    value={contributeFactorOne}
                    onChange={(e) => setContributeFactorOne(e.target.value)}
                  >
                    <MenuItem value="Patient Factor">Patient Factor</MenuItem>
                    <MenuItem value="Task and Technology Factors">
                      Task and Technology Factors
                    </MenuItem>
                    <MenuItem value="Individual(STAFF) Factors">
                      Individual(STAFF) Factors
                    </MenuItem>
                    <MenuItem value="Team Factors">Team Factors</MenuItem>
                    <MenuItem value="Work Environmental Factors">
                      Work Environmental Factors
                    </MenuItem>
                    <MenuItem value="Organizational & Management Factors">
                      Organizational & Management Factors
                    </MenuItem>
                    <MenuItem value="Institutional Context Factors">
                      Institutional Context Factors
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Contributing Factors 2</InputLabel>
                  <Select
                    value={contributeFactorTwo}
                    onChange={(e) => setContributeFactorTwo(e.target.value)}
                  >
                    {/* Same options as Contributing Factors 1 */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Contributing Factors 3</InputLabel>
                  <Select
                    value={contributeFactorThree}
                    onChange={(e) => setContributeFactorThree(e.target.value)}
                  >
                    {/* Same options as Contributing Factors 1 */}
                  </Select>
                </FormControl>
              </Grid>

              {/* Event Category */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Event Category</InputLabel>
                  <Select
                    required
                    value={eventCategoryId}
                    onChange={(e) => setEventCategoryId(e.target.value)}
                  >
                    {eventCategory.map((eventList: any) => (
                      <MenuItem key={eventList.id} value={eventList.id}>
                        {eventList.eventCategoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Details of Incident */}
              <Grid item xs={12}>
                <TextField
                  label="Details of Incident"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  required
                  value={detailsOfIncident}
                  onChange={handleDetailsOfIncidentChange}
                  error={detailsOfIncidentError !== ''}
                  helperText={detailsOfIncidentError || `${detailsOfIncident.length}/1999`}
                  inputProps={{ maxLength: 1999 }}
                />
              </Grid>

              {/* Location and Floor */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    required
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                  >
                    {locations.map((location: any) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.locationName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Floor</InputLabel>
                  <Select
                    required
                    value={floorId}
                    onChange={(e) => setFloorId(e.target.value)}
                  >
                    {floors.map((floor: any) => (
                      <MenuItem key={floor.id} value={floor.id}>
                        {floor.floorName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Severity */}
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Severity</FormLabel>
                  <RadioGroup
                    row
                    value={serverityId}
                    onChange={(e) => setServerityId(e.target.value)}
                  >
                    {severity.map((severtypes: any) => (
                      <FormControlLabel
                        key={severtypes.id}
                        value={severtypes.id}
                        control={<Radio />}
                        label={`${severtypes.severType} (Score: ${severtypes.score})`}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>


              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontSize: "1rem", padding: 1.5 }}>
                  Submit Report
                </Button>
              </Grid>

            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IncidentForm;

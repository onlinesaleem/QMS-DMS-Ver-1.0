import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { QualityResponseModal } from "../../modal/QualityResponseModal";
import { useNavigate, useParams } from "react-router-dom";
import { addQualityResponse } from "../../service/IncidentService";

const QualityResponsePage = () => {
  const [notes, setNotes] = useState("");
  const [finalActionTaken, setFinalActionTaken] = useState("");
  const [ifNotAppropriate, setIfNotAppropriate] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchQualityResponseDatas = async (e: any) => {
    e.preventDefault();
    if (id !== undefined) {
      const incId = parseInt(id);
      const datas = new QualityResponseModal(
        incId,
        notes,
        finalActionTaken,
        ifNotAppropriate
      );

      try {
        const response = await addQualityResponse(datas);
        console.log(response.data);
        // Optionally update the state with the response data if needed
        setNotes(response.data.notes);
        setFinalActionTaken(response.data.finalActionTaken);
        setIfNotAppropriate(response.data.ifNotAppropriate);
        // Navigate to another page after the state update
        navigate("/incident-response");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <br />
      <br />
      <br />
      <Card style={{ maxWidth: 450, margin: "0 auto", padding: "20px 5px" }}>
        <CardContent>
          <Typography variant="h5" align="center">
            Quality Response
          </Typography>

          <form onSubmit={fetchQualityResponseDatas}>
            <Grid container spacing={1}>
              <Grid xs={12} item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Final Action
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="finalActionTaken"
                    name="finalActionTaken"
                    value={finalActionTaken}
                    label="Final Action"
                    onChange={(e) => setFinalActionTaken(e.target.value)}
                  >
                    <MenuItem value="appropriate">Appropriate</MenuItem>
                    <MenuItem value="not appropriate">Not appropriate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {finalActionTaken === "not appropriate" && (
                <Grid xs={12} item>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Not appropriate
                    </InputLabel>
                    <Select
                      labelId="NotAppropriate"
                      id="ifNotAppropriate"
                      name="ifNotAppropriate"
                      value={ifNotAppropriate}
                      label="If Not appropriate"
                      onChange={(e) => setIfNotAppropriate(e.target.value)}
                    >
                      <MenuItem value="RCA">RCA</MenuItem>
                      <MenuItem value="Peer Review">Peer Review</MenuItem>
                      <MenuItem value="Corrective Action">
                        Corrective Action
                      </MenuItem>
                      <MenuItem value="Quality Improvement Project">
                        Quality Improvement Project(QIP)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid xs={12} item>
                <TextField
                  name="notes"
                  value={notes}
                  label="Notes"
                  multiline
                  maxRows={10}
                  fullWidth
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>
              <Grid xs={12} item>
                <Button type="submit" variant="contained" fullWidth color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default QualityResponsePage;

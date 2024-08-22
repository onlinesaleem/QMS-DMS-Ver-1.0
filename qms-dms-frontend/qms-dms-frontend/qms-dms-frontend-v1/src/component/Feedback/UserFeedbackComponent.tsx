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
import { useNavigate, useParams } from "react-router-dom";
import { addFeedback } from "../../service/IncidentService";


export const UserFeedbackComponent = () => {
  const [satisfactory, setSatisfactory] = useState("");
  const [comments, setComments] = useState("");
  const [taskTypeId, setTaskTypeId] = useState(1);

  const navigate = useNavigate();

  const { taskResponseId } = useParams();

  function fetchUserFeedbackForm(e: any) {
    e.preventDefault();
    setTaskTypeId(1);
    const datas = { satisfactory, comments, taskResponseId, taskTypeId };

    addFeedback(datas)
      .then((response) => {
        console.log(response.data);

        navigate("/incident-list");
      })
      .catch((error) => {
        console.log(error);
      });

    
  }

  return (
    <>
      <br></br> <br></br> <br></br>
      <Card style={{ maxWidth: 450, margin: "0 auto", padding: "20px 5px" }}>
        <CardContent>
          <Typography variant="h5" align="center">
            User feedback{" "}
          </Typography>

          <form>
            <Grid container spacing={1}>
              <Grid xs={12} item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Satisfactory
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="satisfactory"
                    name="satisfactory"
                    value={satisfactory}
                    label="satisfactory"
                    onChange={(e) => setSatisfactory(e.target.value)}
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} item>
                <TextField
                  name="comments"
                  value={comments}
                  label="comments"
                  multiline
                  maxRows={10}
                  fullWidth
                  onChange={(e) => setComments(e.target.value)}
                />
              </Grid>

              <Grid xs={12} item>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={(e) => fetchUserFeedbackForm(e)}
                >
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

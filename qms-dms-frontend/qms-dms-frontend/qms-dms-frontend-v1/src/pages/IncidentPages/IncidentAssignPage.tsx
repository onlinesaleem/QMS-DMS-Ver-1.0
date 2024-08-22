import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addTask, getUsers } from "../../service/TaskService";
import { isAssigned } from "../../service/IncidentService";

const IncidentAssignPage = () => {
  const [assignedTo, setAssignedTo] = useState("");
  const [taskNote, setTaskNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getUserlist();
  }, []);

  function getUserlist() {
    getUsers()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function addAssign(e: any) {
    e.preventDefault();
    const taskReferenceId = id;
    const taskTypeId = 1;
    const tasks = {
      assignedTo,
      taskTypeId,
      taskReferenceId,
      taskNote,
      dueDate,
    };
    addTask(tasks)
      .then((response) => {
        console.log(response.data);
        taskIsAssign();
        navigate("/incident-list");
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("The reference id is" + tasks.taskReferenceId);
  }

  function taskIsAssign() {
    const incidentId = id;
    isAssigned(incidentId)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  return (
    <>
      <Card style={{ maxWidth: 600, margin: "0 auto", padding: "20px 5px", marginTop: '5%' }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Task Assign
          </Typography>
          <form onSubmit={addAssign}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={users}
                    getOptionLabel={(user: any) => user.empNumber + ' ' + user.name + ' {' + user.department.departName + '}'}
                    value={users.find((user: any) => user.id === assignedTo) || null}
                    onChange={(_, newValue) => setAssignedTo(newValue ? newValue.id : null)}
                    renderInput={(params) => <TextField {...params} label="Assign to" variant="outlined" />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="taskNote"
                  value={taskNote}
                  label="Details of task"
                  multiline
                  maxRows={10}
                  fullWidth
                  variant="outlined"
                  onChange={(e) => setTaskNote(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="date"
                  name="dueDate"
                  value={dueDate}
                  fullWidth
                  variant="outlined"
                  InputProps={{ inputProps: { min: today } }} // Only allow future dates
                  onChange={(e) => setDueDate(e.target.value)}
                  label="Due Date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
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

export default IncidentAssignPage;

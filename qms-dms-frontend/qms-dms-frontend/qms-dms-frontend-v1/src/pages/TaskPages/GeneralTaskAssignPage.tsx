import  { useState, useEffect } from 'react';
import { Autocomplete, Button, Card, CardContent, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { addTask, getUsers, taskTypesApi } from '../../service/TaskService';
import { useNavigate } from 'react-router-dom';

export default function GeneralTaskAssignPage() {
  const [assignedTo, setAssignedTo] = useState("");
  const [taskNote, setTaskNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskTypeId, setTaskTypeId] = useState("");
  const [users, setUsers] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [view, setView] = useState("list"); // Added state to handle view change
  const navigate = useNavigate();

  useEffect(() => {
    getUserlist();
    getTaskTypes();
  }, []);

  function getTaskTypes() {
    taskTypesApi()
      .then((response) => {
        setTaskTypes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
    const tasks = {
      assignedTo,
      taskTypeId,
      taskNote,
      dueDate,
    };
    addTask(tasks)
      .then((response) => {
        console.log(response.data);
        navigate("/general-task-list");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <Grid container spacing={3} justifyContent="center" style={{ marginTop: '5%' }}>
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Card>
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
                        getOptionLabel={(user: any) => `${user.empNumber} ${user.name} {${user.department.departName}}`}
                        value={users.find((user: any) => user.id === assignedTo) || null}
                        onChange={(_, newValue) => setAssignedTo(newValue ? newValue.id : null)}
                        renderInput={(params) => <TextField {...params} label="Assign to" variant="outlined" />}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Select
                        value={taskTypeId}
                        onChange={(e) => setTaskTypeId(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        renderValue={(selected) => {
                          if (!selected) {
                            return <em>Task type</em>;
                          }
                          return taskTypes.find((type: any) => type.id === selected)?.engName;
                        }}
                      >
                        <MenuItem disabled value="">
                          <em>Task type</em>
                        </MenuItem>
                        {taskTypes.map((taskType: any) => (
                          <MenuItem key={taskType.id} value={taskType.id}>
                            {taskType.engName}
                          </MenuItem>
                        ))}
                      </Select>
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
                      InputProps={{ inputProps: { min: today } }}
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
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'right', paddingRight: '10%' }}>
          <Button variant="contained" color="secondary" onClick={() => setView(view === "list" ? "board" : "list")}>
            {view === "list" ? "Show Board" : "Show List"}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

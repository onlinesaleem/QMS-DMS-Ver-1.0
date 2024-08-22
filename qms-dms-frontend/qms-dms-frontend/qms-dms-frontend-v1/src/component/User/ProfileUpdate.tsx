import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { departmentListAPI, findProfile, updateProfile } from "../../service/UserService";
import { isAdminUser} from "../../service/AuthService";

const ProfileUpdate = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departments, setDepartments] = useState([]);
  const [empNumber, setEmpNumber] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    fetchDepartmentList();
    fetchUserDatas();
  }, []);

  function fetchDepartmentList() {
    departmentListAPI()
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUserDatas() {
    findProfile(`${userId}`)
      .then((response) => {
        setName(response.data.name);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setEmpNumber(response.data.empNumber);
        setDepartmentId(response.data.departmentId);
        setPassword(response.data.password);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleRegistrationForm(e: any) {
    e.preventDefault();
    if (isAdminUser()) {
      
      const register = {
        name,
        username,
        email,
        password,
        departmentId,
        empNumber,
      };
      console.log("the data is" + register.email);
      updateProfile(userId,register)
        .then((response) => {
          console.log(response.data);
          alert("User updated");
          navigate("/profile");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("need admin privillage");
    }
  }

  return (
    <>
      <br></br> <br></br> <br></br>
      <Card style={{ maxWidth: 450, margin: "0 auto", padding: "20px 5px" }}>
        <CardContent>
          <Typography variant="h5" align="center">
            Profile Edit
          </Typography>
          <form>
            <Grid container spacing={1}>
              <Grid xs={12} sm={6} item>
                <TextField
                  label="Employee Number"
                  placeholder="Enter the employee id"
                  variant="outlined"
                  fullWidth
                  required
                  value={empNumber}
                  onChange={(e) => setEmpNumber(e.target.value)}
                />
              </Grid>
              <Grid xs={12} sm={6} item>
                <TextField
                  label="Name"
                  placeholder="Enter the name"
                  variant="outlined"
                  fullWidth
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid xs={12} item>
                <Typography>Department Name</Typography>
                <Select
                  name="departmentId"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                >
                  {departments.map((dept:any) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.departName}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid xs={12} item>
                <TextField
                  label="Username"
                  placeholder="Enter the username"
                  variant="outlined"
                  fullWidth
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid xs={12} item>
                <TextField
                  label="Password"
                  type="password"
                  placeholder="Enter the password"
                  variant="outlined"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid xs={12} item>
                <TextField
                  label="Email"
                  type="email"
                  placeholder="Enter the email"
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              
              <Grid xs={12} item>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={(e) => handleRegistrationForm(e)}
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

export default ProfileUpdate;

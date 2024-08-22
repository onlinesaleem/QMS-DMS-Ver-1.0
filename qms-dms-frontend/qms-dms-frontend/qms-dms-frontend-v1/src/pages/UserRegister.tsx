import {
    Box,
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
import { useNavigate } from "react-router-dom";
import { isAdminUser, registerAPICall } from "../service/AuthService";
import { departmentListAPI } from "../service/UserService";

const UserRegister = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [departments, setDepartments] = useState([]);
    const [empNumber, setEmpNumber] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartmentList();
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

    async function handleRegistrationForm(e: any) {
        e.preventDefault();
        if (isAdminUser()) {
            const register = { name, username, email, password, departmentId, empNumber };
            try {
                const response = await registerAPICall(register);
                console.log(response.data);
                alert('User created successfully');
                navigate('/profile');
            } catch (error) {
                console.log(error);
                setErrorMessage('Error creating user. Please try again.');
            }
        } else {
            alert('Admin privilege required');
        }
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "10%" }}>
            <Card style={{ maxWidth: 600, margin: "0 auto", padding: "20px 5px" }}>
                <CardContent>
                    <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                        User Registration
                    </Typography>
                    {errorMessage && (
                        <Typography color="error" align="center">{errorMessage}</Typography>
                    )}
                    <form onSubmit={handleRegistrationForm}>
                        <Grid container spacing={2}>
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
                                <Select
                                    label="Department"
                                    fullWidth
                                    required
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(e.target.value)}
                                    displayEmpty
                                    variant="outlined"
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <em>Select Department</em>;
                                        }
                                        return selected;
                                    }}
                                >
                                    <MenuItem disabled value="">
                                        <em>Select Department</em>
                                    </MenuItem>
                                    {departments.map((dept: any) => (
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
                                <Button type="submit" variant="contained" fullWidth color="primary">
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default UserRegister;

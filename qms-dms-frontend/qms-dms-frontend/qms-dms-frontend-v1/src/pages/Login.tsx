import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAPICall, saveLoggedInUser, storeToken } from '../service/AuthService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    async function handleLoginForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await loginAPICall(username, password);
            const token = 'Bearer ' + response.data.accessToken;
            const role = response.data.role;
            storeToken(token);
            saveLoggedInUser(username, role);
            console.log("the data for" + username);
            console.log("the data role" + role);
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error(error);
            setErrorMessage('Incorrect username or password. Please try again.');
        }
    }

    return (
        <Box component="main" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <Card style={{ maxWidth: 450, padding: "20px 5px" }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>Sign In</Typography>
                    {errorMessage && (
                        <Typography color="error" align="center" sx={{ mb: 2 }}>{errorMessage}</Typography>
                    )}
                    <form onSubmit={handleLoginForm}>
                        <Grid container spacing={2}>
                            <Grid xs={12} item>
                                <TextField label="Username" placeholder="Enter your username" variant="outlined" fullWidth required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} />
                            </Grid>
                            <Grid xs={12} item>
                                <TextField type="password" label="Password" placeholder="Enter your password" variant="outlined" fullWidth required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                            </Grid>
                            <Grid xs={12} item>
                                <Button type="submit" variant="contained" fullWidth color="primary" sx={{ py: 1.5 }}>Login</Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;

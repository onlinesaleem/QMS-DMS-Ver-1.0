import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Typography, Button, ButtonProps } from '@mui/material';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getLoggedInUser } from '../service/AuthService';

// Create a custom button component to handle the 'to' prop correctly
const LinkButton = (props: ButtonProps & LinkProps) => {
  return <Button {...props} component={RouterLink as any} />;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5], // Increased shadow for better visual appeal
  maxWidth: 600,
  margin: 'auto',
  marginTop: theme.spacing(10), // Adjusted top margin
}));

const StaticNavigation = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(4), // Add margin between the paper and navigation
  gap: theme.spacing(2), // Add gap between buttons
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));

const StyledButton = styled(LinkButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[4],
  },
  '& span': {
    marginLeft: theme.spacing(1),
  }
}));

const LinkText = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  marginTop: theme.spacing(2), // Adjust spacing between text and button
  textAlign: 'center',
}));

export const Home = () => {
  const [dateTime, setDateTime] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setDateTime(now.toLocaleDateString(undefined, options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Incident Dashboard
      </Typography>
      <StyledPaper elevation={4}>
        <Typography variant="h3" gutterBottom>
          Hello, {getLoggedInUser() || 'Welcome'}!
        </Typography>
        <Typography variant="body1" paragraph>
          This is your central hub for the system. Access various modules, manage incidents, tasks, and view reports here.
        </Typography>
        <Typography variant="h6" color="textSecondary">
           {dateTime} 
        </Typography>
      </StyledPaper>
      <StaticNavigation>
        <div>
          <LinkText variant="body1">Dashboard</LinkText>
          <StyledButton to="/dashboard-incident" variant="contained">
            Go to Dashboard
          </StyledButton>
        </div>
        <div>
          <LinkText variant="body1">Incidents</LinkText>
          <StyledButton to="/incident-list" variant="contained">
            View Incidents
          </StyledButton>
        </div>
        <div>
          <LinkText variant="body1">Tasks</LinkText>
          <StyledButton to="/task-list" variant="contained">
            View Tasks
          </StyledButton>
        </div>
        <div>
          <LinkText variant="body1">Incident Form</LinkText>
          <StyledButton to="/incident-form" variant="contained">
            Create Incident
          </StyledButton>
        </div>
      </StaticNavigation>
    </>
  );
};

export default Home;


import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


// function Copyright() {
//   return (
//     <Typography variant="body2" color="text.secondary">
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function StickyFooter() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          alignItems: 'center',
          position: 'relative', // Ensure the container stays within the viewport
        }}
      >
        <CssBaseline />

        {/* Content of your page */}
        <Box sx={{ flex: 1 }}>
          {/* Your main content here */}
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 1,
            position: 'absolute', // Position the footer absolutely
            bottom: 0, // Stick it to the bottom
            width: '100%', // Occupy full width
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[900], // Example background color
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body1">
              Developed by @Saleem
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
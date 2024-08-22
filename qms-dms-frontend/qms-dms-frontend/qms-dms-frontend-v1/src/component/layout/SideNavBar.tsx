import Box from "@mui/material/Box";

import CssBaseline from "@mui/material/CssBaseline";
import { Header } from "./Header";




export default function SideNavBar() {
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <CssBaseline />
        <Header />
      </Box>
    </>
  );
}

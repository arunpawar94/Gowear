import React, { useState } from "react";
import { Collapse, Box, Typography, Button } from "@mui/material";

export default function SmoothCollapse() {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(!open)}>
        Toggle
      </Button>

      <Collapse in={open} timeout={500}>
        <Box p={2} bgcolor="lightgray">
          <Typography>Arun Pawar</Typography>
          <Typography>33, MukundKhedi</Typography>
          <Typography>Dewas, Madhya Pradesh, India</Typography>
          <Typography>455001</Typography>
          <Typography>Mobile No. 8827348971</Typography>
        </Box>
      </Collapse>
    </Box>
  );
}

import { IconButton, Stack } from "@mui/material";
import React from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import BedtimeIcon from "@mui/icons-material/Bedtime";

const ThemeButton = ({ toggleMenu, theme }) => {
  return (
    <Stack direction="row" spacing={1}>
      <IconButton
        onClick={toggleMenu}
        aria-label="Toggle Theme"
        color="secondary"
      >
        {theme === "light" ? <LightModeIcon /> : <BedtimeIcon />}
      </IconButton>
    </Stack>
  );
};

export default ThemeButton;

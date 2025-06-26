import React from "react";
import { Grid, Paper, TextField } from "@mui/material";

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const URLForm = ({ index, data, onChange }) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Original URL"
            fullWidth
            value={data.url}
            onChange={(e) => onChange(index, "url", e.target.value)}
            error={data.url && !isValidUrl(data.url)}
            helperText={
              data.url && !isValidUrl(data.url) ? "Invalid URL format" : ""
            }
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="Validity (minutes)"
            type="number"
            fullWidth
            value={data.validity}
            onChange={(e) => onChange(index, "validity", e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="Custom Shortcode"
            fullWidth
            value={data.shortcode}
            onChange={(e) => onChange(index, "shortcode", e.target.value)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default URLForm;
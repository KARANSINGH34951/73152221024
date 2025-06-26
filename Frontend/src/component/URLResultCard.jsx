
import React from "react";
import { Paper, Typography } from "@mui/material";

const URLResultCard = ({ shortLink, expiry }) => {
  return (
    <Paper sx={{ p: 2, my: 1 }} elevation={2}>
      <Typography>
        <strong>Short Link:</strong>{" "}
        <a href={shortLink} target="_blank" rel="noopener noreferrer">
          {shortLink}
        </a>
      </Typography>
      <Typography>
        <strong>Expires:</strong> {new Date(expiry).toLocaleString()}
      </Typography>
    </Paper>
  );
};

export default URLResultCard;
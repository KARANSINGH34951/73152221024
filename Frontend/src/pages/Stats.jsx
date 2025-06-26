
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";

const Stats = () => {
  const [shortcode, setShortcode] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/shorturls/${shortcode}`);
      setStats(res.data);
    } catch (err) {
      setStats(null);
      setError("Shortcode not found or server error");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        URL Statistics
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Enter Shortcode"
          fullWidth
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
        />
        <Button variant="contained" onClick={fetchStats}>
          Fetch Stats
        </Button>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      {stats && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Original URL:</Typography>
          <Typography gutterBottom>{stats.originalUrl}</Typography>

          <Typography><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</Typography>
          <Typography><strong>Expires At:</strong> {new Date(stats.expiry).toLocaleString()}</Typography>
          <Typography><strong>Total Clicks:</strong> {stats.totalClicks}</Typography>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Click Details:</Typography>

          {stats.clicks.length === 0 ? (
            <Typography>No clicks yet.</Typography>
          ) : (
            stats.clicks.map((click, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography>
                  <strong>Time:</strong> {new Date(click.timestamp).toLocaleString()}
                </Typography>
                <Typography>
                  <strong>Referrer:</strong> {click.referrer}
                </Typography>
                <Typography>
                  <strong>Location:</strong> {click.location}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))
          )}
        </Paper>
      )}
    </Container>
  );
};

export default Stats;
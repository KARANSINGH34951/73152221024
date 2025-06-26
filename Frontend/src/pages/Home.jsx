import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import axios from "axios";

const Home = () => {
  const [form, setForm] = useState({ url: "", validity: "", shortcode: "" });
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.url.trim()) {
      setError("URL is required");
      return;
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/shorturls`, {
        url: form.url,
        validity: form.validity ? parseInt(form.validity) : undefined,
        shortcode: form.shortcode || undefined,
      });
      setResults((prev) => [...prev, res.data]);
      setForm({ url: "", validity: "", shortcode: "" });
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Shortcode already exists!");
      } else {
        setError("Something went wrong.");
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Original URL"
        name="url"
        value={form.url}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Validity (in minutes)"
        name="validity"
        type="number"
        value={form.validity}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Custom Shortcode (optional)"
        name="shortcode"
        value={form.shortcode}
        onChange={handleChange}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Shorten URL
      </Button>

      {results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Shortened URLs:</Typography>
          {results.map((r, index) => (
            <Box
              key={index}
              sx={{ my: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
            >
              <Typography>
                <strong>Short Link:</strong>{" "}
                <a
                  href={r.shortLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.shortLink}
                </a>{" "}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => copyToClipboard(r.shortLink)}
                  sx={{ ml: 2 }}
                >
                  Copy
                </Button>
              </Typography>
              <Typography>
                <strong>Expires:</strong> {new Date(r.expiry).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Home;
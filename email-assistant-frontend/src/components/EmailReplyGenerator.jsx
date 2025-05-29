import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  IconButton,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const tones = ['Formal', 'Friendly', 'Apologetic', 'Assertive', 'Thankful'];

const EmailReplyGenerator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [email, setEmail] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleGenerate = async () => {
  setLoading(true);
  setError('');
  try {
    const res = await axios.post('https://inboxpal-backend.onrender.com/api/email-generator/generate', {
      emailContent: email,
      tone
    });

    // Axios automatically parses JSON, so you get `res.data` directly
    setGeneratedReply(res.data.reply || res.data); // adapt based on your backend response shape
  } catch (err) {
    setError(err.response?.data?.message || err.message || 'Unexpected error');
    setGeneratedReply('');
  } finally {
    setLoading(false);
  }
};

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f7fa, #fce4ec)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        py: 4,
        px: 2
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 900, p: isMobile ? 2 : 4, boxShadow: 8 }}>
        <CardContent>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            align="center"
            gutterBottom
            color="primary"
          >
            <EmailIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            AI Email Reply Generator
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Enter Email Content"
            multiline
            rows={isMobile ? 4 : 6}
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
          />

          <FormControl fullWidth margin="normal" disabled={loading}>
            <InputLabel>Select Tone</InputLabel>
            <Select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              label="Select Tone"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200
                  }
                }
              }}
            >
              {tones.map((toneOption) => (
                <MenuItem key={toneOption} value={toneOption.toLowerCase()}>
                  {toneOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            sx={{
              my: 2,
              py: 1.4,
              fontSize: isMobile ? '0.9rem' : '1rem',
              backgroundColor: '#0288d1',
              '&:hover': { backgroundColor: '#0277bd' }
            }}
            onClick={handleGenerate}
            disabled={!email || !tone || loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          >
            {loading ? 'Generating...' : 'Generate Reply'}
          </Button>

          {generatedReply && (
            <Paper elevation={3} sx={{ p: 2, mt: 3, position: 'relative', background: '#f5f5f5' }}>
              <TextField
                label="Generated Reply"
                multiline
                rows={isMobile ? 4 : 6}
                fullWidth
                value={generatedReply}
                InputProps={{ readOnly: true }}
              />
              <Tooltip title="Copy to clipboard">
                <IconButton
                  onClick={handleCopy}
                  sx={{ position: 'absolute', top: 10, right: 10 }}
                  color="secondary"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Paper>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Reply copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmailReplyGenerator;

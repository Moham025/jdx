import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';

const DiagnosticPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Page de diagnostic
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography>
            Cette page vous permet de vérifier si l'application est correctement configurée.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default DiagnosticPage;

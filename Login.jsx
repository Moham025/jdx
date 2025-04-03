import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container, 
  Divider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert 
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [role, setRole] = useState('Employé');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, signUpWithEmail, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Handle sign up
        await signUpWithEmail(email, password, prenom, nom, role);
        navigate('/');
      } else {
        // Handle login
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      console.error("Google sign in error:", err);
      setError(err.message || "Erreur lors de la connexion avec Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {isSignUp ? "Créer un compte" : "Connexion"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {isSignUp && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="prenom"
                label="Prénom"
                name="prenom"
                autoComplete="given-name"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="nom"
                label="Nom"
                name="nom"
                autoComplete="family-name"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="role-label">Rôle</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Rôle"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="Directeur">Directeur</MenuItem>
                  <MenuItem value="Employé">Employé</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Chargement...' : isSignUp ? "S'inscrire" : "Se connecter"}
          </Button>

          <Divider sx={{ my: 2 }}>OU</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            Continuer avec Google
          </Button>

          <Box textAlign="center">
            <Button 
              onClick={() => setIsSignUp(!isSignUp)}
              sx={{ textTransform: 'none' }}
            >
              {isSignUp 
                ? "Déjà un compte? Se connecter" 
                : "Pas encore de compte? S'inscrire"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;

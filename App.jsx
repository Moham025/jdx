import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

// Contexts
import { ThemeModeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import DiagnosticPage from './pages/DiagnosticPage';
import ClientsPageIndex from './pages/clients'; // Import the new client page index
import ProjectsPage from './pages/projects'; // Import the new project page index
import TransactionsPageIndex from './pages/transactions'; // Import the new transaction page index

// Components
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute'; // Utilisez le bon nom ici

// Hooks
import { useThemeMode } from './hooks/useThemeMode';

// Themes
import { lightTheme, darkTheme } from './theme';

// Composant avec thème appliqué
const ThemedApp = () => {
  const { mode } = useThemeMode();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/diagnostic" element={<DiagnosticPage />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<ClientsPageIndex />} /> {/* Add route for clients */}
            <Route path="projets" element={<ProjectsPage />} /> {/* Add route for projects */}
            <Route path="transactions" element={<TransactionsPageIndex />} /> {/* Add route for transactions */}
            {/* Ajoutez d'autres routes ici quand vous aurez les composants */}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

// Composant principal
const App = () => {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </ThemeModeProvider>
  );
};

export default App;

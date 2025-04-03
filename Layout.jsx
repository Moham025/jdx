import React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, IconButton, ButtonBase } from '@mui/material'; // Added ButtonBase
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AccountTreeIcon from '@mui/icons-material/AccountTree'; // Icon for Projects
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // Icon for Transactions
import LogoutIcon from '@mui/icons-material/Logout'; // Icon for Logout
import LoginIcon from '@mui/icons-material/Login'; // Icon for Login
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon
import { Outlet, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Clock from '../shared/Clock'; // Import the Clock component
import logo from '../../assets/ngnior logo-03.png'; // Import the logo
import { useThemeMode } from '../../hooks/useThemeMode'; // Import the theme hook
import { useAuth } from '../../hooks/useAuth'; // Import the auth hook

const drawerWidth = 240;

const Layout = () => {
  const { user, logout } = useAuth(); // Get user info and logout function
  //console.log(">>> Layout component user object:", user); // <<< ADD DEBUG LOG
  const navigate = useNavigate(); // Hook for navigation
  const { mode, toggleColorMode } = useThemeMode(); // Get theme mode and toggle function

  const handleUserAction = async () => {
    if (user) {
      // Log out
      try {
        await logout();
        console.log("Déconnexion réussie");
        // Navigate to login after logout if not handled by PrivateRoute automatically
        // navigate('/login');
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        // Handle logout error (e.g., show notification)
      }
    } else {
      // Navigate to login
      navigate('/login');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* Logo and Title */}
          <Avatar src={logo} sx={{ width: 36, height: 36, mr: 1.5 }} variant="square" />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Ngnior Gestion
          </Typography>

          {/* Clock */}
          <Clock />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List sx={{ flexGrow: 1 }}>
            {/* Navigation with Icons */}
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Tableau de Bord" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/clients">
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="Clients" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/projets">
                <ListItemIcon>
                  <AccountTreeIcon />
                </ListItemIcon>
                <ListItemText primary="Projets" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/transactions">
                <ListItemIcon>
                  <ReceiptLongIcon />
                </ListItemIcon>
                <ListItemText primary="Transactions" />
              </ListItemButton>
            </ListItem>
             {/* Add other nav items here */}
          </List>
          {/* Sidebar Footer */}
          <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
             <Divider sx={{ mb: 1 }}/>
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {/* User Info Area (Clickable) */}
                <ButtonBase
                    onClick={handleUserAction}
                    title={user ? "Se déconnecter" : "Se connecter"}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1, // Add padding for click area
                        borderRadius: 1, // Add slight rounding
                        textAlign: 'left',
                        flexGrow: 1, // Allow it to take space
                        mr: 1, // Margin before theme toggle
                        '&:hover': { bgcolor: 'action.hover' } // Add hover effect
                    }}
                >
                    {user ? <LogoutIcon color="action"/> : <LoginIcon color="action"/>}
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'medium', lineHeight: 1.2 }}>
                           {user ? `Bonjour, ${user.prenom || user.email}` : 'Non connecté'}
                        </Typography>
                        {user && (
                            <>
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ lineHeight: 1.2, wordBreak: 'break-all' }}>
                                    {user.email}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                                    Rôle: {user.role || 'N/A'}
                                </Typography>
                            </>
                        )}
                    </Box>
                </ButtonBase>

                {/* Theme Toggle Button */}
                <IconButton sx={{ ml: 'auto' }} onClick={toggleColorMode} color="inherit" title={mode === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}>
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
             </Box>
          </Box>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;

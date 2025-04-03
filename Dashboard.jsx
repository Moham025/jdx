import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Paper } from '@mui/material'; // Removed Icon import as it's not directly used
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'; // For stable/neutral change
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Import Filler for area charts
} from 'chart.js';

// Register Chart.js components including Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Placeholder Data (Replace with Firebase data) ---
const stats = [
  { title: "Chiffre d'affaires (30j)", value: 12450000, change: 15, changeType: 'positive', iconColor: 'success.main' },
  { title: "Projets en cours", value: 8, change: 2, changeType: 'positive', changeText: 'nouveaux', iconColor: 'success.main' },
  { title: "Clients actifs", value: 24, change: 0, changeType: 'neutral', changeText: 'stable', iconColor: 'text.secondary' },
  { title: "Dépenses mensuelles", value: 7890000, change: -5, changeType: 'negative', iconColor: 'error.main' },
];

const activityChartData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'], // Example labels
  datasets: [
    {
      label: 'Revenus (XOF)',
      data: [8500000, 9200000, 10100000, 12450000, 11500000, 13200000], // Example data
      borderColor: 'rgba(58, 134, 255, 1)', // --clr-primary
      backgroundColor: 'rgba(58, 134, 255, 0.1)',
      tension: 0.3,
      fill: true,
    },
    {
      label: 'Dépenses (XOF)',
      data: [6200000, 5800000, 6500000, 7890000, 7200000, 6800000], // Example data
      borderColor: 'rgba(255, 0, 110, 1)', // --clr-danger
      backgroundColor: 'rgba(255, 0, 110, 0.1)',
      tension: 0.3,
      fill: true,
    },
  ],
};

const activityChartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Allow chart to fill container height
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false, // Title is handled by the Paper component
    },
    tooltip: {
        callbacks: {
            label: function(context) {
                return context.dataset.label + ': ' + formatCurrency(context.raw);
            }
        }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
          callback: function(value) {
              // Format ticks as currency
              return formatCurrency(value, 0); // No decimals for ticks
          }
      }
    },
  },
};

// Helper function to format currency (XOF)
const formatCurrency = (amount, maximumFractionDigits = 0) => {
    return new Intl.NumberFormat('fr-BF', { // fr-BF for Burkina Faso XOF formatting
        style: 'currency',
        currency: 'XOF',
        maximumFractionDigits: maximumFractionDigits
    }).format(amount);
};

// Helper component for Stat Card Change Indicator
const StatChangeIndicator = ({ type, value, text, color }) => {
    let IconComponent = TrendingFlatIcon;
    let changePrefix = '';
    let displayText = text || '';

    if (type === 'positive') {
        IconComponent = ArrowUpwardIcon;
        changePrefix = '+';
        if (!text) displayText = `${value}% vs mois dernier`;
    } else if (type === 'negative') {
        IconComponent = ArrowDownwardIcon;
        // Value is already negative
        if (!text) displayText = `${value}% vs mois dernier`;
    }

    return (
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: color }}>
            <IconComponent sx={{ fontSize: '1rem' }} />
            {changePrefix}{displayText}
        </Typography>
    );
};


const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1a1a2e' : '#f8f9fa' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
        Tableau de Bord
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}> {/* Adjusted grid size for 4 cards */}
            <Card elevation={2} sx={{ borderRadius: '8px', height: '100%', backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#16213e' : '#ffffff' }}>
              <CardContent>
                <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color: (theme) => theme.palette.text.primary }}>
                  {typeof stat.value === 'number' && stat.title.toLowerCase().includes('affaire') ? formatCurrency(stat.value) : stat.value}
                </Typography>
                <StatChangeIndicator
                    type={stat.changeType}
                    value={stat.change}
                    text={stat.changeText}
                    color={stat.iconColor}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Activity Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#16213e' : '#ffffff' }}>
             <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
                Activité Récente
             </Typography>
             {/* Set specific height for the chart container */}
             <Box sx={{ height: '350px', position: 'relative' }}>
                <Line options={activityChartOptions} data={activityChartData} />
             </Box>
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
};

export default Dashboard;

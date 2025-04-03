import React from 'react';
import { TableRow, TableCell, IconButton, CircularProgress, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ClientList = ({ clients = [], isLoading = false, onEdit, onDelete }) => {

    if (isLoading) {
        return (
            <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                    <Box component="span" sx={{ ml: 2 }}>Chargement des clients...</Box>
                </TableCell>
            </TableRow>
        );
    }

    if (clients.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    Aucun client trouvé.
                </TableCell>
            </TableRow>
        );
    }

    // Sort clients by ID before rendering
    const sortedClients = [...clients].sort((a, b) => a.id.localeCompare(b.id));

    return (
        <>
            {sortedClients.map(client => (
                <TableRow
                    key={client.id}
                    hover // Add hover effect from MUI
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        {client.id}
                    </TableCell>
                    <TableCell>{client.prenom} {client.nom}</TableCell>
                    <TableCell>+226 {client.telephone}</TableCell>
                    <TableCell align="right">
                        <IconButton
                            aria-label="modifier"
                            size="small"
                            onClick={() => onEdit(client)}
                            sx={{ mr: 1 }} // Add some margin
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            aria-label="supprimer"
                            size="small"
                            onClick={() => onDelete(client.id, `${client.prenom} ${client.nom}`)}
                            color="error" // Use theme's error color for delete icon
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
};

export default ClientList;

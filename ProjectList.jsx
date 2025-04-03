import React from 'react';
import PropTypes from 'prop-types';
import {
    TableRow, TableCell, IconButton, Tooltip, Box, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Helper function to format cost (can be moved to utils if used elsewhere)
const formatCost = (cost) => {
    if (cost === null || cost === undefined || isNaN(cost)) {
        return 'N/A';
    }
    // Format without currency symbol for cleaner table, add symbol in header/tooltip
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(cost);
};

// Helper function to format date (can be moved to utils)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR'); // Format DD/MM/YYYY
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return dateString;
    }
};

// Define common styles for table cells to ensure truncation
const cellStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 0, // Important for ellipsis to work with fixed table layout
};

const ProjectList = ({ projects, getClientName, onEdit, onDelete }) => {
    // Note: isLoading and empty state are handled in the parent component (ProjectsPage)

    return (
        <>
            {projects.map((project) => {
                console.log(">>> ProjectList rendering project with id:", project.id, "and data:", project); // <<< ADD DEBUG LOG
                return (
                <TableRow
                    key={project.id} // Use the id (should be structuredId) as key
                    hover // Add hover effect
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    {/* ID Projet */}
                    <TableCell component="th" scope="row" sx={{ ...cellStyle, maxWidth: '120px' }} title={project.id}>
                        {project.id}
                    </TableCell>
                    {/* Client */}
                    <TableCell sx={{ ...cellStyle, maxWidth: '180px' }} title={`${getClientName(project.clientId)} (${project.clientId})`}>
                        {getClientName(project.clientId)}
                        <Typography variant="caption" display="block" color="text.secondary">
                            ({project.clientId})
                        </Typography>
                    </TableCell>
                    {/* Désignation - Add check for undefined */}
                    <TableCell sx={{ ...cellStyle, maxWidth: '250px' }} title={project.designation || ''}>
                        {project.designation || ''} {/* Display empty string if undefined */}
                    </TableCell>
                    {/* Type - Add check for undefined */}
                    <TableCell sx={{ ...cellStyle, maxWidth: '100px' }} title={project.type || ''}>
                        {project.type || ''} {/* Display empty string if undefined */}
                    </TableCell>
                    {/* Coût - Use helper which handles undefined */}
                    <TableCell align="right" sx={{ ...cellStyle, maxWidth: '120px', fontWeight: 500 }} title={`${formatCost(project.cout)} XOF`}>
                        {formatCost(project.cout)} {/* formatCost already returns 'N/A' */}
                    </TableCell>
                    {/* Date Création - Use helper which handles undefined */}
                    <TableCell sx={{ ...cellStyle, maxWidth: '100px' }} title={formatDate(project.dateCreation)}>
                        {formatDate(project.dateCreation)} {/* formatDate already returns 'N/A' */}
                    </TableCell>
                    {/* Actions */}
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', width: '100px' }}> {/* Ensure buttons fit */}
                        <Tooltip title="Modifier">
                            <IconButton size="small" onClick={() => onEdit(project)} color="primary">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                            <IconButton size="small" onClick={() => onDelete(project.id)} color="error">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                </TableRow>
            ); // Close the return statement for the TableRow
            })} {/* Close the map function call */}
        </>
    );
};

ProjectList.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        clientId: PropTypes.string.isRequired,
        designation: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        cout: PropTypes.number.isRequired,
        dateCreation: PropTypes.string.isRequired,
    })).isRequired,
    getClientName: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    // isLoading prop is no longer needed here
};

export default ProjectList;

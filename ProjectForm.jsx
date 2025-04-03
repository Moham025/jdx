import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText, Alert
} from '@mui/material';

// No longer need Modal or useThemeMode here, parent handles it.

const ProjectForm = ({ projectData, clients, onSubmit, onCancel, formError }) => {
    // --- State ---
    const [formData, setFormData] = useState({
        clientId: '',
        designation: '',
        type: '',
        cout: '',
        dateCreation: new Date().toISOString().split('T')[0], // Default to today
    });
    const [validationError, setValidationError] = useState(''); // For local validation

    // --- Effects ---
    useEffect(() => {
        // Pre-fill form if editing project data is provided
        if (projectData) {
            setFormData({
                clientId: projectData.clientId || '',
                designation: projectData.designation || '',
                type: projectData.type || '',
                cout: projectData.cout || '',
                dateCreation: projectData.dateCreation ? projectData.dateCreation.split('T')[0] : new Date().toISOString().split('T')[0],
            });
        } else {
            // Reset form for adding new project
            setFormData({
                clientId: '',
                designation: '',
                type: '',
                cout: '',
                dateCreation: new Date().toISOString().split('T')[0],
            });
        }
        setValidationError(''); // Clear validation error when data changes
    }, [projectData]);

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setValidationError(''); // Clear validation error on change
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError(''); // Clear previous validation errors

        // Basic Validation
        if (!formData.clientId || !formData.designation.trim() || !formData.type || !formData.cout || !formData.dateCreation) {
            setValidationError('Veuillez remplir tous les champs obligatoires (*).');
            return;
        }
        const costValue = parseFloat(formData.cout);
        if (isNaN(costValue) || costValue < 0) {
            setValidationError('Le coût doit être un nombre positif.');
            return;
        }

        // Pass validated data to parent onSubmit handler
        onSubmit({
            ...formData,
            designation: formData.designation.trim(),
            cout: costValue // Pass the parsed number
        });
        // Parent component (ProjectsPage) handles closing the modal on success/error
    };

    // --- Render Logic (using MUI components) ---
    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* Display external submission errors passed from parent */}
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            {/* Display local validation errors */}
            {validationError && <Alert severity="warning" sx={{ mb: 2 }}>{validationError}</Alert>}

            {/* Client Selection */}
            <FormControl fullWidth margin="normal" required error={!formData.clientId && validationError}>
                <InputLabel id="project-client-label">Client *</InputLabel>
                <Select
                    labelId="project-client-label"
                    id="projectClient"
                    name="clientId"
                    value={formData.clientId}
                    label="Client *"
                    onChange={handleChange}
                    disabled={!!projectData} // Disable client change when editing
                >
                    <MenuItem value="" disabled>
                        <em>-- Sélectionner un client --</em>
                    </MenuItem>
                    {clients && clients.length > 0 ? (
                        clients.map(client => (
                            <MenuItem key={client.id} value={client.id}>
                                {client.prenom} {client.nom} ({client.id})
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem value="" disabled>Aucun client disponible</MenuItem>
                    )}
                </Select>
                {!!projectData && <FormHelperText>Le client ne peut pas être modifié.</FormHelperText>}
                {!formData.clientId && validationError && <FormHelperText error>Ce champ est requis.</FormHelperText>}
            </FormControl>

            {/* Designation */}
            <TextField
                margin="normal"
                required
                fullWidth
                id="projectDesignation"
                label="Désignation"
                name="designation"
                multiline
                rows={3}
                value={formData.designation}
                onChange={handleChange}
                error={!formData.designation.trim() && validationError}
                helperText={!formData.designation.trim() && validationError ? 'Ce champ est requis.' : ''}
            />

            {/* Project Type */}
            <FormControl fullWidth margin="normal" required error={!formData.type && validationError}>
                <InputLabel id="project-type-label">Type de Projet *</InputLabel>
                <Select
                    labelId="project-type-label"
                    id="projectType"
                    name="type"
                    value={formData.type}
                    label="Type de Projet *"
                    onChange={handleChange}
                >
                    <MenuItem value="" disabled>
                        <em>-- Choisir le type --</em>
                    </MenuItem>
                    <MenuItem value="Plan">Plan</MenuItem>
                    <MenuItem value="Étude">Étude</MenuItem>
                    <MenuItem value="Suivi">Suivi-Contrôle</MenuItem>
                    <MenuItem value="Construction">Construction</MenuItem>
                </Select>
                 {!formData.type && validationError && <FormHelperText error>Ce champ est requis.</FormHelperText>}
            </FormControl>

            {/* Cost */}
            <TextField
                margin="normal"
                required
                fullWidth
                id="projectCout"
                label="Coût Total (XOF)"
                name="cout"
                type="number"
                value={formData.cout}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0, step: "any" } }}
                placeholder="Ex: 1500000"
                error={(isNaN(parseFloat(formData.cout)) || parseFloat(formData.cout) < 0) && validationError}
                 helperText={(isNaN(parseFloat(formData.cout)) || parseFloat(formData.cout) < 0) && validationError ? 'Veuillez entrer un coût valide (nombre positif).' : ''}
            />

            {/* Creation Date */}
            <TextField
                margin="normal"
                required
                fullWidth
                id="projectDate"
                label="Date de Création"
                name="dateCreation"
                type="date"
                value={formData.dateCreation}
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true, // Keep label shrunk for date type
                }}
                 error={!formData.dateCreation && validationError}
                 helperText={!formData.dateCreation && validationError ? 'Ce champ est requis.' : ''}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                <Button onClick={onCancel} variant="outlined" color="secondary">
                    Annuler
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    {projectData ? 'Modifier' : 'Enregistrer'}
                </Button>
            </Box>
        </Box>
    );
};

ProjectForm.propTypes = {
    // isOpen and onClose are no longer needed as props here
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired, // Renamed from onClose for clarity
    projectData: PropTypes.object, // Null when adding, object when editing
    clients: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        prenom: PropTypes.string,
        nom: PropTypes.string,
    })).isRequired,
    formError: PropTypes.string, // Error message from parent submission attempt
};

export default ProjectForm;

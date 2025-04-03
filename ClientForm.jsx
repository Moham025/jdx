import React from 'react';
import { Box, TextField, Button, InputAdornment } from '@mui/material';

const ClientForm = ({ formData, onChange, onSubmit, onCancel, mode = 'add' }) => {
    const { prenom, nom, telephone } = formData;

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedPrenom = prenom.trim();
        const trimmedNom = nom.trim();
        const trimmedTelephone = telephone.trim();

        // Basic validation - can be enhanced
        if (!trimmedPrenom || !trimmedNom || !trimmedTelephone) {
            alert('Veuillez remplir tous les champs.'); // Consider using Snackbar for feedback
            return;
        }
        if (!/^\d{8}$/.test(trimmedTelephone)) {
            alert('Le numéro de téléphone doit contenir exactement 8 chiffres.');
            return;
        }
        onSubmit({ prenom: trimmedPrenom, nom: trimmedNom, telephone: trimmedTelephone });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate // Prevent browser validation, rely on custom logic
            sx={{ mt: 1 }} // Add some margin top
        >
            <TextField
                margin="normal"
                required
                fullWidth
                id="clientPrenom"
                label="Prénom"
                name="prenom"
                value={prenom}
                onChange={onChange}
                autoFocus // Focus the first field
                variant="outlined" // Standard MUI variant
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="clientNom"
                label="Nom"
                name="nom"
                value={nom}
                onChange={onChange}
                variant="outlined"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="clientTelephone"
                label="Téléphone"
                name="telephone"
                type="tel" // Use tel type
                value={telephone}
                onChange={onChange}
                variant="outlined"
                InputProps={{
                    startAdornment: <InputAdornment position="start">+226</InputAdornment>,
                }}
                inputProps={{
                    pattern: "[0-9]{8}", // HTML5 pattern for basic validation hint
                    title: "Doit contenir 8 chiffres après +226"
                }}
            />

            {/* Footer Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2, mt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={onCancel} variant="outlined" color="secondary">
                    Annuler
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    {mode === 'edit' ? 'Modifier' : 'Enregistrer'}
                </Button>
            </Box>
        </Box>
    );
};

export default ClientForm;

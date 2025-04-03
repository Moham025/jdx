import React, { useState, useEffect, useCallback } from 'react'; // Keep useState for local form state if needed, or remove if fully controlled
import {
  DialogContent, DialogActions, TextField, Button,
  MenuItem, Select, InputLabel, FormControl, FormHelperText // Added FormHelperText
} from '@mui/material';
import { db } from '../../firebase/config'; // Keep db import for fetching projects
import { collection, getDocs } from 'firebase/firestore'; // Keep firestore imports

// Receive props from parent (index.jsx)
function TransactionForm({ formData, onChange, onSubmit, onCancel, mode, transaction, formError }) {

  // State for projects dropdown - keep this local to the form
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);

  // Fetch projects when the component mounts or when needed
  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const projectsCollectionRef = collection(db, 'projets'); // Assuming collection name is 'projets'
      const data = await getDocs(projectsCollectionRef);
      const fetchedProjects = data.docs.map((doc) => ({
          id: doc.id, // Use Firestore ID
          ...doc.data()
      }));
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects: ", error);
      setProjectsError("Erreur chargement projets");
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  // Fetch projects when the form is opened (or becomes visible)
  // This depends on how the Modal in index.jsx handles mounting/unmounting.
  // If the form stays mounted, we might need an 'open' prop or trigger differently.
  // For simplicity, fetch on mount.
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);


  // Handle internal form submission, then call the onSubmit prop from parent
  const handleSubmit = (event) => {
    event.preventDefault();
    // Basic validation (can be enhanced)
    if (!formData.projectId || !formData.amount || !formData.transactionDate) {
      console.error("Please fill all required fields");
      // Optionally set a local error state to display in the form
      return;
    }

    // Find project name to pass back up (optional, parent can also do this)
    const selectedProject = projects.find(p => p.id === formData.projectId);
    const submissionData = {
        ...formData,
        projectName: selectedProject?.designation || 'Projet Inconnu' // Pass project name
    };

    onSubmit(submissionData); // Call parent onSubmit
  };

  // Handle input changes and call the onChange prop from parent
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ target: { name, value } }); // Pass event-like object to parent's handleFormChange
  };

  // Handle Select change specifically
   const handleSelectChange = (event) => {
        onChange({ target: { name: 'projectId', value: event.target.value } });
    };


  return (
    // No Dialog or DialogTitle here, handled by parent Modal
    <form onSubmit={handleSubmit}>
      <DialogContent>
        {/* Display general form submission errors passed from parent */}
        {formError && <FormHelperText error sx={{ mb: 2 }}>{formError}</FormHelperText>}

        <FormControl fullWidth margin="dense" required error={!formData.projectId && projectsError === null}>
          <InputLabel id="project-select-label">Projet</InputLabel>
          <Select
            labelId="project-select-label"
            id="project-select"
            name="projectId" // Add name attribute
            value={formData.projectId} // Use formData prop
            label="Projet"
            onChange={handleSelectChange} // Use specific handler for select
            disabled={projectsLoading}
          >
            <MenuItem value="">
              <em>{projectsLoading ? 'Chargement...' : 'Sélectionner un projet'}</em>
            </MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {/* Use a consistent field like 'designation' or 'nom' */}
                {project.designation || project.nom || `Projet ${project.id}`}
              </MenuItem>
            ))}
          </Select>
          {projectsError && <FormHelperText error>{projectsError}</FormHelperText>}
        </FormControl>
        <TextField
          margin="dense"
          id="amount"
          name="amount" // Add name attribute
          label="Montant (FCFA)"
          type="number"
          fullWidth
          variant="outlined"
          value={formData.amount} // Use formData prop
          onChange={handleChange} // Use generic handler
          required
          InputProps={{
            inputProps: { min: 0 }
          }}
        />
        <TextField
          margin="dense"
          id="transactionDate"
          name="transactionDate" // Add name attribute
          label="Date de Transaction"
          type="date"
          fullWidth
          variant="outlined"
          value={formData.transactionDate} // Use formData prop
          onChange={handleChange} // Use generic handler
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        {/* Use onCancel prop for cancel button */}
        <Button onClick={onCancel}>Annuler</Button>
        {/* Change button text based on mode */}
        <Button type="submit" variant="contained">
           {mode === 'edit' ? 'Modifier' : 'Valider'}
        </Button>
      </DialogActions>
    </form>
    // No Dialog closing tag here
  );
}

export default TransactionForm;

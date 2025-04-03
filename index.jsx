import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Fab, Modal, Paper, IconButton, Alert, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import ClientList from './ClientList'; // Renders TableRows
import ClientForm from './ClientForm'; // MUI Form inside Modal
import { db } from '../../firebase/config'; // Import db
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy, setDoc } from 'firebase/firestore'; // Import firestore functions
import { generateClientId, initializeIdCounter } from '../../utils/idGenerator';
// import './Clients.css'; // Remove direct CSS import, rely on MUI

// Style for the modal content box
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 2,
    boxShadow: 24,
    p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
    outline: 'none',
};


const ClientsPageIndex = () => {
    // --- State ---
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentClient, setCurrentClient] = useState(null); // Stores the client being edited (including firestoreId)
    const [formData, setFormData] = useState({ // Form state separate from currentClient
        prenom: '',
        nom: '',
        telephone: ''
    });
    const [error, setError] = useState(null); // For displaying fetch/submit errors

    // --- Firestore Refs ---
    const clientsCollectionRef = collection(db, 'clients');

    // --- Data Fetching (Real Firestore Fetch) ---
    const fetchClients = useCallback(async () => {
        setIsLoading(true);
        setError(null); // Clear previous errors
        try {
            const q = query(clientsCollectionRef, orderBy('nom'), orderBy('prenom')); // Order by name
            const data = await getDocs(q);
            // Map Firestore doc id AND structuredId. Use structuredId as the primary display/reference ID.
            const fetchedClients = data.docs.map((doc) => ({
                firestoreId: doc.id, // Keep the actual document ID for updates/deletes
                ...doc.data(),
                id: doc.data().structuredId || doc.id // Use structuredId as the main 'id', fallback to doc.id
            }));
            setClients(fetchedClients);
            initializeIdCounter(fetchedClients); // Initialize counter based on fetched structured IDs
        } catch (err) {
            console.error("Error fetching clients: ", err);
            setError("Erreur lors de la récupération des clients.");
            setClients([]); // Ensure clients is an array even on error
        } finally {
            setIsLoading(false);
        }
    }, [clientsCollectionRef]); // Dependency on the collection ref

    useEffect(() => {
        fetchClients(); // Fetch data on component mount
    }, []); // Use empty dependency array to run only once on mount

    // --- Modal Management ---
    const openModal = useCallback((mode = 'add', client = null) => {
        setModalMode(mode);
        setError(null); // Clear potential previous errors
        if (mode === 'edit' && client) {
            setCurrentClient(client); // Store the whole client object including firestoreId and id (structuredId)
            setFormData({ // Set form data for editing
                prenom: client.prenom || '',
                nom: client.nom || '',
                telephone: client.telephone || ''
            });
        } else {
            setCurrentClient(null); // Clear current client
            setFormData({ prenom: '', nom: '', telephone: '' }); // Reset form for adding
        }
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setCurrentClient(null); // Clear client being edited
        setError(null); // Clear errors on close
    }, []);

    // --- Form Handling ---
    const handleFormChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }, []);

    const handleFormSubmit = useCallback(async (submittedData) => {
        setError(null); // Clear previous errors
        const { prenom, nom, telephone } = submittedData; // Data comes validated from ClientForm

        if (modalMode === 'edit' && currentClient && currentClient.firestoreId) {
            // --- Update Client ---
            const clientDoc = doc(db, 'clients', currentClient.firestoreId);
            const updateData = { prenom, nom, telephone }; // structuredId should not change
            try {
                await updateDoc(clientDoc, updateData);
                // Optimistic update in state
                setClients(prevClients =>
                    prevClients.map(c =>
                        c.firestoreId === currentClient.firestoreId ? { ...c, ...updateData } : c
                    )
                );
                closeModal();
            } catch (err) {
                console.error("Error updating client: ", err);
                setError("Erreur lors de la modification du client."); // Show error (could be passed to form)
            }
        } else if (modalMode === 'add') {
            // --- Add Client ---
            const newClientId = generateClientId(); // Generate the structured ID (e.g., CL-25-01)
            const newClientData = {
                prenom: prenom.trim(),
                nom: nom.trim(),
                telephone: telephone.trim(),
                structuredId: newClientId, // Store the generated ID
                dateCreation: new Date().toISOString() // Add creation timestamp
            };
            try {
                // Use structuredId as the document ID in Firestore for consistency and easier querying
                const clientDocRef = doc(db, 'clients', newClientId);
                await setDoc(clientDocRef, newClientData);

                // Optimistic update in state (add firestoreId which is same as structuredId here)
                setClients(prevClients => [...prevClients, { ...newClientData, id: newClientId, firestoreId: newClientId }]);
                // No need to call initializeIdCounter here, generateClientId handles incrementing
                closeModal();
            } catch (err) {
                console.error("Error adding client: ", err);
                setError("Erreur lors de l'ajout du client."); // Show error (could be passed to form)
            }
        } else {
             setError("Erreur: Mode d'opération invalide ou client non sélectionné.");
        }
    }, [modalMode, currentClient, closeModal]); // Removed clientsCollectionRef, clients from deps

    // --- Delete Handling ---
    const handleDeleteClient = useCallback(async (clientToDelete) => {
        // clientToDelete should contain { id: structuredId, firestoreId: doc.id, ... }
        if (!clientToDelete || !clientToDelete.firestoreId) {
             console.error("Cannot delete: Missing client data or Firestore ID.", clientToDelete);
             setError("Impossible de supprimer le client : données manquantes.");
             return;
        }
        const clientName = `${clientToDelete.prenom || ''} ${clientToDelete.nom || ''}`.trim() || clientToDelete.id;
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le client ${clientName} (${clientToDelete.id}) ?`)) {
            return;
        }
        setError(null); // Clear previous errors
        try {
            const clientDoc = doc(db, 'clients', clientToDelete.firestoreId);
            await deleteDoc(clientDoc);
            // Update state by filtering out the deleted client using firestoreId
            setClients(prevClients => prevClients.filter(c => c.firestoreId !== clientToDelete.firestoreId));
        } catch (err) {
            console.error("Error deleting client: ", err);
            setError("Erreur lors de la suppression du client.");
        }
    }, []); // Removed clientsCollectionRef dependency


    // --- Render using MUI components ---
    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}> {/* Responsive padding */}
            <Typography variant="h4" component="h1" gutterBottom color="primary">
                Gestion des Clients
            </Typography>

            {/* Display errors */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }} aria-label="table des clients">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID Client</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nom Complet</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Téléphone</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress sx={{ my: 3 }} />
                                    <Typography>Chargement des clients...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : clients.length === 0 && !error ? (
                             <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Aucun client trouvé. Cliquez sur '+' pour en ajouter un.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <ClientList
                                clients={clients}
                                // Pass the whole client object to edit/delete handlers
                                onEdit={openModal} // openModal expects (mode, client)
                                onDelete={handleDeleteClient} // Pass the handler directly
                            />
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Floating Action Button using MUI Fab */}
            <Fab
                color="secondary"
                aria-label="ajouter client"
                onClick={() => openModal('add')} // Open modal in 'add' mode
                sx={{
                    position: 'fixed',
                    bottom: (theme) => theme.spacing(3),
                    right: (theme) => theme.spacing(3),
                }}
            >
                <AddIcon />
            </Fab>

            {/* Modal using MUI Modal */}
            <Modal
                open={isModalOpen}
                onClose={closeModal} // Close when clicking backdrop
                aria-labelledby="client-modal-title"
            >
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography id="client-modal-title" variant="h6" component="h2" color="primary">
                            {modalMode === 'edit' ? 'Modifier le Client' : 'Ajouter un Client'}
                        </Typography>
                        <IconButton onClick={closeModal} aria-label="fermer">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {/* Render the MUI-based ClientForm */}
                    <ClientForm
                        formData={formData} // Pass current form data
                        onChange={handleFormChange} // Pass change handler
                        onSubmit={handleFormSubmit} // Pass submit handler
                        onCancel={closeModal} // Pass cancel handler
                        mode={modalMode}
                        // Pass error state to form if needed for display
                        formError={error} // Pass general error (could be specific submit error)
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default ClientsPageIndex;

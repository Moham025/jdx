import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns'; // For formatting dates

function TransactionList({ transactions, onDelete, onEdit }) {
  console.log("TransactionList: Rendering start"); // ADD LOG
  console.log("TransactionList: transactions prop:", transactions); // Log transactions prop

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    // Assuming timestamp is a Firestore Timestamp object
    try {
      return format(timestamp.toDate(), 'dd/MM/yyyy'); // Format as DD/MM/YYYY
    } catch (error) {
      console.error("Error formatting date:", error);
      // Fallback if it's already a string or different format
      return timestamp.toString();
    }
  };

  return (
    <TableContainer component={Paper}>
      {console.log("TransactionList: Table rendering start")}
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID Transaction</TableCell>
            <TableCell>Désignation Projet</TableCell>
            <TableCell>Date de Transaction</TableCell>
            <TableCell align="right">Montant (FCFA)</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {console.log("TransactionList: TableBody rendering start")}
          {transactions.length === 0 ? (
            <>
              {console.log("TransactionList: No transactions message rendering")}
              <TableRow>
                <TableCell colSpan={5} align="center">Aucune transaction trouvée.</TableCell>
              </TableRow>
            </>
          ) : (
            <>
              {console.log("TransactionList: Row mapping start")}
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.id} // Use Firestore document ID as key
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {transaction.transactionId || transaction.id} {/* Display generated ID */}
                  </TableCell>
                  <TableCell>{transaction.projectName || 'Projet inconnu'}</TableCell>
                  <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                  <TableCell align="right">{transaction.amount?.toLocaleString('fr-FR') || 'N/A'}</TableCell> {/* Format amount */}
                  <TableCell align="center">
                    <Tooltip title="Supprimer">
                      <IconButton onClick={() => onDelete(transaction.id)} color="error" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton onClick={() => onEdit(transaction)} color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {console.log("TransactionList: Row mapping end")}
            </>
          )}
          {console.log("TransactionList: TableBody rendering end")}
        </TableBody>
      </Table>
      {console.log("TransactionList: Table rendering end")}
    </TableContainer>
  );
}

export default TransactionList;

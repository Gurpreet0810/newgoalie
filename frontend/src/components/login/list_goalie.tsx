import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Typography, Container, Paper, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material'; // Import Material UI icons
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'
// Define the user interface based on the structure of your data
interface User {
  _id: string;
  userName: string;
  phoneNumber: string;
  email: string;
  photo: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

function ListGoalie() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [deleteId, setDeleteId] = useState<string | null>(null); // For delete confirmation
  const [dialogOpen, setDialogOpen] = useState(false); // State to control the delete confirmation dialog

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('http://localhost:4500/api/v1/goalies');
        setUsers(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`http://localhost:4500/api/v1/deleteGoalies/${deleteId}`);
      setUsers(users.filter(user => user._id !== deleteId));
      toast.success('Goalie deleted successfully', { autoClose: 1000 });
      setDialogOpen(false); // Close the confirmation dialog after deletion
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleClickDelete = (id: string) => {
    setDeleteId(id); // Store the goalie ID to delete
    setDialogOpen(true); // Open the confirmation dialog
  };

  const columns: GridColDef[] = [
    { 
      field: 'srNo', 
      headerName: 'Sr. No.', 
      width: 100 
    },
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'userName', headerName: 'Name', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { 
      field: 'photo', 
      headerName: 'Logo', 
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <img 
          src={`http://localhost:4500/storage/productImages/${params.value}`} 
          alt="Goalie Photo" 
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        />
      ),
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      sortable: false, 
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            component={Link}
            to={`/goalies/edit/${params.row._id}`}
            aria-label="edit"
            style={{ marginRight: 8 }}
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleClickDelete(params.row._id)} // Trigger delete confirmation dialog
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">Error: {error}</Typography>;

  const rows = users.map((user, index) => ({
    ...user,
    id: user._id,
    srNo: index + 1,
  }));

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Container maxWidth={false} sx={{ marginTop: '120px' }}>
      <Paper sx={{ height: 400, width: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ padding: '15px', background: '#00617a', color: '#fff' }}>
          {t('goalies')}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
          <DialogTitle>{"Delete Goalie"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="success">
          Goalie deleted successfully
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ListGoalie;

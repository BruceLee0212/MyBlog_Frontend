import React, { useState, useEffect }from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MngToolBar from "./MngToolBar";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import { format } from 'date-fns';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useSession } from '../SessionContext';
import Snackbar from '@mui/material/Snackbar';

export default function TagMng() {
  // get session data from sessionContext
  const sessionData = useSession();
  // intialize rows in table 
  const [rows, setRows] = useState([]);
  // order config
  const [orderBy, setOrderBy] = useState('createTime');
  const [order, setOrder] = useState('desc');
  // sort func
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
    setCurrentPage(1);
  };
  // search results
  const [filteredRows, setFilteredRows] = useState(rows);
  // search field for tag
  const searchFieldOptions = [
    { label: 'Name', value: 'tagName'},
    { label: 'Date', value: 'createTime' },
  ];
  // pagination config
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // page change for pagination
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  // handle select rows
  const [selectedRows, setSelectedRows] = useState([]);
  // select func
  const toggleRowSelection = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((tagId) => tagId !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };
  // select/non-select all rows 
  const toggleAllRows = () => {
    if (selectedRows.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((row) => row.tagId));
    }
  };
  // dialog for add new tag
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // textfield in add new tag dialog
  const [tagName, setTagName] = useState('');
  const handleNameChange = (event) => {
    setTagName(event.target.value);
  };
  // alert and message for add new tag func
  const [message, setMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(true);
  const [snackColor, setSnackColor] = useState("success");
  const handleSnackClose = () => {
    setSnackOpen(false);
  }
  // add new tag
  const handleAdd = async (event) => {
    const formData = new FormData();
    const date = new Date();
    formData.append("tagOwner", sessionData.user);
    formData.append("tagName", tagName);
    formData.append("createTime", date)

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}tags/save`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
            if(response.data.hasOwnProperty('tagOwnerError')) {
              setMessage(response.data.tagOwnerError);
            }
            else if(response.data.hasOwnProperty('tagNameError')) {
              setMessage(response.data.tagNameError);
            }
            setSnackColor("error");
            setSnackOpen(true);
        } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
          setMessage('The tag has been successfully added');
          setSnackColor("success");
          setSnackOpen(true);
          setOpen(false);
          refreshData();
        }
      }
    } catch (error) {
      console.error('add error:', error);
    }
    setTagName('');
  };
  // delete func
  const [conflictTagList, setConflictTagList] = useState();
  const [conflictTagDialogOpen, setConflictTagDialogOpen] = useState(false);
  const handleConflictTagDialogClose = () => {
    setConflictTagDialogOpen(false);
  }
  const handleDelete = async (event) => {
    if(selectedRows.length === 0){
      setMessage("Select at least 1 row");
      setSnackColor("error");
      setSnackOpen(true);
      return;
    }
    const formData = new FormData();
    selectedRows.forEach((id, index) => {
      formData.append('ids', id);
    });
    formData.append("tagOwner", sessionData.user);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}tags/delete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
            if(response.data.hasOwnProperty('errorMsg')) {
              setMessage(response.data.errorMsg);
            }
            if(response.data.hasOwnProperty('tags')) {
              setConflictTagList(response.data.tags);
              setConflictTagDialogOpen(true);
            }
            setSnackColor("error");
            setSnackOpen(true);
        } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
          setMessage('Tags have been deleted successfully');
          setSnackColor("success");
          setSnackOpen(true);
          refreshData();
        }
      }
    } catch (error) {
      console.error('add error:', error);
    }
    setSelectedRows([]);
  };
  // get all tags from database
  const refreshData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}tags`, {
        params: {
          tagOwner: sessionData.user
        }
      });
      if (response.status === 200) {
        const formattedData = response.data.map(item => ({
          ...item,
          createTime: new Date(item.createTime)
        }));
        setRows(formattedData) 
      }
    } catch (error) {
      console.error('refresh data error:', error);
    }
  };

  useEffect(() => {
    setFilteredRows(rows)
  }, [rows])

  useEffect(() => {
    // eslint-disable-next-line
    let isMounted = true;
    refreshData();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  return(
    <Box>
      <Typography variant="h6" component="div">
          Tag Management
      </Typography>
      <Divider sx={{ my: 1 }} />
      <MngToolBar 
        rows={rows} 
        selectedRows={selectedRows} 
        setFilteredRows={setFilteredRows}
        searchFieldOptions={searchFieldOptions}
        onNewButtonClick={handleClickOpen}
        onDeleteButtonClick={handleDelete}
        showUpdateButton={false}
      />
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ padding: 'none', width: '10%' }}>
              <Checkbox
                indeterminate={
                  selectedRows.length > 0 && selectedRows.length < rows.length
                }
                checked={selectedRows.length === rows.length}
                onChange={toggleAllRows}
              />
            </TableCell>
            <TableCell align="left" style={{ width: '30%', fontWeight: 'bold' }} sx={{ fontSize: '16px' }}>Tag</TableCell>
            <TableCell 
              align="left"
              onClick={() => handleSort('createTime')}
              style={{ cursor: 'pointer' , width: '30%', fontWeight: 'bold' }}
              sx={{ fontSize: '16px' }}
            >
              Creation Date
              <SwapVertIcon style={{ verticalAlign: 'middle' }} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows
            .slice()
            .sort((a, b) => {
              if (order === 'asc') {
                return a[orderBy] - b[orderBy];
              } else {
                return b[orderBy] - a[orderBy];
              }
            })
            .slice(startIndex, endIndex)
            .map((row) => (
            <TableRow key={row.tagId}>
              <TableCell>
                <Checkbox
                  checked={selectedRows.includes(row.tagId)}
                  onChange={() => toggleRowSelection(row.tagId)}
                />
              </TableCell>
              <TableCell sx={{ fontSize: '16px' }}>{row.tagName}</TableCell>
              <TableCell sx={{ fontSize: '16px' }}>{format(new Date(row.createTime), 'MMM dd, yyyy')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
    <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
    </Box>
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth
    >
      <DialogTitle color={"white"} sx={{fontSize : "30px", backgroundColor: "#3277d5", height: "5%"}}>New Tag</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="new_tag"
          label="Tag Name"
          fullWidth
          variant="standard"
          onChange={handleNameChange} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd}>Submit</Button>
      </DialogActions>
    </Dialog>
    {message && <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={2000}
        open={snackOpen}
        onClose={handleSnackClose}
      >
        <Alert severity={snackColor}>{message}</Alert>
      </Snackbar>}
      {conflictTagList && <Dialog
        open={conflictTagDialogOpen} 
        onClose={handleConflictTagDialogClose} 
        fullWidth>
          <DialogTitle color={"white"} sx={{fontSize : "30px", backgroundColor: "#3277d5", height: "5%"}}>Following tags have been used</DialogTitle>
          <DialogContent>
            {conflictTagList.map((tag) => (
              <Typography key={tag.tagId} variant="h6" sx={{margin: '10px'}}>{tag.tagName}</Typography>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConflictTagDialogClose}>Confirm</Button>
          </DialogActions>
      </Dialog>}
  </Box>
  );
}
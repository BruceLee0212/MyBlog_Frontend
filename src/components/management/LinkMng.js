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
import { useSession } from '../SessionContext';
import axios from 'axios'
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';

export default function LinkMng() {
  // get session data from sessionContext
  const sessionData = useSession();
  // intialize rows in table 
  const [rows, setRows] = useState([]);
  // order config
  const [orderBy, setOrderBy] = useState('creation_date');
  const [order, setOrder] = useState('desc');
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
    setCurrentPage(1);
  };
  // pagination config
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredRows, setFilteredRows] = useState(rows);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  // search field for link
  const searchFieldOptions = [
    { label: 'Name', value: 'linkName' },
    { label: 'Link', value: 'linkUrl' },
    { label: 'Description', value: 'linkDescription' },
    { label: 'Date', value: 'createTime' },
  ];
  // type for link
  const linkType = [
    { label: 'Friendly Link', value: 0 },
    { label: ' Recommended Link', value: 1 },
    { label: 'Personal Website', value: 2 },
  ];
  //handle select rows
  const [selectedRows, setSelectedRows] = useState([]);
  //select func
  const toggleRowSelection = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((LinkId) => LinkId !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };
  //select/non-select all rows
  const toggleAllRows = () => {
    if (selectedRows.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((row) => row.linkId));
    }
  };
  // dialog for add new link
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setMessage("");
    setNewLinkOwnerError("");
    setNewLinkTypeError("");
    setNewLinkRankError("");
    setNewLinkNameError("");
    setNewLinkUrlError("");
    setLinkDescriptionError("");
    setLinkDatabaseError("");
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // set default values for updating
  const selectedLink = filteredRows.find((row) => row.linkId === selectedRows[0]);
  const setDefaultUpdateValues = (event) => {
    setUpdateLinkId(selectedLink.linkId);
    setUpdateLinkName(selectedLink.linkName);
    setUpdateLinkType(selectedLink.linkType);
    setUpdateLinkUrl(selectedLink.linkUrl);
    setUpdateLinkDescription(selectedLink.linkDescription);
    setUpdateLinkRank(selectedLink.linkRank);
  }
  // dialog for update link
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const handleUpdateDialogOpen = () => {
    setDefaultUpdateValues();
    setMessage("");
    setUpdateLinkOwnerError("");
    setUpdateLinkTypeError("");
    setUpdateLinkRankError("");
    setUpdateLinkNameError("");
    setUpdateLinkUrlError("");
    setUpdateLinkDescriptionError("");
    setUpdateLinkDatabaseError("");
    setUpdateDialogOpen(true);
  };
  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
  };
  // get all links from database
  const refreshData = async () => {
    console.log("link refresh")
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}links`, {
        params: {
          linkOwner: sessionData.user
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
    // eslint-disable-next-line
    let isMounted = true;
    refreshData();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);
  // textfield in add new link dialog
  const [newLinkName, setNewLinkName] = useState('');
  const handleNewNameChange = (event) => {
    setNewLinkName(event.target.value);
  };
  const [newLinkType, setNewLinkType] = useState('');
  const handleNewTypeChange = (event) => {
    setNewLinkType(event.target.value);
  };
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const handleNewUrlChange = (event) => {
    setNewLinkUrl(event.target.value);
  };
  const [newLinkDescription, setNewLinkDescription] = useState('');
  const handleNewDescriptionChange = (event) => {
    setNewLinkDescription(event.target.value);
  };
  const [newLinkRank, setNewLinkRank] = useState('');
  const handleNewRankChange = (event) => {
    setNewLinkRank(event.target.value);
  };
  // alert and message for add new link func
  const [message, setMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(true);
  const [snackColor, setSnackColor] = useState("success")
  const [newLinkOwnerError, setNewLinkOwnerError] = useState("");
  const [newLinkTypeError, setNewLinkTypeError] = useState("");
  const [newLinkRankError, setNewLinkRankError] = useState("");
  const [newLinkNameError, setNewLinkNameError] = useState("");
  const [newLinkUrlError, setNewLinkUrlError] = useState("");
  const [newLinkDescriptionError, setLinkDescriptionError] = useState("");
  const [newLinkDatabaseError, setLinkDatabaseError] = useState("");
  const handleSnackClose = () => {
    setSnackOpen(false);
  }
  //clear input field in time
  const clearNewInputField = (event) => {
    setNewLinkName("");
    setNewLinkType("");
    setNewLinkUrl("");
    setNewLinkRank("");
    setNewLinkUrl("");
    setNewLinkDescription("");
  };
  // add new link
  const handleAdd = async (event) => {
    const formData = new FormData();
    const date = new Date();
    formData.append("linkOwner", sessionData.user);
    formData.append("linkName", newLinkName);
    formData.append("linkType", newLinkType);
    formData.append("linkUrl", newLinkUrl);
    formData.append("linkDescription", newLinkDescription);
    formData.append("linkRank", newLinkRank);
    formData.append("createTime", date)
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}links/save`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
          setMessage("Add link failed")
          setSnackColor("error");
          setSnackOpen(true);
          if(response.data.hasOwnProperty('linkOwnerError')) {
            setNewLinkOwnerError(response.data.linkOwnerError);
          }
          if(response.data.hasOwnProperty('linkTypeError')) {
            setNewLinkTypeError(response.data.linkTypeError);
          }
          if(response.data.hasOwnProperty('linkRankError')) {
            setNewLinkRankError(response.data.linkRankError);
          }
          if(response.data.hasOwnProperty('linkNameError')) {
            setNewLinkNameError(response.data.linkNameError);
          }
          if(response.data.hasOwnProperty('linkUrlError')) {
            setNewLinkUrlError(response.data.linkUrlError);
          }
          if(response.data.hasOwnProperty('linkDescriptionError')) {
            setLinkDescriptionError(response.data.linkDescriptionError);
          }
          if(response.data.hasOwnProperty('linkDatabaseError')) {
            setLinkDatabaseError(response.data.linkDatabaseError);
          }    
        } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
          setMessage('The link has been added successfully');
          setSnackColor("success");
          setSnackOpen(true);
          refreshData();
        }
      }
    } catch (error) {
      console.error('add error:', error);
    }
    clearNewInputField();
  }; 
  // textfield in update link dialog
  const [updateLinkId, setUpdateLinkId] = useState('');
  const [updateLinkName, setUpdateLinkName] = useState('');
  const handleUpdateNameChange = (event) => {
    setUpdateLinkName(event.target.value);
  };
  const [updateLinkType, setUpdateLinkType] = useState('');
  const handleUpdateTypeChange = (event) => {
    setUpdateLinkType(event.target.value);
  };
  const [updateLinkUrl, setUpdateLinkUrl] = useState('');
  const handleUpdateUrlChange = (event) => {
    setUpdateLinkUrl(event.target.value);
  };
  const [updateLinkDescription, setUpdateLinkDescription] = useState('');
  const handleUpdateDescriptionChange = (event) => {
    setUpdateLinkDescription(event.target.value);
  };
  const [updateLinkRank, setUpdateLinkRank] = useState('');
  const handleUpdateRankChange = (event) => {
    setUpdateLinkRank(event.target.value);
  };
  // alert and message for update link func
  const [updateLinkOwnerError, setUpdateLinkOwnerError] = useState("");
  const [updateLinkTypeError, setUpdateLinkTypeError] = useState("");
  const [updateLinkRankError, setUpdateLinkRankError] = useState("");
  const [updateLinkNameError, setUpdateLinkNameError] = useState("");
  const [updateLinkUrlError, setUpdateLinkUrlError] = useState("");
  const [updateLinkDescriptionError, setUpdateLinkDescriptionError] = useState("");
  const [updateLinkDatabaseError, setUpdateLinkDatabaseError] = useState("");
  // update link
  const handleUpdate = async (event) => {
    const formData = new FormData();
    formData.append("linkId", updateLinkId);
    formData.append("linkOwner", sessionData.user);
    formData.append("linkName", updateLinkName);
    formData.append("linkType", updateLinkType);
    formData.append("linkUrl", updateLinkUrl);
    formData.append("linkDescription", updateLinkDescription);
    formData.append("linkRank", updateLinkRank);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}links/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
          setMessage("Update link failed");
          setSnackColor("error");
          setSnackOpen(true);
          if(response.data.hasOwnProperty('linkOwnerError')) {
            setUpdateLinkOwnerError(response.data.linkOwnerError);
          }
          if(response.data.hasOwnProperty('linkTypeError')) {
            setUpdateLinkTypeError(response.data.linkTypeError);
          }
          if(response.data.hasOwnProperty('linkRankError')) {
            setUpdateLinkRankError(response.data.linkRankError);
          }
          if(response.data.hasOwnProperty('linkNameError')) {
            setUpdateLinkNameError(response.data.linkNameError);
          }
          if(response.data.hasOwnProperty('linkUrlError')) {
            setUpdateLinkUrlError(response.data.linkUrlError);
          }
          if(response.data.hasOwnProperty('linkDescriptionError')) {
            setUpdateLinkDescriptionError(response.data.linkDescriptionError);
          }
          if(response.data.hasOwnProperty('linkDatabaseError')) {
            setUpdateLinkDatabaseError(response.data.linkDatabaseError);
          }    
        } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
          setMessage('The link has been updated');
          setSnackColor("success");
          setSnackOpen(true);
          refreshData();
        }
      }
    } catch (error) {
      console.error('update error:', error);
    }
  }; 
  // delete func
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
    formData.append("linkOwner", sessionData.user);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}links/delete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
            if(response.data.hasOwnProperty('errorMsg')) {
              setMessage(response.data.errorMsg);
              setSnackColor("error");
              setSnackOpen(true);
            }
        } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
          setMessage('Links have been deleted successfully');
          setSnackColor("success")
          setSnackOpen(true);
          refreshData();
        }
      }
    } catch (error) {
      console.error('delete error:', error);
    }
    setSelectedRows([]);
  };
  useEffect(() => {
    setFilteredRows(rows)
  }, [rows])

  return(
    <Box>
      <Typography variant="h6" component="div">
          Link Management
      </Typography>
      <Divider sx={{ my: 1 }} />
      <MngToolBar 
        rows={rows} 
        selectedRows={selectedRows} 
        setFilteredRows={setFilteredRows}
        searchFieldOptions={searchFieldOptions}
        onNewButtonClick={handleClickOpen}
        onUpdateButtonClick={handleUpdateDialogOpen}
        onDeleteButtonClick={handleDelete}
        showUpdateButton={true}
      />
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ padding: '0px'}}>
                <Checkbox
                  indeterminate={
                    selectedRows.length > 0 && selectedRows.length < rows.length
                  }
                  checked={selectedRows.length === rows.length}
                  onChange={toggleAllRows}
                />
              </TableCell>
              <TableCell style={{ padding: '6px'}} align="left" sx={{ fontSize: '16px', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ padding: '6px'}} align="left" sx={{ fontSize: '16px', fontWeight: 'bold' }}>Link</TableCell>
              <TableCell style={{ padding: '6px'}} align="left" sx={{ fontSize: '16px', fontWeight: 'bold' }}>Description </TableCell>
              <TableCell style={{ padding: '6px'}} align="left" sx={{ fontSize: '16px', fontWeight: 'bold' }}>Order </TableCell>
              <TableCell 
                align="left"
                onClick={() => handleSort('createDate')}
                style={{ padding: '6px', cursor: 'pointer', fontWeight: 'bold' }}
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
                <TableRow key={row.linkId}>
                  <TableCell style={{ padding: '0px'}} sx={{ maxWidth: '1px' }}>
                    <Checkbox
                      checked={selectedRows.includes(row.linkId)}
                      onChange={() => toggleRowSelection(row.linkId)}
                    />
                  </TableCell>
                  <TableCell style={{ padding: '6px'}} sx={{ maxWidth: '150px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.linkName}</TableCell>
                  <TableCell style={{ padding: '6px'}} sx={{ maxWidth: '110px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><Tooltip title={<span>{row.linkUrl}</span>}><span>{row.linkUrl}</span></Tooltip></TableCell>
                  <TableCell style={{ padding: '6px'}} sx={{ maxWidth: '110px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><Tooltip title={<span>{row.linkDescription}</span>}><span>{row.linkDescription}</span></Tooltip></TableCell>
                  <TableCell style={{ padding: '6px'}} sx={{ maxWidth: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} align='center'>{row.linkRank}</TableCell>
                  <TableCell style={{ padding: '6px'}} sx={{ maxWidth: '20px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{format(new Date(row.createTime), 'MMM dd, yyyy')}</TableCell>
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
      PaperProps={{
        sx: {
          width: "60%",
        }
      }}
    >
      <DialogTitle color={"white"} height={"15%"} sx={{fontSize : "30px", backgroundColor: "#3277d5"}}>New Link</DialogTitle>
      <DialogContent>
        {newLinkOwnerError && <p className="error-message-inline">{newLinkOwnerError}</p>}
        <TextField
          autoFocus
          margin="dense"
          id="link_name"
          label="Name"
          fullWidth
          variant="standard"
          onChange={handleNewNameChange}
        />
        {newLinkNameError && <p className="error-message-inline">{newLinkNameError}</p>}
        <TextField
          select
          label="Link Type"
          value={newLinkType}
          onChange={handleNewTypeChange}
          variant="outlined"
          size="small"
          fullWidth
          sx={{marginTop: '20px' }}
        >
          {linkType.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {newLinkTypeError && <p className="error-message-inline">{newLinkTypeError}</p>}
        <TextField
          autoFocus
          margin="dense"
          id="link_url"
          label="URL"
          fullWidth
          variant="standard"
          onChange={handleNewUrlChange}
        />
        {newLinkUrlError && <p className="error-message-inline">{newLinkUrlError}</p>}
        <TextField
          autoFocus
          margin="dense"
          id="link_description"
          label="Description"
          fullWidth
          variant="standard"
          onChange={handleNewDescriptionChange}
        />
        {newLinkDescriptionError && <p className="error-message-inline">{newLinkDescriptionError}</p>}
        <TextField
          autoFocus
          margin="dense"
          id="link_order"
          label="Order"
          fullWidth
          variant="standard"
          onChange={handleNewRankChange}
        />
        {newLinkRankError && <p className="error-message-inline">{newLinkRankError}</p>}
        {newLinkDatabaseError && <p className="error-message-inline">{newLinkDatabaseError}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd}>Submit</Button>
      </DialogActions>
    </Dialog>
    <Dialog 
      open={updateDialogOpen} 
      onClose={handleUpdateDialogClose}
      PaperProps={{
        sx: {
          width: "60%",
        }
      }}
    >
      <DialogTitle color={"white"} height={"15%"} sx={{fontSize : "30px", backgroundColor: "#3277d5"}}>Update Link</DialogTitle>
      <DialogContent>
        {updateLinkOwnerError && <p className="error-message-inline">{updateLinkOwnerError}</p>}
        <TextField
          autoFocus
          margin="dense"
          id="update_link_name"
          label="Name"
          fullWidth
          variant="standard"
          onChange={handleUpdateNameChange}
          defaultValue={filteredRows.find((row) => row.linkId === selectedRows[0])?.linkName || ''}
        />
        {updateLinkNameError && <p className="error-message-inline">{updateLinkNameError}</p>}
        <TextField
          select
          label="Link Type"
          defaultValue={filteredRows.find((row) => row.linkId === selectedRows[0])?.linkType || ''}
          onChange={handleUpdateTypeChange}
          variant="outlined"
          size="small"
          fullWidth
          sx={{marginTop: '20px' }}
        >
          {linkType.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {updateLinkTypeError && <p className="error-message-inline">{updateLinkTypeError}</p>}
        <TextField
          autoFocus
          margin="dense"
          id="update_link_url"
          label="URL"
          fullWidth
          variant="standard"
          onChange={handleUpdateUrlChange}
          defaultValue={filteredRows.find((row) => row.linkId === selectedRows[0])?.linkUrl || ''}
        />
        {updateLinkUrlError && <p className="error-message-inline">{updateLinkUrlError}</p>}
        <TextField
          autoFocus
          margin="dense"
          id="update_link_description"
          label="Description"
          fullWidth
          variant="standard"
          onChange={handleUpdateDescriptionChange}
          defaultValue={filteredRows.find((row) => row.linkId === selectedRows[0])?.linkDescription || ''}
        />
        {updateLinkDescriptionError && <p className="error-message-inline">{updateLinkDescriptionError}</p>}
        <TextField
          autoFocus
          margin="dense"
          id="update_link_order"
          label="Order"
          fullWidth
          variant="standard"
          onChange={handleUpdateRankChange}
          defaultValue={filteredRows.find((row) => row.linkId === selectedRows[0])?.linkRank || ''}
        />
        {updateLinkRankError && <p className="error-message-inline">{updateLinkRankError}</p>}
        {updateLinkDatabaseError && <p className="error-message-inline">{updateLinkDatabaseError}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUpdateDialogClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Submit</Button>
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
  </Box>
  );
}
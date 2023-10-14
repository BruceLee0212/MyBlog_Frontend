import React, { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { format } from 'date-fns';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useSession } from '../SessionContext';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';

export default function CommentMng() {
  // get session data from sessionContext
  const sessionData = useSession();
  const isMountedRef = useRef(true);
  // intialize rows in table 
  const [rows, setRows] = useState([]);
  const [blogTitleList, setBlogTitleList] = useState();
  // get all data from database
  const refreshData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}comments`, {
        params: {
          commentOwner: sessionData.user
        }
      });
      console.log(response);
      if (isMountedRef.current && response.status === 200) {
        setRows(response.data.blogCommentList);
        setBlogTitleList(response.data.blogTitleList);
      }
    } catch (error) {
      console.error('refresh data error:', error);
    }
  };
  useEffect(() => {
    isMountedRef.current = true;
    refreshData();
    window.scrollTo(0, 0);
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line
  }, []);
  // order config
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  // sort func
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
    setCurrentPage(1);
  };
  // search field for comment
  const searchFieldOptions = [
    { label: 'Name', value: 'commentator' },
    { label: 'Email', value: 'email' },
    { label: 'Status', value: 'commentStatus' },
    { label: 'Date', value: 'commentCreateTime' },
  ];
  // search settings
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchField, setSearchField] = useState(searchFieldOptions[0].value); 
  useEffect(() => {
    setFilteredRows(rows);
  },[rows])
  // search func
  const handleSearch = () => {
    const filteredRows = rows.filter((row) => {
      if(searchField === "commentStatus"){
        let searchFieldValue;
        if(row[searchField] === 0) searchFieldValue = "Unapproved"
        else searchFieldValue = "Approved"
        return searchFieldValue.toString().toLowerCase().includes(searchKeyword.toLowerCase());
      }
      else{
        const searchFieldValue = row[searchField];
        return searchFieldValue.toString().toLowerCase().includes(searchKeyword.toLowerCase());
      }
    });
    setFilteredRows(filteredRows);
  };
  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchKeyword('');
  };
  // search when keyword or search field change
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, searchField]);
  // pagination config
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  // handle select rows
  const [selectedRows, setSelectedRows] = useState([]);
  // select func
  const toggleRowSelection = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((commentId) => commentId !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };
  // select/non-select all rows
  const toggleAllRows = () => {
    if (selectedRows.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((row) => row.commentId));
    }
  };
  // reply dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState();
  const [selectedBlogId, setSelectedBlogId] = useState();
  const [isApproved, setIsApproved] = useState(0);
  const handleReplyDialogOpen = (content, commentId, blogId, approved) => {
    setSelectedContent(content);
    setSelectedCommentId(commentId);
    setSelectedBlogId(blogId);
    setIsApproved(approved)
    setDialogOpen(true);
  };
  const handleReplyDialogClose = () => {
    setDialogOpen(false);
  };
  // snack bar for reponse
  const [message, setMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(true);
  const [snackColor, setSnackColor] = useState("success");
  const handleSnackClose = () => {
    setSnackOpen(false);
  }
  // batch approve func
  const handleBatchApprove =  async() => {
    const formData = new FormData();
    formData.append("commentOwner", sessionData.user);
    selectedRows.forEach((id, index) => {
      formData.append('ids', id);
    });
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}comments/batch-approve`, formData, {
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
          setMessage('Commentss have been approved successfully');
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
  // batch delete func
  const handleBatchDelete = async() => {
    const formData = new FormData();
    formData.append("commentOwner", sessionData.user);
    selectedRows.forEach((id, index) => {
      formData.append('ids', id);
    });
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}comments/batch-delete`, formData, {
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
          setMessage('Commentss have been deleted successfully');
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
  // reply func
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  }
  const handleConfirm = () => {
    handleReplyComment();
    setConfirmDialogOpen(false);
  }
  const[replyBody, setReplyBody] = useState('');
  const handleReplyBodyChange = (event) =>{
    setReplyBody(event.target.value);
  }
  const handleReplyComment = async() => {
    const formData = new FormData();
    formData.append("commentOwner", sessionData.user);
    formData.append("replyBody", replyBody);
    formData.append("commentId", selectedCommentId)
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}comments/reply`, formData, {
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
          setMessage('Reply successfully');
          setSnackColor("success")
          setSnackOpen(true);
          refreshData();
          handleReplyDialogClose();
        }
      }
    } catch (error) {
      console.error('delete error:', error);
    }
    setSelectedRows([]);
  };
  const handleReplyCommentSubmit = () => {
    if(isApproved === 0){
      setConfirmDialogOpen(true);
    }
  }
  return(
    <Box>
    <Typography variant="h6" component="div">
        Comment Management
    </Typography>
    <Divider sx={{ my: 1 }} />
    <div>
      <Grid container>
        <Grid item>
          <Button 
            variant="contained" 
            startIcon={<DoneAllIcon />} 
            size="medium" 
            color="success"
            onClick={handleBatchApprove} 
            sx={{ width: '180px', margin : '10px'}}
          >
            Batch Approve
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            startIcon={<DeleteIcon />} 
            size="medium" 
            color="error" 
            onClick={handleBatchDelete}
            sx={{ width: '180px', margin : '10px'}}
          >
            Batch Delete
          </Button>
        </Grid>
        <Grid item>
          <TextField
            select
            label="Search Field"
            value={searchField}
            onChange={handleSearchFieldChange}
            variant="outlined"
            size="small"
            sx={{ width: '200px', margin: '10px' }}
          >
            {searchFieldOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            label="key words"
            variant="outlined"
            size="small"
            sx={{ width: '220px', margin: '10px' }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </Grid>
      </Grid>
    </div>
    <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ padding: '0px' }}>
                <Checkbox
                  indeterminate={
                    selectedRows.length > 0 && selectedRows.length < rows.length
                  }
                  checked={selectedRows.length === rows.length}
                  onChange={toggleAllRows}
                />
              </TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }} sx={{ fontSize: '16px' }}>Content</TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }}  sx={{ fontSize: '16px' }}>Name</TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }} sx={{ fontSize: '16px' }}>Email</TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }} sx={{ fontSize: '16px' }}>Status</TableCell>
              <TableCell 
                align="left"
                onClick={() => handleSort('date')}
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                sx={{ fontSize: '16px' }}
              >
                Date
                <SwapVertIcon style={{ verticalAlign: 'middle' }} />
              </TableCell>
              <TableCell style={{ width: '10%' }}></TableCell>
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
              <TableRow key={row.commentId}>
                <TableCell style={{ padding: '0px'}} sx={{ maxWidth: '1px' }}>
                  <Checkbox
                    checked={selectedRows.includes(row.commentId)}
                    onChange={() => toggleRowSelection(row.commentId)}
                  />
                </TableCell>
                <TableCell style={{ padding: '6px'}} sx={{ maxWidth: '150px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><Tooltip title={<span>{row.commentBody}</span>}><span>{row.commentBody}</span></Tooltip></TableCell>
                <TableCell style={{ padding: '6px'}} sx={{ fontSize: '16px' }}>{row.commentator}</TableCell>
                <TableCell style={{ padding: '6px'}} sx={{ fontSize: '16px' }}>{row.email}</TableCell>
                <TableCell style={{ padding: '6px'}} sx={{ fontSize: '16px' }}>
                  {row.commentStatus === 1 ? 'Approved' : 'Unapproved'}
                </TableCell>
                <TableCell sx={{ fontSize: '16px' }}>{format(new Date(row.commentCreateTime), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Button variant="contained" startIcon={<ReplyIcon />}  onClick={() => handleReplyDialogOpen(row.commentBody, row.commentId, row.blogId, row.commentStatus)} size="medium" color="info" sx={{ width: '100px', margin : '10px'}}>
                    Reply
                  </Button>
                </TableCell>
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
      <Dialog open={dialogOpen} onClose={handleReplyDialogClose}>
        <DialogTitle>Reply</DialogTitle>
        <DialogContent>
          {blogTitleList && <DialogContentText>
            <span style={{color: 'black'}}>{selectedContent}</span>
            <br />
            <br />
            <span>from</span>
            <br />
            <span style={{color: 'black', fontStyle: 'italic'}}>{blogTitleList[selectedBlogId]}</span>
          </DialogContentText>}
          <TextField
            autoFocus
            margin="dense"
            id="reply"
            label="Reply"
            fullWidth
            variant="standard"
            value={replyBody}
            onChange={handleReplyBodyChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReplyDialogClose}>Cancel</Button>
          <Button onClick={handleReplyCommentSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          This comment will be approved after you reply to it
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Submit</Button>
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
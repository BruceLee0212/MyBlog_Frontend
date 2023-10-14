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
import { useSession } from '../SessionContext';
import axios from 'axios';
import { Snackbar } from "@mui/material";
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

export default function BlogMng({setSelectedSidebarItem, setSelectedContentItem, setSelectedBlog}){
  // get session data from sessionContext
  const sessionData = useSession();
  // intialize rows in table 
  const [rows, setRows] = useState([]);
  // get all blogs from database
  const refreshData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}blogs`, {
        params: {
          blogOwner: sessionData.user
        }
      });
      if (response.status === 200) {
        setRows(response.data.blogList);
        setFilteredRows(response.data.blogList);
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
  // order config
  const [orderBy, setOrderBy] = useState('updateTime');
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
  // search field for blog
  const searchFieldOptions = [
    { label: 'Title', value: 'blogTitle' },
    { label: 'Status', value: 'blogStatus' },
    { label: 'Category', value: 'blogCategoryName' },
    { label: 'Last Modified', value: 'updateTime' },
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
  //handle select rows
  const [selectedRows, setSelectedRows] = useState([]);
  // set selected blog for update
  useEffect(() => {
    setSelectedBlog(filteredRows.find((row) => row.blogId === selectedRows[0]));
  }, [selectedRows, filteredRows, setSelectedBlog]);  
  //select func
  const toggleRowSelection = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };
  // select/non-select all rows
  const toggleAllRows = () => {
    if (selectedRows.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((row) => row.blogId));
    }
  };
  // page redirect for new blog button
  const handleNewButtonClick = () => {
    setSelectedSidebarItem('NewBlog');
    setSelectedContentItem('NewBlog');
  };
  // page redirect for update blog button
  const handleUpdateButtonClick = () => {
    setSelectedSidebarItem('NewBlog');
    setSelectedContentItem('NewBlog');
  };
  // alert and message for delete func
  const[deleteMsg, setDeleteMsg] = useState('');
  const[deleteAlertColor, setDeleteAlertColor] = useState("info");
  const[deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const handleSnackClose = () => {
    setDeleteAlertOpen(false);
  }
  // delete func
  const handleDelete = async (event) => {
    if(selectedRows.length === 0){
      setDeleteMsg("Select at least 1 row");
      return;
    }
    const formData = new FormData();
    selectedRows.forEach((id) => {
      formData.append('ids', id);
    });
    formData.append("blogOwner", sessionData.user);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}blogs/delete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
            if(response.data.hasOwnProperty('errorMsg')) {
              setDeleteMsg(response.data.errorMsg);
            }
            setDeleteAlertColor("error");
            setDeleteAlertOpen(true);
        } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
          setDeleteMsg('Blogs have been deleted successfully');
          setDeleteAlertColor("success");
          setDeleteAlertOpen(true);
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
            Blog Management
        </Typography>
        <Divider sx={{ my: 1 }} />
        <MngToolBar 
          rows={rows} 
          selectedRows={selectedRows}
          setFilteredRows={setFilteredRows}
          searchFieldOptions={searchFieldOptions}
          onNewButtonClick={handleNewButtonClick}
          onUpdateButtonClick={handleUpdateButtonClick}
          onDeleteButtonClick={handleDelete}
          showUpdateButton={true}
        />
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead className="header-cell">
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
              <TableCell align="left" style={{ padding: '6px'}} sx={{ fontSize: '16px', fontWeight: 'bold' }}>Title</TableCell>
              <TableCell 
                align="left" 
                style={{ padding: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => handleSort('views')}
                sx={{ fontSize: '16px' }}
              >
                Views
                <SwapVertIcon style={{ verticalAlign: 'middle'}} />
              </TableCell>
              <TableCell align="left" style={{ padding: '6px'}} sx={{ fontSize: '16px', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="left" style={{ padding: '6px'}} sx={{ fontSize: '16px', fontWeight: 'bold' }}> Category </TableCell>
              <TableCell 
                align="left"
                onClick={() => handleSort('updateTime')}
                style={{ cursor: 'pointer', padding: '6px', fontWeight: 'bold' }}
                sx={{ fontSize: '16px' }}
              >
                Last Modified
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
              <TableRow key={row.blogId}>
                <TableCell style={{ padding: '0px'}} sx={{ maxWidth: '1px' }}>
                  <Checkbox
                    checked={selectedRows.includes(row.blogId)}
                    onChange={() => toggleRowSelection(row.blogId)}
                  />
                </TableCell>
                <TableCell style={{ padding: '6px'}} sx={{ maxWidth: '200px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><Tooltip title={<span>{row.blogTitle}</span>}><span>{row.blogTitle}</span></Tooltip></TableCell>
                <TableCell style={{ padding: '6px'}} sx={{ maxWidth: '5px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.blogViews}</TableCell>
                <TableCell style={{ padding: '6px'}} sx={{ maxWidth: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {row.blogStatus === 1 ? 'Published' : 'Draft'}
                </TableCell>
                <TableCell style={{ padding: '6px'}} sx={{ maxWidth: '150px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><Tooltip title={<span>{row.blogCategoryName}</span>}><span>{row.blogCategoryName}</span></Tooltip></TableCell>
                <TableCell style={{ padding: '6px'}} sx={{ maxWidth: '150px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{format(new Date(row.updateTime), 'MMM dd, yyyy')}</TableCell>
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
      {deleteMsg && <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={2000}
        open={deleteAlertOpen}
        onClose={handleSnackClose}
      >
        <Alert severity={deleteAlertColor}>{deleteMsg}</Alert>
      </Snackbar>}
    </Box>
    );
}
import React, { useState, useEffect, useRef}from "react";
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { format } from 'date-fns';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { TextField } from "@mui/material";
import { Button } from '@mui/material';
import axios from 'axios';
import { useSession } from '../SessionContext';
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


export default function CategoryMng() {
  // get session data from sessionContext
  const sessionData = useSession();
  // intialize rows in table 
  const [rows, setRows] = useState([]);
  const [defaultIcons, setDefaultIcons] = useState([]);
  const [userIcons, setUserIcons] = useState([]);
  const [camera, setCamera] = useState(); 
  // get all categories and default icons from database
  const refreshData = async () => {
    console.log("category refresh")
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}categories`, {
        params: {
          categoryOwner: sessionData.user
        },
      });
      if (response.status === 200) {
        setRows(response.data.blogCategoryList);
        setFilteredRows(response.data.blogCategoryList);
        setSelectedImage(response.data.defaultIcons[17]);
        setCamera(response.data.defaultIcons[17]);
        setDefaultIcons(response.data.defaultIcons.slice(0, 17));
        setUserIcons(response.data.userIcons);
      }
    } catch (error) {
      if (error) {
        console.error('refresh data error:', error);
      }
    }
  };
  useEffect(() => {
    let isMounted = true;
    refreshData(isMounted);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);
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
  // search field for category
  const searchFieldOptions = [
    { label: 'Name', value: 'categoryName' },
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
      setSelectedRows(selectedRows.filter((categoryId) => categoryId !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };
  // select/non-select all rows 
  const toggleAllRows = () => {
    if (selectedRows.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((row) => row.categoryId));
    }
  };
  // set icon preview
  const [selectedImage, setSelectedImage] = useState();
  const [categoryIcon, setCategoryIcon] = useState('');
  const [isDefault, setIsDefault] = useState(-1);
  // set select image
  const handleImageSelect = (image, index) => {
    setSelectedImage(image);
    setCategoryIcon('');
    setIsDefault(index);
  };
  // upload image from device
  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
      setCategoryIcon(file);
      setIsDefault(-1);
    }
  };
  const fileInputRef = useRef(null);
  //click to upload
  const handleBlankImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // dialog for new category
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    clearNewInputField();
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setMessage("");
    setNewCategoryOwnerError("");
    setNewCategoryNameError("");
    setNewCategoryIconError("");
    setDialogOpen(false);
  };
  // textfield in add new category dialog
  const [newCategoryName, setNewCategoryName] = useState('');
  const handleNewCategoryNameChange = (event) => {
    setNewCategoryName(event.target.value);
  };
  // alert and message for add new category func
  const [message, setMessage] = useState("");
  const [newCategoryOwnerError, setNewCategoryOwnerError] = useState("");
  const [newCategoryNameError, setNewCategoryNameError] = useState("");
  const [newCategoryIconError, setNewCategoryIconError] = useState("");
  const [snackOpen, setSnackOpen] = useState(true);
  const [snackColor, setSnackColor] = useState("success");
  const handleSnackClose = () => {
    setSnackOpen(false);
  }
  //clear input field in time
  const clearNewInputField = (event) => {
    setCategoryIcon("");
    setIsDefault(-1);
    setNewCategoryName("");
    setSelectedImage(camera);
  };
  // add new category
  const handleAdd = async (event) => {
    const formData = new FormData();
    const date = new Date();
    formData.append("categoryOwner", sessionData.user);
    formData.append("categoryName", newCategoryName);
    formData.append("categoryIcon", categoryIcon);
    formData.append("isDefault", isDefault);
    formData.append("createTime", date);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}categories/save`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
          setMessage("Add new category failed");
          setSnackColor("error");
          setSnackOpen(true);
          if(response.data.hasOwnProperty('categoryOwnerError')) {
            setNewCategoryOwnerError(response.data.categoryOwnerError);
          }
          if(response.data.hasOwnProperty('categoryNameError')) {
            setNewCategoryNameError(response.data.categoryNameError);
          }
          if(response.data.hasOwnProperty('categoryIconError')) {
            setNewCategoryIconError(response.data.categoryIconError);
          }
        } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
          setMessage('The Category has been successfully added');
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
  // dialog for update category
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const handleUpdateDialogOpen = () => {
    clearUpdateInputField();
    setDefaultUpdateValues();
    setUpdateDialogOpen(true);
  };
  const handleUpdateDialogClose = () => {
    setMessage("");
    setUpdateCategoryOwnerError("");
    setUpdateCategoryNameError("");
    setUpdateCategoryIconError("");
    setUpdateDialogOpen(false);
  };
  // textfield in update category dialog
  const [updateCategoryName, setUpdateCategoryName] = useState('');
  const [updateCategoryId, setUpdateCategoryId] = useState('');
  const handleUpdateCategoryNameChange = (event) => {
    setUpdateCategoryName(event.target.value);
  };
  //set default values for updating
  const selectedCategory = filteredRows.find((row) => row.categoryId === selectedRows[0]);
  const setDefaultUpdateValues = (event) => {
    setUpdateCategoryId(selectedCategory.categoryId);
    setUpdateCategoryName(selectedCategory.categoryName);
    setCategoryIcon(selectedCategory.categoryIcon);
    const index = rows.findIndex(item => item.categoryId === selectedCategory.categoryId);
    setSelectedImage(userIcons[index]);
  }
  // alert and message for update category func
  const [updateCategoryOwnerError, setUpdateCategoryOwnerError] = useState("");
  const [updateCategoryNameError, setUpdateCategoryNameError] = useState("");
  const [updateCategoryIconError, setUpdateCategoryIconError] = useState("");
  //clear input field in time
  const clearUpdateInputField = (event) => {
    setCategoryIcon("");
    setIsDefault(-1);
    setUpdateCategoryName("");
    setSelectedImage(camera);
  };
  // update category
  const handleUpdate = async (event) => {
    const formData = new FormData();
    formData.append("categoryId", updateCategoryId);
    formData.append("categoryOwner", sessionData.user);
    formData.append("categoryName", updateCategoryName);
    formData.append("categoryIcon", categoryIcon);
    formData.append("isDefault", isDefault);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}categories/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
          setMessage("Update category failed");
          setSnackColor("error");
          setSnackOpen(true);
          if(response.data.hasOwnProperty('categoryOwnerError')) {
            setUpdateCategoryOwnerError(response.data.categoryOwnerError);
          }
          if(response.data.hasOwnProperty('categoryNameError')) {
            setUpdateCategoryNameError(response.data.categoryNameError);
          }
          if(response.data.hasOwnProperty('categoryIconError')) {
            setUpdateCategoryIconError(response.data.categoryIconError);
          }
        } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
          setMessage('The Category has been successfully updated');
          setSnackColor("success");
          setSnackOpen(true);
          refreshData();
        }
      }
    } catch (error) {
      console.error('add error:', error);
    }
    clearUpdateInputField();
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
    formData.append("categoryOwner", sessionData.user);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}categories/delete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.hasOwnProperty('status') && response.data.status === 'failed') {
            if(response.data.hasOwnProperty('errorMsg')) {
              setMessage(response.data.errorMsg);
              setSnackColor("error");
              setSnackOpen(true);
            }
        } else if (response.data.hasOwnProperty('status') && response.data.status === 'succeeded') {
          setMessage('Categories have been deleted successfully, blogs under deleted categories are moved to default category');
          setSnackColor("success");
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
          Category Management
      </Typography>
      <Divider sx={{ my: 1 }} />
      <MngToolBar 
        rows={rows}
        selectedRows={selectedRows} 
        setFilteredRows={setFilteredRows}
        searchFieldOptions={searchFieldOptions}
        onNewButtonClick={handleDialogOpen}
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
            <TableCell align="left" style={{ fontWeight: 'bold' }} sx={{ fontSize: '16px' }}>Name</TableCell>
            <TableCell  style={{ textAlign: 'center', fontWeight: 'bold'}} sx={{ fontSize: '16px' }}>Icon</TableCell>
            <TableCell 
              align="left"
              onClick={() => handleSort('createTime')}
              style={{ cursor: 'pointer', fontWeight: 'bold' }}
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
            .map((row, index) => (
            <TableRow key={row.categoryId}>
              <TableCell style={{ padding: '0px'}} sx={{ maxWidth: '1px' }}>
                <Checkbox
                  checked={selectedRows.includes(row.categoryId)}
                  onChange={() => toggleRowSelection(row.categoryId)}
                />
              </TableCell>
              <TableCell sx={{ maxWidth: '150px', fontSize: '16px' }}>{row.categoryName}</TableCell>
              <TableCell style={{textAlign: 'center'}} sx={{ fontSize: '16px' }}>
                {row.categoryIcon && (
                  <img
                  src={`data:image/*;base64,${userIcons[index]}`}
                    alt="Category-Icon"
                    style={{ maxWidth: '50px', maxHeight: '50px' }}
                  />
                )}
              </TableCell>
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
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle color={"white"} height={"15%"} sx={{fontSize : "30px", backgroundColor: "#3277d5"}}>Complete Information</DialogTitle>
        <DialogContent>
        {newCategoryOwnerError && <p className="error-message-inline">{newCategoryOwnerError}</p>}
          <TextField
            autoFocus
            margin="dense"
            id="category_name"
            label="Enter Category Name"
            fullWidth
            variant="standard"
            onChange={handleNewCategoryNameChange}
          />
          {newCategoryNameError && <p className="error-message-inline">{newCategoryNameError}</p>}
          <div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
              <p>Cover Icon:</p>
              <img
                alt="Selected"
                style={{ width: "100px", height: "80px", marginLeft: "10px"}}
                src={`data:image/*;base64,${selectedImage}`}
              />
            </div>
            <br/>
            <p>Default Icons:</p>
            {newCategoryIconError && <p className="error-message-inline">{newCategoryIconError}</p>}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {defaultIcons.map((image, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginRight: "10px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    width: "20%"
                  }}
                  onClick={() => handleImageSelect(image, index)}
                >
                  <img
                    key={index}
                    alt={`Preview ${index}`}
                    style={{ width: "50px", height: "40px" }}
                    src={`data:image/*;base64,${image}`}
                  />
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "10px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  width: "20%"
                }}
                onClick={handleBlankImageClick}
              >
                <CameraIcon fontSize="large" style={{ width: "50px", height: "40px" }} />
                <p style={{ marginTop:"1px", fontSize:"15px", fontWeight:"bold" }}>Upload</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAdd}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
        <DialogTitle color={"white"} height={"15%"} sx={{fontSize : "30px", backgroundColor: "#3277d5"}}>Update Dialog</DialogTitle>
        <DialogContent>
        {updateCategoryOwnerError && <p className="error-message-inline">{updateCategoryOwnerError}</p>}
          <TextField
            autoFocus
            margin="dense"
            id="category_name"
            label="Enter Category Name"
            fullWidth
            variant="standard"
            defaultValue={updateCategoryName}
            onChange={handleUpdateCategoryNameChange}
          />
          {updateCategoryNameError && <p className="error-message-inline">{updateCategoryNameError}</p>}
          <div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
              <p>Cover Icon:</p>
              <img
                alt="Selected"
                style={{ width: "100px", height: "80px", marginLeft: "10px"}}
                src={`data:image/*;base64,${selectedImage}`}
              />
            </div>
            <br/>
            <p>Default Icons:</p>
            {updateCategoryIconError && <p className="error-message-inline">{updateCategoryIconError}</p>}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {defaultIcons.map((image, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginRight: "10px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    width: "20%"
                  }}
                  onClick={() => handleImageSelect(image, index)}
                >
                  <img
                    key={index}
                    alt={`Preview ${index}`}
                    style={{ width: "50px", height: "40px" }}
                    src={`data:image/*;base64,${image}`}
                  />
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "10px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  width: "20%"
                }}
                onClick={handleBlankImageClick}
              >
                <CameraIcon fontSize="large" style={{ width: "50px", height: "40px" }} />
                <p style={{ marginTop:"1px", fontSize:"15px", fontWeight:"bold" }}>Upload</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
              </div>
            </div>
          </div>
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
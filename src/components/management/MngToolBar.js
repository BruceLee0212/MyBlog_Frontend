import React, {useState, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';

const MngToolBar = ({ rows, selectedRows, setFilteredRows, searchFieldOptions, onNewButtonClick, onUpdateButtonClick, onDeleteButtonClick, showUpdateButton }) => {
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchField, setSearchField] = useState(searchFieldOptions[0].value);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSearch = () => {
    const filteredRows = rows.filter((row) => {
      const searchFieldValue = row[searchField];
      return searchFieldValue.toString().toLowerCase().includes(searchKeyword.toLowerCase());
    });
    setFilteredRows(filteredRows);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, searchField]);

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchKeyword('');
  };

  const handleUpdateClick = () => {
    if (selectedRows.length === 0) {
      setAlertMessage('Select at least 1 row');
      setAlertOpen(true);
    } else if (selectedRows.length > 1) {
      setAlertMessage('Do not select more than 1 row');
      setAlertOpen(true);
    } else {
      onUpdateButtonClick();
    }
  };

  return (
    <div>
      <Grid container>
        <Grid item>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            size="medium" 
            color="success" 
            sx={{ width: '100px', margin : '10px'}}
            onClick={onNewButtonClick}
          >
            New
          </Button>
        </Grid>
        {showUpdateButton && (
          <Grid item>
            <Button 
              variant="contained" 
              startIcon={<UpdateIcon />} 
              size="medium" 
              color="info" 
              sx={{ width: '100px', margin : '10px'}}
              onClick={handleUpdateClick}
            >
              Update
            </Button>
          </Grid>
        )}
        <Grid item>
          <Button 
            variant="contained" 
            startIcon={<DeleteIcon />} 
            size="medium" 
            color="error" 
            sx={{ width: '100px', margin : '10px'}}
            onClick={onDeleteButtonClick}
          >
            Delete
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
      {alertOpen && (
        <Alert
          severity="warning"
          onClose={() => setAlertOpen(false)}
          sx={{ marginTop: '10px' }}
          open={alertOpen}
        >
          {alertMessage}
        </Alert>
      )}
    </div>
  );
};

export default MngToolBar;
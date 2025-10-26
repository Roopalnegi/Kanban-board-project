import { TextField} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

function SearchBar({setSearchTerm})
{
     return (
      <TextField
        label = "Search"
        variant = "outlined"
        size = "small"
        onChange = {(e) => setSearchTerm(e.target.value)}
        InputProps = {{
         endAdornment:(
                       <InputAdornment position = "end">
                          <img src = "../Icons/search-icon.png" alt = "img" width= "25px" height = "25px"/>
                       </InputAdornment>
                      )  
        }}
        sx={{ boxShadow: 2, borderRadius: 2, width : 150}}
      />

  );
}

export default SearchBar;
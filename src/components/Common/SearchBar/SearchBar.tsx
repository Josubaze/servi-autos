import { TextField, InputAdornment } from '@mui/material';
import {  ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';
import { BsSearch } from "react-icons/bs";

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, placeholder}) => {
  return (
    <div className='sm:w-1/3 max-sm:w-full'>
      <ThemeProvider theme={TextFieldTheme}>
        <TextField 
            variant="outlined"
            fullWidth
            type="string" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Buscar'
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BsSearch />
                </InputAdornment>
              ),
            }}
          />
      </ThemeProvider>
    </div>
  );
};
import { TextField, InputAdornment } from '@mui/material';
import {  ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';
import { BsSearch } from "react-icons/bs";

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm}) => {
  return (
    <div className='sm:w-1/3 max-sm:w-full bg-black'>
      <ThemeProvider theme={TextFieldTheme}>
        <TextField 
            variant="filled"
            fullWidth
            type="string" 
            size='small'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Buscar'
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BsSearch className='h-5 w-5' />
                </InputAdornment>
              ),
            }}
          />
      </ThemeProvider>
    </div>
  );
};
import TextField from '@mui/material/TextField';
import {  ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, placeholder}) => {
  return (
      <ThemeProvider theme={TextFieldTheme}>
        <TextField 
            label={placeholder}
            variant="outlined"
            fullWidth
            type="number" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='sm:w-1/3 max-sm:w-full'
          />
      </ThemeProvider>

  );
};
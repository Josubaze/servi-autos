import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface LoadingProps {
    color: string;
    justify: string;
    size: number;
}

export const Loading: React.FC<LoadingProps> = ({ color, size, justify }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: justify }}>
            <CircularProgress sx={{ color: color }} size={size}/>
        </Box>
    );
}


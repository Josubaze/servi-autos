import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface LoadingProps {
    color: string;
    justify: string;
    size: number;
    pt: number;
}

export const Loading: React.FC<LoadingProps> = ({ color, size, justify, pt }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: justify, paddingTop: pt}}>
            <CircularProgress sx={{ color: color }} size={size}/>
        </Box>
    );
}


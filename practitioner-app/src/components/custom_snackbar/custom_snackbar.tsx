import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import React from 'react';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));
Alert.displayName = 'Alert';

type CustomSnackbarProps = {
    onClose: () => void;
    open: boolean;
    message: string;
    severity?: 'error' | 'success' | 'info' | 'warning';
};

const CustomSnackbar = (props: CustomSnackbarProps): JSX.Element => {
    const { onClose, open, message, severity } = props;
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <Alert onClose={onClose} severity={severity ?? 'error'} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;

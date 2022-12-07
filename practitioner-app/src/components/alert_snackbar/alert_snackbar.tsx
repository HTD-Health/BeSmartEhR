import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import React from 'react';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));
Alert.displayName = 'Alert';

type AlertSnackbarProps = {
    onClose: () => void;
    open: boolean;
    message: string;
};

const AlertSnackbar = (props: AlertSnackbarProps): JSX.Element => {
    const { onClose, open, message } = props;
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AlertSnackbar;

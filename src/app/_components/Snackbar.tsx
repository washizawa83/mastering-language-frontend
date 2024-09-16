import { useLayoutContext } from '@/app/providers/LayoutProvider'
import Alert from '@mui/material/Alert'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import * as React from 'react'

export default function AutoHideSnackbar() {
    const { snackbarParam, setSnackbarParam } = useLayoutContext()

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        setSnackbarParam(null)
        if (reason === 'clickaway') {
            return
        }
    }

    return (
        <div>
            <Snackbar
                open={snackbarParam?.isVisible}
                autoHideDuration={
                    snackbarParam?.duration ? snackbarParam?.duration : 5000
                }
                onClose={handleClose}
            >
                <Alert severity={snackbarParam?.type}>
                    {snackbarParam?.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

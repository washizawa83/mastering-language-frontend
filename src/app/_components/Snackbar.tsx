import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import * as React from 'react'

type Props = {
    message: string
    autoHideDuration?: number
    isOpen: boolean
}

export default function AutohideSnackbar({
    message,
    autoHideDuration = 5000,
    isOpen,
}: Props) {
    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return
        }
    }

    return (
        <div>
            <Snackbar
                open={isOpen}
                autoHideDuration={autoHideDuration}
                onClose={handleClose}
                message={message}
            />
        </div>
    )
}

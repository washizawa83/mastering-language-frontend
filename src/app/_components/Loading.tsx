import { useLayoutContext } from '@/app/providers/LayoutProvider'
import { Box, CircularProgress } from '@mui/material'
import React from 'react'

interface LoadingProps {
    height?: string
}

export const LoadingComponent: React.FC<LoadingProps> = ({
    height = '100vh',
}) => {
    const { isLoading } = useLayoutContext()
    return (
        <Box
            display={isLoading ? 'flex' : 'none'}
            justifyContent="center"
            alignItems="center"
            height={height}
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgcolor="rgba(0, 0, 0, 0.9)"
            zIndex={9999}
        >
            <CircularProgress />
        </Box>
    )
}

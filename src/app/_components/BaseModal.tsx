import { useTheme } from '@/app/layout'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { ReactNode } from 'react'
import config from '../../../tailwind.config'

type Props = {
    title?: string
    isOpen: boolean
    maxWidth?: string
    children: ReactNode
    setIsOpen: (state: boolean) => void
}

export const BaseModal = ({
    title,
    isOpen,
    maxWidth = '500px',
    children,
    setIsOpen,
}: Props) => {
    const { theme } = useTheme()
    const handleClose = () => {
        setIsOpen(false)
    }

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    borderRadius: '8px',
                    overflow: 'hidden',
                },
            }}
            onClick={(event) => event.stopPropagation()}
        >
            {title && (
                <DialogTitle
                    sx={{
                        bgcolor:
                            theme === 'dark'
                                ? config.theme?.colors?.deep?.dark
                                : config.theme?.colors?.deep?.light,
                        color:
                            theme === 'dark'
                                ? config.theme?.colors?.typography.dark
                                : config.theme?.colors?.typography.light,
                        maxWidth: maxWidth,
                        width: '80vw',
                    }}
                >
                    {title}
                </DialogTitle>
            )}
            <DialogContent
                sx={{
                    bgcolor:
                        theme === 'dark'
                            ? config.theme?.colors.shallow.dark
                            : config.theme?.colors?.shallow?.light,
                    color:
                        theme === 'dark'
                            ? config.theme?.colors?.typography.dark
                            : config.theme?.colors?.typography.light,
                    maxWidth: maxWidth,
                    width: '80vw',
                }}
            >
                {children}
            </DialogContent>
        </Dialog>
    )
}

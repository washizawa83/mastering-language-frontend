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

type TailWindColors = {
    deep: { dark: string; light: string }
    shallow: { dark: string; light: string }
    typography: { dark: string; light: string }
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
                                ? (config.theme?.colors as TailWindColors).deep
                                      .dark
                                : (config.theme?.colors as TailWindColors).deep
                                      .light,
                        color:
                            theme === 'dark'
                                ? (config.theme?.colors as TailWindColors)
                                      .typography.dark
                                : (config.theme?.colors as TailWindColors)
                                      .typography.light,
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
                            ? (config.theme?.colors as TailWindColors).shallow
                                  .dark
                            : (config.theme?.colors as TailWindColors).shallow
                                  ?.light,
                    color:
                        theme === 'dark'
                            ? (config.theme?.colors as TailWindColors)
                                  .typography.dark
                            : (config.theme?.colors as TailWindColors)
                                  .typography.light,
                    maxWidth: maxWidth,
                    width: '80vw',
                }}
            >
                {children}
            </DialogContent>
        </Dialog>
    )
}

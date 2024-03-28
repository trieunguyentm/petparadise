import { Alert, Snackbar } from "@mui/material"

const SnackbarCustom = ({
    open,
    setOpen,
    type,
    content,
}: {
    open: boolean
    setOpen: (arg: boolean) => void
    type: "success" | "info" | "warning" | "error"
    content: string
}) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            autoHideDuration={6000}
            onClose={() => setOpen(false)}
        >
            <Alert
                onClose={() => setOpen(false)}
                severity={type}
                variant="filled"
                sx={{ width: "100%" }}
            >
                {content}
            </Alert>
        </Snackbar>
    )
}

export default SnackbarCustom

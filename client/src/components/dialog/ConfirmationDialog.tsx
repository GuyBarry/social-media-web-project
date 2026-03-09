import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { CostumButton } from "../button/CostumButton.styled";
import type { FC } from "react";

interface ConfirmationDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      disableScrollLock
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <CostumButton onClick={onCancel} color="inherit">
          {cancelLabel}
        </CostumButton>
        <CostumButton
          onClick={onConfirm}
          color="error"
          variant="contained"
          disableElevation
        >
          {confirmLabel}
        </CostumButton>
      </DialogActions>
    </Dialog>
  );
};

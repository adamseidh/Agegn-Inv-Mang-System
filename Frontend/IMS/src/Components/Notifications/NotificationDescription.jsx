import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const NotificationDescription = ({
  open,
  onClose,
  title,
  description,
  date,
  status,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
          fontWeight: "bold",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ padding: 3 }}>
        <div className="mb-4">
          <Typography variant="subtitle2" color="text.secondary">
            Status:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: status === "Not Read" ? "#d32f2f" : "#2e7d32",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {status}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Date:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {new Date(date).toLocaleString()}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Description:
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              padding: 1,
              lineHeight: 1.6,
              backgroundColor: "#fafafa",
              borderRadius: 1,
              border: "1px solid #eee",
              mt: 1,
            }}
          >
            {description}
          </Typography>
        </div>
      </DialogContent>
      <DialogActions sx={{ padding: 2, borderTop: "1px solid #e0e0e0" }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 1 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDescription;

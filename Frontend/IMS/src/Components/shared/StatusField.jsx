import { useRecordContext } from "react-admin";
import { Chip } from "@mui/material";

export const StatusField = (props) => {
    const { source, ...restProps } = props;  // Extract `source` prop and other props
    const record = useRecordContext();  // Access record context from react-admin

    if (!record) return null;

    // Dynamically use the source field from the record
    const status = record[source];  // Use dynamic source value
    console.log('status', status);

    if (!status) return null;  // If there's no status, render nothing or fallback

    // Define colors based on status
    let textColor, backgroundColor;
    switch (status) {
        case 'UnSeen':
            textColor = 'red';
            backgroundColor = '#FFDDC1';  // Light red
            break;
        case 'Seen':
            textColor = 'green';
            backgroundColor = '#D4EDDA';  // Light green
            break;
        default:
            textColor = 'gray';
            backgroundColor = '#F8F9FA';  // Light gray
            break;
    }

    return (
        <Chip
            label={status}
            size="small"
            sx={{
                color: textColor,  // Dynamic text color
                backgroundColor: backgroundColor,  // Dynamic background color
                padding: '4px',
                borderRadius: '16px',
            }}
            {...restProps}  // Pass down other props
        />
    );
};

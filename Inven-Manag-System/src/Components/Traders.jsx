import React, { useState } from "react";
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    Filter,
    SelectInput,
    TextInput,
    Create,
    SimpleForm,
    NumberInput,
    Show,
    SimpleShowLayout,
    DatagridConfigurable, // Ensure you're using DatagridConfigurable
    Edit,
    SelectColumnsButton, // Ensure this import is here
    TopToolbar,
    FilterButton,
    CreateButton,
    ExportButton,
    Button,
    FileInput,
    FileField,
} from "react-admin";
import { Dialog, DialogContent, DialogActions, DialogTitle } from "@mui/material";

const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

// Filter component for the list
const TradersFilter = [
    <TextInput label="Search: TIN, Phone, Name" source="q" alwaysOn key="search" />,
    <SelectInput
        label="Payment Status"
        source="payment_status"
        choices={[
            { id: "paid", name: "Paid" },
            { id: "unpaid", name: "Unpaid" },
        ]}
        key="payment_status"
    />,
];

const Traders = () => {
    const [open, setOpen] = useState(false);

    const handleImportClick = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleFileUpload = async (formData) => {
        try {
            const response = await fetch(`${serverHost}/importTraders`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('File imported successfully!');
                window.location.reload();

                setOpen(false);
            } else if (!response.ok) {
                alert('Column mismatch detected. Please ensure your file is an Excel document with the required columns and correct header names');
            }

            else {
                alert('Failed to import file.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file.');
        }
    };

    const ImportDialog = ({ open, onClose }) => {
        const handleSubmit = async (data) => {
            if (data.file) {
                const formData = new FormData();
                formData.append('file', data.file.rawFile);
                await handleFileUpload(formData);
            } else {
                alert('Please select a file to upload.');
            }
        };

        return (
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Import File</DialogTitle>
                <DialogContent>
                    <SimpleForm onSubmit={handleSubmit}>
                        <FileInput source="file" label="Upload file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                            <FileField source="src" title="title" />
                        </FileInput>
                    </SimpleForm>
                </DialogContent>
                <DialogActions>
                    <Button
                        label="Cancel"
                        onClick={onClose}
                    />

                </DialogActions>

            </Dialog>
        );
    };

    const PostListActions = ({ onImportClick }) => (
        <TopToolbar>
            <SelectColumnsButton />

            <Button label="Import" onClick={onImportClick} />
            <CreateButton />
            <FilterButton />
            <ExportButton />


        </TopToolbar>
    );

    return (
        <div>
            <List
                filters={TradersFilter}
                actions={<PostListActions onImportClick={handleImportClick} />}
            >
                <DatagridConfigurable rowClick="show">
                    <TextField source="TIN" label="TIN" />
                    <TextField source="name" label="Name" />
                    <TextField source="phone" label="Phone" />
                    <TextField source="business_type" label="Business Type" />
                    <NumberField source="capital" label="Capital" />
                    <TextField source="payment_status" label="Payment Status" />
                </DatagridConfigurable>
            </List>

            {/* Import Dialog */}
            <ImportDialog open={open} onClose={handleCloseDialog} />
        </div>
    );
};


const TradersCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="TIN" label="TIN" />
            <TextInput source="name" label="Name" />
            <TextInput source="phone" label="Phone" />
            <TextInput source="business_type" label="Business Type" />
            <NumberInput source="capital" label="Capital" />
            <SelectInput
                source="payment_status"
                label="Payment Status"
                choices={[
                    { id: "paid", name: "Paid" },
                    { id: "unpaid", name: "Unpaid" },
                ]}
            />
        </SimpleForm>
    </Create>
);

const TradersEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="TIN" label="TIN" />
            <TextInput source="name" label="Name" />
            <TextInput source="phone" label="Phone" />
            <TextInput source="business_type" label="Business Type" />
            <NumberInput source="capital" label="Capital" />
            <SelectInput
                source="payment_status"
                label="Payment Status"
                choices={[
                    { id: "paid", name: "Paid" },
                    { id: "unpaid", name: "Unpaid" },
                ]}
            />
        </SimpleForm>
    </Edit>
);

const TradersShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="TIN" label="TIN" />
            <TextField source="name" label="Name" />
            <TextField source="phone" label="Phone" />
            <TextField source="business_type" label="Business Type" />
            <NumberField source="capital" label="Capital" />
            <TextField source="payment_status" label="Payment Status" />
        </SimpleShowLayout>
    </Show>
);

export { Traders, TradersCreate, TradersEdit, TradersShow };

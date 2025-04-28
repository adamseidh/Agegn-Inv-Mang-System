import React, { useEffect, useState } from "react";
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
  EditButton,
  BulkDeleteButton,
  PasswordInput,
  useRedirect,
  ShowButton,
} from "react-admin";
import CryptoJS from "crypto-js";
import { Grid } from "@mui/material";

const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

const Users = () => {
  // Filter component for the list
  const UsersFilter = [
    <TextInput label="Search: Name,  Phone" source="q" alwaysOn key="search" />,
  ];

  const handleFileUpload = async (formData) => {
    try {
      const response = await fetch(`${serverHost}/importTraders`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File imported successfully!");
        window.location.reload();

        setOpen(false);
      } else if (!response.ok) {
        alert(
          "Column mismatch detected. Please ensure your file is an Excel document with the required columns and correct header names"
        );
      } else {
        alert("Failed to import file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  const PostListActions = ({ onImportClick }) => (
    <TopToolbar>
      <SelectColumnsButton />
      <CreateButton />
    </TopToolbar>
  );

  return (
    <div>
      <List filters={UsersFilter} actions={<PostListActions />}>
        <DatagridConfigurable
          bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}
          rowClick="edit"
        >
          <TextField source="name" label="Name" />
          <TextField source="phone" label="Phone" />
          <TextField source="email" label="Email" />
          <TextField source="address" label="Address" />

          <TextField source="role" Label="User Role" />
          <EditButton label="Edit" />
          <ShowButton label="History" />
        </DatagridConfigurable>
      </List>
    </div>
  );
};

const CreateUser = (props) => {
  const transform = async (data) => {
    if (data.password) {
      data.password = CryptoJS.SHA256(data.password).toString(); // hash the password before send
    }
    return data;
  };

  const redirect = useRedirect();
  const onSuccess = () => {
    redirect("list", "users"); // Redirect to the list page after creation
  };

  // Validation functions
  const required =
    (message = "Required") =>
    (value) =>
      value ? undefined : message;

  const validateEmail = (value) => {
    if (!value) return "Required";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      return "Invalid email address";
    }
  };

  const validatePassword = (value) => {
    if (!value) return "Required";
    if (value.length < 4) return "Password must be at least 4 characters";
  };

  return (
    <Create {...props} transform={transform} mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput
              source="name"
              label="Name"
              fullWidth
              validate={required()}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput
              source="phone"
              label="Phone"
              fullWidth
              validate={required()}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput
              source="email"
              label="Email"
              fullWidth
              validate={validateEmail}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput
              source="address"
              label="User Address"
              fullWidth
              validate={required()}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <SelectInput
              source="role"
              label="User Role"
              choices={[
                { id: "Admin", name: "Admin" },
                { id: "Technical Manager", name: "Technical Manager" },
                { id: "Finance Manager", name: "Finance Manager" },
                { id: "Finance", name: "Finance" },
                { id: "Sales", name: "Sales" },
                { id: "Store Manager", name: "Store Manager" },
                { id: "Store Man", name: "Store Man" },
              ]}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <PasswordInput
              source="password"
              label="Temporary Password"
              fullWidth
              validate={validatePassword}
            />
          </Grid>
        </Grid>
      </SimpleForm>
    </Create>
  );
};

const EditUser = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput source="name" label="Name" fullWidth />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput source="phone" label="Phone" fullWidth />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput source="email" label="Email" fullWidth />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput source="address" label="User Address" fullWidth />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <SelectInput
              source="role"
              label="User Role"
              choices={[
                { id: "Admin", name: "Admin" },
                { id: "Technical Manager", name: "Technical Manager" },
                { id: "Finance Manager", name: "Finance Manager" },
                { id: "Finance", name: "Finance" },
                { id: "Sales", name: "Sales" },
                { id: "Store Manager", name: "Store Manager" },
                { id: "Store Man", name: "Store Man" },
              ]}
              fullWidth
            />
          </Grid>
        </Grid>
      </SimpleForm>
    </Edit>
  );
};

export { Users, CreateUser, EditUser };

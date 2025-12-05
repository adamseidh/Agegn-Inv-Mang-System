import axios from "axios";
import React, { useState, useEffect } from "react";
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
  useDataProvider,
  Button,
  DateField,
  EditButton,
  useNotify,
  useRefresh,
  BulkDeleteButton,
  useRedirect,
  ShowButton,
} from "react-admin";
import { Grid } from "@mui/material";

// Filter component for the list
const CustomersFilter = [
  <TextInput label="Search Customer" source="q" alwaysOn key="search" />,
];

const Customer = () => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const notify = useNotify();
  const refresh = useRefresh();

  const PostListActions = () => (
    <TopToolbar>
      {/**<SelectColumnsButton /> */}
      {/**<FilterButton /> */}
      <CreateButton />
      <ExportButton />
    </TopToolbar>
  );
  return (
    <div>
      <List filters={CustomersFilter} actions={<PostListActions />}>
        <DatagridConfigurable
          bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}
          rowClick="show"
        >
          <TextField source="name" label="Customer" />
          <TextField source="customer_name" label="Customer Name" />
          <TextField source="phone" label="Phone" />
          <TextField source="email" label="Email" />
          <TextField source="region" label="Region" />
          <TextField source="zone" label="Zone" />
          <TextField source="wereda_or_city" label="Wereda/City" />
          <ShowButton label="Detail" />

          <EditButton />
        </DatagridConfigurable>
      </List>
    </div>
  );
};

const CreateCustomer = (props) => {
  const redirect = useRedirect();
  const userId = JSON.parse(localStorage.getItem("userId")).userId;

  const onSuccess = () => {
    redirect("list", "customers");
  };
  return (
    <Create {...props} mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextInput source="name" label="Customer" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="customer_name" label="Customer Name" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="phone" label="Phone" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="email" label="Email" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="region" label="Region" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="zone" label="Zone" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="wereda_or_city" label="Wereda/City" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="kebele" label="Kebele" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="tin" label="TIN" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="letter_no" label="Letter No." fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="website" label="Website" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput
              source="userId"
              defaultValue={userId}
              style={{ display: "none" }}
              fullWidth
            />
          </Grid>
        </Grid>
      </SimpleForm>
    </Create>
  );
};

const EditCustomer = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextInput source="name" label="Customer" fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="customer_name" label="Customer Name" fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="phone" label="Phone" fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="email" label="Email" fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="region" label="Region" fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="zone" label="Zone" fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="wereda_or_city" label="Wereda/City" fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="kebele" label="Kebele" fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="tin" label="TIN" fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="letter_no" label="Letter No." fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="website" label="Website" fullWidth />
        </Grid>
      </Grid>
    </SimpleForm>
  </Edit>
);

const ShowCustomer = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="name" label="Customer" />
      <TextField source="customer_name" label="Customer Name" />
      <TextField source="phone" label="Phone" />
      <TextField source="email" label="Email" />
      <TextField source="region" label="Region" />
      <TextField source="wereda_or_city" label="Wereda/City" />
      <TextField source="zone" label="Zone" />
      <TextField source="kebele" label="Kebele" />
      <TextField source="tin" label="TIN" />
      <TextField source="letter_no" label="Letter No." />
      <TextField source="website" label="Website" />
    </SimpleShowLayout>
  </Show>
);

export { Customer, CreateCustomer, ShowCustomer, EditCustomer };
Customer;

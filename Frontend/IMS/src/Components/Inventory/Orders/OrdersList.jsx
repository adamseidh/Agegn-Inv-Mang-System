import React, { useEffect, useState } from "react";
import {
  List,
  Datagrid,
  TextField,
  ImageInput,
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
  useRedirect,
  DateField,
  DateInput,
  RichTextField,
  ImageField,
  useDataProvider,
  useRecordContext,
  AutocompleteInput,
  NumberField,
  ShowButton,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid } from "@mui/material";
import NumberInputStyle from "../../../helpers/functions/numberInputStyle";

const OrdersList = () => {
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem("role")).role;
  const PostListActions = () => (
    <TopToolbar>
      {/**<SelectColumnsButton /> */}
      {/**<FilterButton /> */}
      {/* <CreateButton /> */}
      {/** <ExportButton /> */}
    </TopToolbar>
  );

  return (
    <div>
      <List actions={<PostListActions />}>
        <DatagridConfigurable bulkActionButtons={false} rowClick="show">
          <TextField source="customerName" label="Customer" />
          <TextField source="total_items" label="Total Products" />
          <TextField source="total_price" label="Total Price" />
          <TextField source="sells_status" label="Status" />
          {role === "Supper Admin" && (
            <TextField source="changedBy" label="Accepted By" />
          )}
          <DateField source="created_at" label="Created At" />

          <ShowButton label="Detail" />
        </DatagridConfigurable>
      </List>
    </div>
  );
};

export { OrdersList };

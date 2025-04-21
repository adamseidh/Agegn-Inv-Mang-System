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

const UpcamingPaymentsList = () => {
  const navigate = useNavigate();
  const PostListActions = () => (
    <TopToolbar>
      {/**<SelectColumnsButton /> */}
      {/**<FilterButton /> */}
      <CreateButton />
      {/** <ExportButton /> */}
    </TopToolbar>
  );

  return (
    <div>
      <List actions={<PostListActions />} pagination={false}>
        <DatagridConfigurable bulkActionButtons={false} rowClick="show">
          <TextField source="supplierName" label="Supplier" />
          <TextField source="payment_status" label="Payment Status" />
          <TextField source="amount" label="Un-Paid Amount" />
          <TextField source="remark" label="Payment Remark" />
          <DateField source="payment_date" label="Payment Date" />
          <DateField source="purchaseDate" label="Purchase Date" />
          <ShowButton label="Detail" />
        </DatagridConfigurable>
      </List>
    </div>
  );
};

export { UpcamingPaymentsList };

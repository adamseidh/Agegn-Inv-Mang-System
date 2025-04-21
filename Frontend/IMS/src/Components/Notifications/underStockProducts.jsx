import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  List,
  Datagrid,
  TextField,
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
  DateInput,
  NumberField,
  FunctionField,
  ImageField,
  Labeled,
  ShowButton,
  BulkDeleteButton,
} from "react-admin";

import { Grid, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// Filter component for the list
const FilterData = (props) => (
  <Filter {...props}>
    <SelectInput
      label="Complain Status"
      source="complain_status"
      choices={[
        { id: "Replied", name: "Replied" },
        { id: "Not Replied", name: "Not Replied" },
      ]}
    />
  </Filter>
);

const underStockProductsList = () => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const notify = useNotify();
  const refresh = useRefresh();
  const [item, setItem] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [category, setCategory] = useState([]);
  const [productType, setProductType] = useState([]);

  const fetchCategory = () => {
    axios
      .get(`${serverHost}/category`)
      .then((resp) => {
        const data = resp.data;
        setCategory(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchType = () => {
    axios
      .get(`${serverHost}/productType`)
      .then((resp) => {
        const data = resp.data;
        setProductType(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchCategory();
    fetchType();
  }, []);

  const ProductsFilter = [
    <TextInput label="Search: Product Name" source="q" alwaysOn key="search" />,
    <SelectInput
      label="Product Category"
      source="category_id"
      choices={category.map((data) => ({ id: data.id, name: data.name }))}
    />,

    <SelectInput
      label="Product Type"
      source="type_id"
      choices={productType.map((data) => ({ id: data.id, name: data.name }))}
    />,
  ];
  const PostListActions = () => (
    <TopToolbar>
      <SelectColumnsButton />

      <FilterButton />
      <ExportButton />
    </TopToolbar>
  );
  return (
    <div>
      <List
        filters={ProductsFilter}
        actions={<PostListActions />}
        pagination={false}
      >
        <DatagridConfigurable bulkActionButtons={false}>
          <TextField source="name" label="Product Name" />

          <TextField source="unit" label="Unit" />
          {/* <TextField source="quantity" label="Purchased" />
          <TextField source="sold_product" label="Sold" /> */}
          <TextField source="low_level" label="Low Level" />
          <TextField source="available_product" label="Available" />
        </DatagridConfigurable>
      </List>
    </div>
  );
};

export { underStockProductsList };

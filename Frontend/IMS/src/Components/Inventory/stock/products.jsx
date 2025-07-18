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

import { useParams, useNavigate } from 'react-router-dom';

import { Grid, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Permission from "../../../helpers/utils/permissions";

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

const Products = () => {
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
      <List filters={ProductsFilter} actions={<PostListActions />}>
        <DatagridConfigurable
          rowClick="show"
          bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}
        >
          <TextField source="id" label="Product Id" />
          <TextField source="name" label="Product Name" />

          <TextField source="unit" label="Unit" />
          <TextField source="quantity" label="Purchased" />
          <TextField source="sold_product" label="Sold" />
          <TextField source="available_product" label="Available" />
          <NumberField
            source="selling_price"
            label="Price (ETB)/unit"
            options={{ style: "currency", currency: "ETB" }}
          />
          <DateField
            source="expire_date"
            label="Expire Date"
            options={{ year: "numeric", month: "short", day: "numeric" }}
          />
          <ShowButton label="Detail" />
        </DatagridConfigurable>
      </List>
    </div>
  );
};

const EditProduct = (props) => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const [item, setItem] = useState([]);
  const [supplier, setSupplier] = useState([]);

  const fetchItems = () => {
    axios
      .get(`${serverHost}/items`)
      .then((resp) => {
        const data = resp.data;
        console.log(data);
        setItem(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const fetchSupplier = () => {
    axios
      .get(`${serverHost}/supplier`)
      .then((resp) => {
        const data = resp.data;
        console.log(data);
        setSupplier(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchItems();
    fetchSupplier();
  }, []);
  return (
    <Edit {...props}>
      <SimpleForm>
        {/**select input for item name */}
        {/**<TextField source="itemName" label="Product Name" /> */}
        <SelectInput
          label="Product Name"
          source="item_id"
          choices={item.map((data) => ({ id: data.id, name: data.name }))}
        />
        <NumberInput source="price" label="Price (ETB)" />
        <NumberInput source="stockin" label="Purchase" />
        <NumberInput source="stockout" label="Sold" />
        <SelectInput
          label="Supplier"
          source="supplier_id"
          choices={supplier.map((data) => ({ id: data.id, name: data.name }))}
        />
        <DateInput source="expire_date" label="Expire Date" />
        <TextInput
          multiline
          rows={4}
          source="description"
          label="Description"
        />
        <TextInput source="note" label="Note" />
      </SimpleForm>
    </Edit>
  );
};

// Styled Paper component for better visual appearance
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

// Section header component
const SectionHeader = ({ title }) => (
  <Typography
    variant="h6"
    gutterBottom
    sx={{
      color: "primary.main",
      borderBottom: "2px solid",
      borderColor: "primary.main",
      paddingBottom: "4px",
      marginBottom: "16px",
    }}
  >
    {title}
  </Typography>
);

const ShowProduct = (props) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken)?.token;
    const [aProductDetail, setAproductDetail] = useState(null);

    const storedRole = localStorage.getItem("role");
     const parsedRole = JSON.parse(storedRole).role;

       const { permission1, permission2, permission3 } = Permission(parsedRole);

    useEffect(() => {
        const fetchSaleData = async () => {
            try {
                const response = await axios.get(`${serverHost}/aproductDetail/${id}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                });
                // Assuming the API returns an array with the product as first element
                setAproductDetail(response.data[0]);
                console.log('fetched data ', response.data);
            } catch (err) {
                console.error('Error fetching product:', err);
            }
        };

        fetchSaleData();
    }, [id, serverHost, token]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        if (aProductDetail) {
            navigate(`/PurchaseList/${aProductDetail.purchase_id}/show`); // Navigate to edit page with ID
        }
    };

    return (
        <Show {...props} sx={{ maxWidth: 1000, margin: "0 auto" }}>
            <SimpleShowLayout>
                <Grid container spacing={3}>
                    {/* Product Information Section */}
                    <Grid item xs={12} md={6}>
                        <StyledPaper>
                            <SectionHeader title="Product Information" />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Labeled label="Product Name">
                                        <TextField source="name" fullWidth />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Category">
                                        <TextField source="categoryName" fullWidth />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Brand">
                                        <TextField source="brand" fullWidth />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Type">
                                        <TextField source="typeName" fullWidth />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={12}>
                                    <Labeled label="Description">
                                        <TextField source="description" fullWidth />
                                    </Labeled>
                                </Grid>
                            </Grid>
                        </StyledPaper>
                    </Grid>

                    {/* Inventory Details Section */}
                    <Grid item xs={12} md={6}>
                        <StyledPaper>
                            <SectionHeader title="Inventory Details" />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Labeled label="Available Stock">
                                        <NumberField
                                            source="available_product"
                                            sx={{ fontWeight: "bold", color: "success.main" }}
                                        />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Sold">
                                        <NumberField source="sold_product" />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Quantity">
                                        <TextField source="quantity" />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Unit">
                                        <TextField source="unit" />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Serial No.">
                                        <TextField source="serial_number" />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Batch No.">
                                        <TextField source="batch_number" />
                                    </Labeled>
                                </Grid>
                            </Grid>
                        </StyledPaper>
                    </Grid>

                    {/* Dates Section */}
                    <Grid item xs={12} md={6}>
                        <StyledPaper>
                            <SectionHeader title="Dates" />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Labeled label="Purchase Date">
                                        <DateField
                                            source="purchase_date"
                                            showTime
                                            sx={{ "& .RaDateField-root": { color: "text.primary" } }}
                                        />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Expiry Date">
                                        <DateField
                                            source="expire_date"
                                            showTime
                                        />
                                    </Labeled>
                                </Grid>
                            </Grid>
                        </StyledPaper>
                    </Grid>

                    {/* Financial Information Section */}

                    {permission1 && (<Grid item xs={12} md={6}>
                        <StyledPaper>
                            <SectionHeader title="Financial Information" />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Labeled label="Purchase Price (ETB)">
                                        <NumberField
                                            source="purchase_price"
                                            options={{ style: "currency", currency: "ETB" }}
                                        />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Selling Price (ETB)">
                                        <NumberField
                                            source="selling_price"
                                            options={{ style: "currency", currency: "ETB" }}
                                            sx={{ fontWeight: "bold", color: "primary.main" }}
                                        />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Additional Cost (ETB)">
                                        <NumberField
                                            source="additional_cost"
                                            options={{ style: "currency", currency: "ETB" }}
                                        />
                                    </Labeled>
                                </Grid>
                                <Grid item xs={6}>
                                    <Labeled label="Total Cost (ETB)">
                                        <NumberField
                                            source="overall_cost"
                                            options={{ style: "currency", currency: "ETB" }}
                                        />
                                    </Labeled>
                                </Grid>
                            </Grid>
                        </StyledPaper>
                    </Grid>)}
                    

                    {/* Supplier and Action Buttons Section */}
                    <Grid item xs={6}>
                        <StyledPaper>
                            <Typography variant="subtitle1" gutterBottom>
                                Supplier: {aProductDetail?.supplierName || 'N/A'}
                            </Typography>
                            <div className="flex justify-evenly mt-4 border rounded-lg p-1">
                                <button onClick={handleBack} className="primaryBtn">Back</button>
                                <button onClick={handleEdit} className="primaryBtn">Edit</button>
                            </div>
                        </StyledPaper>
                    </Grid>
                </Grid>
            </SimpleShowLayout>
        </Show>
    );
};

const CreateProduct = (props) => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const [item, setItem] = useState([]);
  const [supplier, setSupplier] = useState([]);

  const fetchItems = () => {
    axios
      .get(`${serverHost}/items`)
      .then((resp) => {
        const data = resp.data;
        console.log(data);
        setItem(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchSupplier = () => {
    axios
      .get(`${serverHost}/supplier`)
      .then((resp) => {
        const data = resp.data;
        console.log(data);
        setSupplier(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchItems();
    fetchSupplier();
  }, []);
  return (
    <Create {...props}>
      <SimpleForm>
        {/**select input for item name */}
        {/**<TextField source="itemName" label="Product Name" /> */}
        <SelectInput
          label="Product Name"
          source="item_id"
          choices={item.map((data) => ({ id: data.id, name: data.name }))}
        />
        <NumberInput source="price" label="Price (ETB)" />
        <NumberInput source="stockin" label="Purchase" />
        <SelectInput
          label="Supplier"
          source="supplier_id"
          choices={supplier.map((data) => ({ id: data.id, name: data.name }))}
        />
        <DateInput source="expire_date" label="Expire Date" />
        <TextInput
          multiline
          rows={4}
          source="description"
          label="Description"
        />
        <TextInput source="note" label="Note" />
      </SimpleForm>
    </Create>
  );
};

export { Products, ShowProduct, EditProduct, CreateProduct };

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
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import axios from "axios";
import { Grid } from "@mui/material";
import NumberInputStyle from "../../../helpers/functions/numberInputStyle";

const Items = () => {
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
      <List actions={<PostListActions />}>
        <DatagridConfigurable
          bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}
          rowClick="show"
        >
          <TextField source="name" label="Product Name" />
          <TextField source="unit" label="Unit" />
          <NumberField source="low_level" label="Low Level Quantity" />
          <TextField source="category" label="Product Category" />
          <TextField source="type" label="Product Type" />
          <TextField source="description" label="Product Description" />
          <ImageField
            source="image" // The field in your data that contains the image filename
            label="Image"
          />
          <EditButton />
        </DatagridConfigurable>
      </List>
    </div>
  );
};

const ShowAnItem = (props) => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const [items, setItems] = useState([]);

  const fetchItems = () => {
    axios
      .get(`${serverHost}/items`)
      .then((resp) => {
        console.log("response", resp);
        const data = resp.data;
        console.log("her eis hte data of article", data);
        setItems(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <Show {...props}>
        <SimpleShowLayout>
          <TextField source="name" label="Product Name" />
          <NumberField source="low_level" label="Low Level Quantity" />
          <TextField source="category" label="Product Category" />
          <TextField source="type" label="Product Type" />
          <ImageField
            source="image" // The field in your data that contains the image filename
            label="Image"
          />
        </SimpleShowLayout>
      </Show>
    </div>
  );
};

const CreateItem = (props) => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);

  const userId = JSON.parse(localStorage.getItem("userId")).userId;

  // Function to handle the form submission
  const handleSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("unit", data.unit);
    formData.append("serverHost", data.serverHost);
    formData.append("category_id", data.category_id);
    formData.append("type_id", data.type_id);
    formData.append("low_level", data.low_level);
    formData.append("description", data.description);
    formData.append("userId", userId);

    console.log("Form data while creating:", formData);

    if (data.image && data.image.rawFile) {
      formData.append("image", data.image.rawFile);
    }

    const gettoken = localStorage.getItem("token");
    const token = gettoken ? JSON.parse(gettoken).token : null;

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await fetch(`${serverHost}/items`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        redirect("list", "items");
      } else {
        console.error("Error uploading article:", await response.json());
      }
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

  const fetchCategory = () => {
    const gettoken = localStorage.getItem("token");
    const token = JSON.parse(gettoken).token;

    axios
      .get(`${serverHost}/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        const data = resp.data;
        console.log(data);
        setCategory(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchType = () => {
    const gettoken = localStorage.getItem("token");
    const token = JSON.parse(gettoken).token;

    axios
      .get(`${serverHost}/productType`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        const data = resp.data;
        console.log(data);
        setType(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchCategory();
    fetchType();
  }, []);

  return (
    <Create {...props}>
      <SimpleForm onSubmit={handleSubmit}>
        <TextInput
          source="serverHost"
          defaultValue={serverHost}
          style={{ display: "none" }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <AutocompleteInput
              label="Product Category"
              source="category_id"
              choices={category.map((data) => ({
                id: data.id,
                name: data.name,
              }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AutocompleteInput
              label="Product Type"
              source="type_id"
              choices={type.map((data) => ({ id: data.id, name: data.name }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="name" label="Product Name" required fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="unit" label="Measurement Unit" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <NumberInput
              source="low_level"
              label="Low Level Quantity"
              sx={NumberInputStyle}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextInput
              source="description"
              label="Product Description"
              sx={NumberInputStyle}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Image Upload Field */}
        <ImageInput
          source="image"
          label="Article Image"
          accept="image/*"
          required
        >
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};

const EditItem = (props) => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const redirect = useRedirect();
  const [oldImage, setOldImage] = useState("");
  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);
  const fetchCategory = () => {
    const gettoken = localStorage.getItem("token");
    const token = JSON.parse(gettoken).token;

    axios
      .get(`${serverHost}/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        const data = resp.data;
        console.log(data);
        setCategory(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchType = () => {
    const gettoken = localStorage.getItem("token");
    const token = JSON.parse(gettoken).token;

    axios
      .get(`${serverHost}/productType`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        const data = resp.data;
        console.log(data);
        setType(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchCategory();
    fetchType();
  }, []);
  // Function to handle the form submission
  const handleSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("unit", data.unit);
    formData.append("serverHost", data.serverHost);
    formData.append("category_id", data.category_id);
    formData.append("type_id", data.type_id);
    formData.append("low_level", data.low_level);
    formData.append("oldImage", oldImage);
    formData.append("description", data.description);

    console.log("Form Data", formData);

    if (data.image && data.image.rawFile) {
      formData.append("image", data.image.rawFile); // Extract the actual file
    }

    const gettoken = localStorage.getItem("token");
    const token = gettoken ? JSON.parse(gettoken).token : null;

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await fetch(`${serverHost}/items/${data.id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        redirect("list", "items"); // Redirect to articles list after successful update
      } else {
        console.error("Error updating article:", await response.json());
      }
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  // Custom component to display the existing image
  const ExistingImageField = () => {
    const record = useRecordContext(); // Get the current record
    if (!record || !record.image) return null; // If no record or no image, return nothing
    setOldImage(record.image); // Set the old image URL

    return (
      <div>
        <p>Previous Image:</p>
        <img
          src={`${record.image}`} // Construct the full image URL
          alt="Existing Article Image"
          className="h-32 md:h-36  w-36 md:w-44 object-cover"
        />
      </div>
    );
  };

  return (
    <Edit {...props}>
      <SimpleForm onSubmit={handleSubmit}>
        <TextField
          source="oldImage"
          defaultValue={oldImage}
          style={{ display: "none" }}
        />
        <TextInput
          source="serverHost"
          defaultValue={serverHost}
          style={{ display: "none" }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <AutocompleteInput
              label="Product Category"
              source="category_id"
              choices={category.map((data) => ({
                id: data.id,
                name: data.name,
              }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AutocompleteInput
              label="Product Type"
              source="type_id"
              choices={type.map((data) => ({ id: data.id, name: data.name }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="name" label="Product Name" required fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput
              source="unit"
              label="Measurement Unit"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <NumberInput
              source="low_level"
              label="Low Level Quantity"
              sx={NumberInputStyle}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              source="description"
              label="Product Description"
              sx={NumberInputStyle}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Display the existing image */}
        <ExistingImageField />

        {/* Image Upload Field */}
        <ImageInput source="image" label="Article Image" accept="image/*">
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </Edit>
  );
};

export { Items, CreateItem, EditItem, ShowAnItem };

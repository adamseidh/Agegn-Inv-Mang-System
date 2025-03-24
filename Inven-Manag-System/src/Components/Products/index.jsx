import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
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
    DateInput,
} from "react-admin";




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
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER
    const notify = useNotify();
    const refresh = useRefresh();
    const [item, setItem] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [category, setCategory] = useState([]);

    const fetchCategory = () => {
        axios.get(`${serverHost}/category`).then(resp => {
            const data = resp.data;
            setCategory(data);
        }).catch((error) => {
            console.error(error)
        })
    }
    useEffect(() => {
        fetchCategory();
    },
        [])

    const ProductsFilter = [
        <TextInput label="Search: Product Name" source="q" alwaysOn key="search" />,
        <SelectInput
            label="Category Name"
            source="category_id"
            choices={category.map((data) => (
                { id: data.id, name: data.name }
            ))}
        />
    ];
    const PostListActions = () => (
        <TopToolbar>
            <SelectColumnsButton />

            <CreateButton />
            <FilterButton />
            <ExportButton />


        </TopToolbar>
    );
    return (
        <div>
            <List
                filters={ProductsFilter}
                actions={<PostListActions />} >
                <DatagridConfigurable rowClick="show">
                    <TextField source="id" label="Product Id" />
                    <TextField source="itemName" label="Product Name" />
                    <TextField source="categoryName" label="Category Name" />
                    <NumberField
                        source="price"
                        label="Price (ETB)"
                        options={{ style: 'currency', currency: 'ETB' }}
                    />
                    <TextField source="stockin" label="Purchase" />
                    <TextField source="stockout" label="Sold" />
                    <TextField source="available_stock" label="Available" />
                    <DateField source="expire_date" label="Expire Date" options={{ year: 'numeric', month: 'short', day: 'numeric' }} />

                </DatagridConfigurable>
            </List>
        </div>
    );
};



const EditProduct = (props) => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER
    const [item, setItem] = useState([]);
    const [supplier, setSupplier] = useState([]);


    const fetchItems = () => {
        axios.get(`${serverHost}/items`).then(resp => {
            const data = resp.data;
            console.log(data)
            setItem(data);
        }).catch((error) => {
            console.error(error)
        })
    }
    const fetchSupplier = () => {
        axios.get(`${serverHost}/supplier`).then(resp => {
            const data = resp.data;
            console.log(data)
            setSupplier(data);
        }).catch((error) => {
            console.error(error)
        })
    }



    useEffect(() => {
        fetchItems();
        fetchSupplier();
    },
        [])
    return (
        <Edit {...props}>
            <SimpleForm>
                {/**select input for item name */}{/**<TextField source="itemName" label="Product Name" /> */}
                <SelectInput
                    label="Product Name"
                    source="item_id"
                    choices={item.map((data) => (
                        { id: data.id, name: data.name }
                    ))}
                />
                <NumberInput source="price" label="Price (ETB)" />
                <NumberInput source="stockin" label="Purchase" />
                <NumberInput source="stockout" label="Sold" />
                <SelectInput
                    label="Supplier"
                    source="supplier_id"
                    choices={supplier.map((data) => (
                        { id: data.id, name: data.name }
                    ))}
                />
                <DateInput source="expire_date" label="Expire Date" />
                <TextInput multiline rows={4} source="description" label="Description" />
                <TextInput source="note" label="Note" />


            </SimpleForm>
        </Edit>
    )
};

const ShowProduct = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="Product Id" />
            <TextField source="itemName" label="Product Name" />
            <TextField source="categoryName" label="Category Name" />
            <NumberField
                source="price"
                label="Price (ETB)"
                options={{ style: 'currency', currency: 'ETB' }}
            />
            <TextField source="stockin" label="Purchase" />
            <TextField source="stockout" label="Sold" />
            <TextField source="available_stock" label="Available" />
            <TextField source="supplierName" label="Supplier" />
            <DateField source="expire_date" label="Expire Date" options={{ year: 'numeric', month: 'short', day: 'numeric' }} />
            <TextField source="description" label="Description" />
            <TextField source="note" label="Note" />
        </SimpleShowLayout>
    </Show>
);




const CreateProduct = (props) => {

    const serverHost = import.meta.env.VITE_REACT_APP_SERVER
    const [item, setItem] = useState([]);
    const [supplier, setSupplier] = useState([]);


    const fetchItems = () => {
        axios.get(`${serverHost}/items`).then(resp => {
            const data = resp.data;
            console.log(data)
            setItem(data);
        }).catch((error) => {
            console.error(error)
        })
    }


    const fetchSupplier = () => {
        axios.get(`${serverHost}/supplier`).then(resp => {
            const data = resp.data;
            console.log(data)
            setSupplier(data);
        }).catch((error) => {
            console.error(error)
        })
    }



    useEffect(() => {
        fetchItems();
        fetchSupplier();
    },
        [])
    return (
        <Create {...props}>
            <SimpleForm>
                {/**select input for item name */}{/**<TextField source="itemName" label="Product Name" /> */}
                <SelectInput
                    label="Product Name"
                    source="item_id"
                    choices={item.map((data) => (
                        { id: data.id, name: data.name }
                    ))}
                />
                <NumberInput source="price" label="Price (ETB)" />
                <NumberInput source="stockin" label="Purchase" />
                <SelectInput
                    label="Supplier"
                    source="supplier_id"
                    choices={supplier.map((data) => (
                        { id: data.id, name: data.name }
                    ))}
                />
                <DateInput source="expire_date" label="Expire Date" />
                <TextInput multiline rows={4} source="description" label="Description" />
                <TextInput source="note" label="Note" />

            </SimpleForm>
        </Create>
    );
};


export { Products, ShowProduct, EditProduct, CreateProduct };

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



const Stock = () => {

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

    const StockFilter = [
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
            <FilterButton />
            <ExportButton />


        </TopToolbar>
    );
    return (
        <div>
            <List filters={StockFilter} actions={<PostListActions />}>
                <DatagridConfigurable>
                    <TextField source="name" label="Product Name" />
                    <TextField source="categoryName" label="Category Name" />
                    <NumberField
                        source="price"
                        label="Price (ETB)"
                        options={{ style: 'currency', currency: 'ETB' }}
                        sx={{ textAlign: 'left' }}
                    />
                    <TextField source="available_stock" label="Available" />
                </DatagridConfigurable>
            </List>

        </div>
    );
};




export { Stock };

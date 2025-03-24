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



const Items = () => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER
    const notify = useNotify();
    const refresh = useRefresh();
    const [item, setItem] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [category, setCategory] = useState([]);

    const AddItem = (event) => {
        event.preventDefault();
        axios.post(`${serverHost}/addItem`, { item, categoryId }).then(
            notify('Item added'),
            refresh(),
            setItem(''),
            setCategoryId('')
        ).catch((error) => {
            notify('failed to add')
        });



    }

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
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div >
                    <form className="mt-12 bg-white p-4 rounded-md shadow-md shadow-gray-400"
                        onSubmit={AddItem}>
                        <h2 className="text-primaryColor text-xl font-semibold"> Add Item</h2>
                        <div className="mt-2">
                            <FormControl className="w-full">
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={categoryId}
                                    label="Category"
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                >

                                    {
                                        category.map((data, index) => (
                                            <MenuItem key={index} value={data.id}>{data.name}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
                        </div>
                        <input className="primaryInput"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            placeholder="Item Name" required />
                        <button className="primaryBtn">Submit</button>
                    </form>
                </div>
                <div className="col-span-3">
                    <List  >
                        <DatagridConfigurable rowClick="edit">
                            <TextField source="name" label="Item Name" />
                            <TextField source="categoryName" label="Category Name" />
                            <EditButton />
                        </DatagridConfigurable>
                    </List>
                </div>
            </div>
        </div>
    );
};



const EditItem = (props) => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER
    const [categoryId, setCategoryId] = useState('')
    const [category, setCategory] = useState([]);


    const fetchCategory = () => {
        axios.get(`${serverHost}/category`).then(resp => {
            const data = resp.data;
            console.log(data)
            setCategory(data);
        }).catch((error) => {
            console.error(error)
        })
    }
    useEffect(() => {
        fetchCategory();
    },
        [])
    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput source="name" label="Item Name" />
                <SelectInput
                    label="Category"
                    source="category_id"
                    choices={category.map((data) => (
                        { id: data.id, name: data.name }
                    ))}
                />
            </SimpleForm>
        </Edit>
    )
};

const ShowItem = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="name" label="Item" />
            <TextField source="categoryName" label="Category" />

        </SimpleShowLayout>
    </Show>
);

export { Items, ShowItem, EditItem };

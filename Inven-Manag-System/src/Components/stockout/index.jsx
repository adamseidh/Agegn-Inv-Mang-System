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


const Stockout = () => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER
    const notify = useNotify();
    const refresh = useRefresh();
    const [itemId, setItemId] = useState('')
    const [customerId, setCustomerId] = useState('')
    const [quantity, setQuantity] = useState('')
    const [items, setItems] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [category, setCategory] = useState([]);


    const AddStockout = (event) => {
        event.preventDefault();
        axios.post(`${serverHost}/addStockout`, { quantity, itemId, customerId }).then(
            notify('Stockout Saved'),
            refresh(),
            setItemId(''),
            setCustomerId(''),
            setQuantity('')
        ).catch((error) => {
            notify('failed to add')
        });



    }

    const fetchItems = () => {
        axios.get(`${serverHost}/items`).then(resp => {
            const data = resp.data;
            setItems(data);
        }).catch((error) => {
            console.error(error)
        })
    }
    const fetchCustomers = () => {
        axios.get(`${serverHost}/customers`).then(resp => {
            const data = resp.data;
            setCustomers(data);
        }).catch((error) => {
            console.error(error)
        })
    }

    useEffect(() => {
        fetchItems();
        fetchCustomers();
    },
        [])



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

    const StockoutFilter = [
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div >
                <form className="mt-12 bg-white p-4 rounded-md shadow-md shadow-gray-400"
                    onSubmit={AddStockout}>
                    <h2 className="text-primaryColor text-xl font-semibold">Product Sell Form</h2>
                    <div className="mt-2">
                        <FormControl className="w-full">
                            <InputLabel id="demo-simple-select-label">Product</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={itemId}
                                label="Product"
                                onChange={(e) => setItemId(e.target.value)}
                                required
                            >

                                {
                                    items.map((data, index) => (
                                        <MenuItem key={index} value={data.id}>{data.name}</MenuItem>
                                    ))
                                }

                            </Select>
                        </FormControl>
                    </div>

                    <div className="mt-2">
                        <FormControl className="w-full">
                            <InputLabel id="demo-simple-select-label">Customer</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={customerId}
                                label="Customer"
                                onChange={(e) => setCustomerId(e.target.value)}
                                required
                            >

                                {
                                    customers.map((data, index) => (
                                        <MenuItem key={index} value={data.id}>{data.name}</MenuItem>
                                    ))
                                }

                            </Select>
                        </FormControl>
                    </div>
                    <input className="primaryInput"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Quantity"
                        type="number" required />
                    <button className="primaryBtn">Submit</button>
                </form>
            </div>
            <div className="col-span-3">
                <List
                    filters={StockoutFilter}
                    actions={<PostListActions />} >
                    <DatagridConfigurable rowClick="show">
                        <TextField source="name" label="Product Name" />
                        <TextField source="categoryName" label="Category Name" />
                        <TextField source="quantity" label="Quantity" />
                        <TextField source="customerName" label="Customer" />

                    </DatagridConfigurable>
                </List>
            </div>
        </div>
    );
};



const EditStockout = (props) => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER
    const [items, setItems] = useState([]);
    const [customers, setCustomers] = useState([]);



    const fetchItems = () => {
        axios.get(`${serverHost}/items`).then(resp => {
            const data = resp.data;
            setItems(data);
        }).catch((error) => {
            console.error(error)
        })
    }
    const fetchCustomers = () => {
        axios.get(`${serverHost}/customers`).then(resp => {
            const data = resp.data;
            setCustomers(data);
        }).catch((error) => {
            console.error(error)
        })
    }

    useEffect(() => {
        fetchItems();
        fetchCustomers();
    },
        [])
    return (
        <Edit {...props}>
            <SimpleForm>
                {/**select input for item name */}{/**<TextField source="itemName" label="Product Name" /> */}
                <SelectInput
                    label="Product Name"
                    source="item_id"
                    choices={items.map((data) => (
                        { id: data.id, name: data.name }
                    ))}
                />
                <SelectInput
                    label="Customer"
                    source="customer_id"
                    choices={customers.map((data) => (
                        { id: data.id, name: data.name }
                    ))}
                />
                <NumberInput source="quantity" label="Quantity" />




            </SimpleForm>
        </Edit>
    )
};

const showStockout = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="itemName" label="Product Name" />
            <TextField source="categoryName" label="Category Name" />
            <TextField source="quantity" label="Quantity" />

        </SimpleShowLayout>
    </Show>
);

export { Stockout, showStockout, EditStockout };

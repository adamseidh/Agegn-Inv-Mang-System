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



const Category = () => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER
    const notify = useNotify();
    const refresh = useRefresh();
    const [category, setCategory] = useState('')

    const AddCategory = (event) => {
        event.preventDefault();
        const gettoken = localStorage.getItem("token");
        const token = JSON.parse(gettoken).token;
        axios.post(`${serverHost}/addCategory`, { category }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(
            notify('Category added'),
            refresh(),
            setCategory('')).catch((error) => {
                notify(error)
            });



    }
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div >
                    <form className="mt-12 bg-white p-4 rounded-md shadow-md shadow-gray-400" onSubmit={AddCategory}>
                        <h2 className="text-primaryColor text-xl font-semibold"> Add category</h2>
                        <input className="primaryInput"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Category Name" required />
                        <button className="primaryBtn">Submit</button>
                    </form>
                </div>
                <div className="col-span-3">
                    <List  >
                        <DatagridConfigurable rowClick="edit">
                            <TextField source="name" label="Category Name" />
                            <EditButton />
                        </DatagridConfigurable>
                    </List>
                </div>
            </div>
        </div>
    );
};



const EditCategory = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" label="Category Name" />
        </SimpleForm>
    </Edit>
);

const ShowCategory = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="name" label="Category" />
        </SimpleShowLayout>
    </Show>
);

export { Category, ShowCategory, EditCategory };

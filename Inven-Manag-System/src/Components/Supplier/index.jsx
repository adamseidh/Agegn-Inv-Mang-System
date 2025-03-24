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
    BulkDeleteButton,
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



const Supplier = () => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER
    const notify = useNotify();
    const refresh = useRefresh();
    const [supplier, setSupplier] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [website, setWebsite] = useState('')

    const AddSupplier = (event) => {
        event.preventDefault();
        axios.post(`${serverHost}/addSupplier`, { supplier, phone, email, website }).then(
            notify('Supplier added'),
            refresh(),
            setSupplier(''),
            setPhone(''),
            setEmail(''),
            setWebsite('')
        ).catch((error) => {
            notify(error)
        });



    }
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div >
                    <form className="mt-12 bg-white p-4 rounded-md shadow-md shadow-gray-400" onSubmit={AddSupplier}>
                        <h2 className="text-primaryColor text-xl font-semibold"> Add Supplier</h2>
                        <input className="primaryInput"
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            placeholder="Supplier" required />
                        <input className="primaryInput"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone" />
                        <input className="primaryInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email" />
                        <input className="primaryInput"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="Website" />

                        <button className="primaryBtn">Submit</button>
                    </form>
                </div>
                <div className="col-span-3">
                    <List  >
                        <DatagridConfigurable rowClick="edit" bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}>
                            <TextField source="name" label="Suppliers" />
                            <TextField source="phone" label="Phone" />
                            <TextField source="email" label="Email" />
                            <TextField source="website" label="Website" />
                            <EditButton />
                        </DatagridConfigurable>
                    </List>
                </div>
            </div>
        </div>
    );
};



const EditSupplier = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" label="Supplier" />
            <TextInput source="phone" label="Phone" />
            <TextInput source="email" label="Email" />
            <TextInput source="website" label="Website" />
        </SimpleForm>
    </Edit>
);

const ShowSupplier = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="name" label="Supplier" />
            <TextField source="phone" label="Phone" />
            <TextField source="email" label="Email" />
            <TextField source="website" label="Website" />
        </SimpleShowLayout>
    </Show>
);

export { Supplier, ShowSupplier, EditSupplier };

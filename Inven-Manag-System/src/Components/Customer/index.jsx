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



const Customers = () => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER
    const notify = useNotify();
    const refresh = useRefresh();
    const [customer, setCustomer] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')

    const AddCustomer = (event) => {
        event.preventDefault();
        axios.post(`${serverHost}/addCustomer`, { customer, phone, email }).then(
            notify('Customer added'),
            refresh(),
            setCustomer(''),
            setPhone(''),
            setEmail(''),
        ).catch((error) => {
            notify(error)
        });



    }
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div >
                    <form className="mt-12 bg-white p-4 rounded-md shadow-md shadow-gray-400" onSubmit={AddCustomer}>
                        <h2 className="text-primaryColor text-xl font-semibold"> Add Customer</h2>
                        <input className="primaryInput"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            placeholder="Customer" required />
                        <input className="primaryInput"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone" />
                        <input className="primaryInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email" />
                        <input className="primaryInput"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            placeholder="Region" required />
                        <input className="primaryInput"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Zone" />
                        <input className="primaryInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Wereda/City" />
                        <input className="primaryInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Kebele" />
                        <input className="primaryInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="TIN" />
                        <input className="primaryInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Letter No." />


                        <button className="primaryBtn">Submit</button>
                    </form>
                </div>
                <div className="col-span-3">
                    <List  >
                        <DatagridConfigurable bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />} rowClick="edit">
                            <TextField source="name" label="Customers" />
                            <TextField source="phone" label="Phone" />
                            <TextField source="email" label="Email" />
                            <EditButton />
                        </DatagridConfigurable>
                    </List>
                </div>
            </div>
        </div>
    );
};



const EditCustomer = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" label="Customer" />
            <TextInput source="phone" label="Phone" />
            <TextInput source="email" label="Email" />
        </SimpleForm>
    </Edit>
);

const ShowCustomer = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="name" label="Customer" />
            <TextField source="phone" label="Phone" />
            <TextField source="email" label="Email" />
        </SimpleShowLayout>
    </Show>
);

export { Customers, ShowCustomer, EditCustomer };

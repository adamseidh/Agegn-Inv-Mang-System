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
} from "react-admin";




// Filter component for the list
const FilterComplain = (props) => (

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



const Complains = () => {
    const dataProvider = useDataProvider();

    const fetchData = async () => {
        try {
            const { data } = await dataProvider.getList('complains', {
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'ASC' },
                filter: {},
            });
            console.log('Complains data:', data); // Log the data to console
        } catch (error) {
            console.error('Error fetching complains data:', error);
        }
    };
    return (
        <div>
            <List filters={<FilterComplain />}  >
                {/* Use DatagridConfigurable to enable column toggling */}
                <DatagridConfigurable rowClick="show">
                    <TextField source="name" label="Complainer Name" />
                    <TextField source="trader_phone" label="Phone" />
                    <TextField source="subject" label="Subject" />
                    <TextField source="detail" label="Detail" />
                    <TextField source="complain_status" label="Complain Status" />
                    <DateField source="complain_date" label="Date" />
                </DatagridConfigurable>
            </List>
        </div>
    );
};



const EditComplain = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <SelectInput
                source="complain_status"
                label="Complain Status"
                choices={[
                    { id: "Replied", name: "Replied" },
                    { id: "Not Replied", name: "Not Replied" },
                ]}
            />
        </SimpleForm>
    </Edit>
);

const ComplainShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="name" label="Complainer Name" />
            <TextField source="trader_phone" label="Phone" />
            <TextField source="subject" label="Subject" />
            <TextField source="detail" label="Detail" />
            <TextField source="complain_status" label="Complain Status" />
            <DateField source="complain_date" showTime label="Date" />
        </SimpleShowLayout>
    </Show>
);

export { Complains, ComplainShow, EditComplain };

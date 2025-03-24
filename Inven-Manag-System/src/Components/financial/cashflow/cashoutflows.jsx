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



const CashOutflows = () => {
    const dataProvider = useDataProvider();

    const fetchData = async () => {
        try {
            const { data } = await dataProvider.getList('cashoutflows', {
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'ASC' },
                filter: {},
            });
            console.log('Income data:', data); // Log the data to console
        } catch (error) {
            console.error('Error fetching Income data:', error);
        }
    };
    return (
        <div>
            <List  >
                {/* Use DatagridConfigurable to enable column toggling */}
                <DatagridConfigurable rowClick="show">
                    <TextField source="reason" label="Reason" />
                    <NumberField source="amount" label="Amount" />
                </DatagridConfigurable>
            </List>
        </div>
    );
};



const CashoutflowsCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="reason" label="Reason" />
            <NumberInput source="amount" label="Amount" />
        </SimpleForm>
    </Create>
);



const EditCashOutflows = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="reason" label="Reason" />
            <NumberInput source="amount" label="Amount" />
        </SimpleForm>
    </Edit>
);

const CashOutShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="reason" label="Reason" />
            <NumberField source="amount" label="Amount" />
        </SimpleShowLayout>
    </Show>
);

export { CashOutflows, CashoutflowsCreate, CashOutShow, EditCashOutflows };

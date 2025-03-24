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



const Income = () => {
    const dataProvider = useDataProvider();

    const fetchData = async () => {
        try {
            const { data } = await dataProvider.getList('income', {
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
                    <TextField source="title" label="Title" />
                    <NumberField source="budget_plan" label="Budget Plan" />
                    <NumberField source="quartOne" label="Quarter-1" />
                    <NumberField source="quartTwo" label="Quarter-2" />
                    <NumberField source="quartThree" label="Quarter-3" />
                    <NumberField source="quartFour" label="Quarter-4" />
                </DatagridConfigurable>
            </List>
        </div>
    );
};



const IncomeCrate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" label="Title" />
            <NumberInput source="budget_plan" label="Budget Plan" />
            <NumberInput source="quartOne" label="Quarter-1" />
            <NumberInput source="quartTwo" label="Quarter-2" />
            <NumberInput source="quartThree" label="Quarter-3" />
            <NumberInput source="quartFour" label="Quarter-4" />
        </SimpleForm>
    </Create>
);



const EditIncome = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="title" label="Title" />
            <NumberInput source="budget_plan" label="Budget Plan" />
            <NumberInput source="quartOne" label="Quarter-1" />
            <NumberInput source="quartTwo" label="Quarter-2" />
            <NumberInput source="quartThree" label="Quarter-3" />
            <NumberInput source="quartFour" label="Quarter-4" />
        </SimpleForm>
    </Edit>
);

const IncomeShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="title" label="Title" />
            <NumberField source="budget_plan" label="Budget Plan" />
            <NumberField source="quartOne" label="Quarter-1" />
            <NumberField source="quartTwo" label="Quarter-2" />
            <NumberField source="quartThree" label="Quarter-3" />
            <NumberField source="quartFour" label="Quarter-4" />
        </SimpleShowLayout>
    </Show>
);

export { Income, IncomeCrate, IncomeShow, EditIncome };

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
  getMutationMode,
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

const OtherIncome = () => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const notify = useNotify();
  const refresh = useRefresh();
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");

  const AddOtherIncome = (event) => {
    event.preventDefault();
    const gettoken = localStorage.getItem("token");
    const token = JSON.parse(gettoken).token;
    axios
      .post(
        `${serverHost}/addOtherIncome`,
        { amount, source },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(
        notify("Other Income  added"),
        refresh(),
        setSource(""),
        setAmount("")
      )
      .catch((error) => {
        notify(error);
      });
  };
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div>
          <form
            className="mt-12 bg-white p-4 rounded-md shadow-md shadow-gray-400"
            onSubmit={AddOtherIncome}
          >
            <h2 className="text-primaryColor text-xl font-semibold">
              {" "}
              Add Other Income
            </h2>
            <input
              className="primaryInput"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Income Source"
              required
            />
            <input
              type="number"
              className="primaryInput"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount(ETB)"
              required
            />
            <button className="primaryBtn">Submit</button>
          </form>
        </div>
        <div className="col-span-3">
          <List>
            <DatagridConfigurable
              rowClick="edit"
              bulkActionButtons={
                <BulkDeleteButton mutationMode="pessimistic" />
              }
            >
              <TextField source="source" label="Income Source" />
              <NumberField source="amount" label="Amount" />
              <DateField source="createdAt" label="Created At" />
              <EditButton />
            </DatagridConfigurable>
          </List>
        </div>
      </div>
    </div>
  );
};

const EditOtherIncome = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="source" label="Income Source" />
      <NumberInput source="amount" label="Amount" />
    </SimpleForm>
  </Edit>
);

const showOtherIncome = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextInput source="source" label="Income Source" />
      <NumberInput source="amount" label="Amount" />{" "}
    </SimpleShowLayout>
  </Show>
);

export { OtherIncome, showOtherIncome, EditOtherIncome };

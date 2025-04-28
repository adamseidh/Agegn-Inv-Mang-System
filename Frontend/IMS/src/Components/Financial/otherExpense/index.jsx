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

const otherExpenses = () => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const notify = useNotify();
  const refresh = useRefresh();
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const userId = JSON.parse(localStorage.getItem("userId")).userId;
  const role = JSON.parse(localStorage.getItem("role")).role;

  const AddOtherExpense = (event) => {
    event.preventDefault();
    const gettoken = localStorage.getItem("token");
    const token = JSON.parse(gettoken).token;
    axios
      .post(
        `${serverHost}/addOtherExpenses`,
        { reason, amount, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(
        notify("Other Expense  added"),
        refresh(),
        setReason(""),
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
            onSubmit={AddOtherExpense}
          >
            <h2 className="text-primaryColor text-xl font-semibold">
              {" "}
              Add Other Expense
            </h2>
            <input
              className="primaryInput"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expsense  Reason"
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
          {role === "Supper Admin" && (
            <List>
              <DatagridConfigurable
                rowClick="edit"
                bulkActionButtons={
                  <BulkDeleteButton mutationMode="pessimistic" />
                }
              >
                <TextField source="reason" label="Expense Reason" />
                <NumberField source="amount" label="Amount" />
                <TextField source="createdBy" label="Created By" />
                <DateField source="createdAt" label="Created At" />
                <EditButton label="Edit" />
              </DatagridConfigurable>
            </List>
          )}
        </div>
      </div>
    </div>
  );
};

const EditOtherExpense = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="reason" label="Expense Reason" />
      <NumberInput source="amount" label="Amount" />
    </SimpleForm>
  </Edit>
);

export { otherExpenses, EditOtherExpense };

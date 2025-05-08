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
  ShowButton,
} from "react-admin";
import Permission from "../../../helpers/utils/permissions";

const OfficeExpenses = () => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const notify = useNotify();
  const refresh = useRefresh();
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const userId = JSON.parse(localStorage.getItem("userId")).userId;
  const role = JSON.parse(localStorage.getItem("role")).role;
  const { permission1, permission2, permission3 } = Permission(role);

  const AddOfficeExpense = (event) => {
    event.preventDefault();
    const gettoken = localStorage.getItem("token");
    const token = JSON.parse(gettoken).token;

    const getId = localStorage.getItem("userId"); // Get user id when the user logged in
    const userId = JSON.parse(getId).userId;

    console.log("userId", userId);

    axios
      .post(
        `${serverHost}/addOfficeExpenses`,
        { reason, amount, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(
        notify("Office Expense  added"),
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
            onSubmit={AddOfficeExpense}
          >
            <h2 className="text-primaryColor text-xl font-semibold">
              {" "}
              Add Office Expense
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
          {permission2 && (
            <List>
              <DatagridConfigurable
                rowClick="show"
                bulkActionButtons={
                  <BulkDeleteButton mutationMode="pessimistic" />
                }
              >
                <TextField source="reason" label="Expense Reason" />
                <NumberField source="amount" label="Amount" />
                <NumberField source="available_amount" label="Available" />
                <DateField source="created_at" label="Created At" />
                <EditButton label="Edit" />
                <ShowButton label="Detail" />
              </DatagridConfigurable>
            </List>
          )}
        </div>
      </div>
    </div>
  );
};

const EditOfficeExpense = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="reason" label="Expense Reason" />
      <NumberInput source="amount" label="Amount" />
    </SimpleForm>
  </Edit>
);

export { OfficeExpenses, EditOfficeExpense };

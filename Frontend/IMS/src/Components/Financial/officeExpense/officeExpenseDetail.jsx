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
  useRedirect,
} from "react-admin";

import { useParams } from "react-router-dom";
import Permission from "../../../helpers/utils/permissions";

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

const OfficeExpensesDetail = () => {
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const { id } = useParams();
  console.log("expense id", id);
  const notify = useNotify();
  const refresh = useRefresh();
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const userId = JSON.parse(localStorage.getItem("userId")).userId;
  const role = JSON.parse(localStorage.getItem("role")).role;
  const [officeExpSummary, setOfficeExpSummary] = useState([]);

  const { permission1, permission2, permission3 } = Permission(role);
  useEffect(() => {
    return () => {
      const dialogs = document.querySelectorAll(".MuiDialog-root");
      dialogs.forEach((dialog) => dialog.remove());
    };
  }, [officeExpSummary]);

  sessionStorage.setItem("officeExpId", id);

  const fetchOfficeExpenseSummary = () => {
    axios
      .get(`${serverHost}/officeExpenseSummary/${id}`)
      .then((resp) => {
        console.log("response", resp);
        const data = resp.data;
        setOfficeExpSummary(data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchOfficeExpenseSummary();
  }, []);

  const AddOfficeExpense = (event) => {
    event.preventDefault();
    const gettoken = localStorage.getItem("token");
    const token = JSON.parse(gettoken).token;
    axios
      .post(
        `${serverHost}/addOfficeExpenseDetail`,
        { reason, amount, office_expense_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(
        notify("Office Expense Detail added"),
        refresh(),
        fetchOfficeExpenseSummary(),
        setReason(""),
        setAmount("")
      )
      .catch((error) => {
        notify(error);
      });
  };

  const handleDeleteSuccess = () => {
    notify("Expense detail deleted successfully");
    refresh();
    fetchOfficeExpenseSummary(); // This will update the summary after deletion
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
              Office Expense Detail
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

          <div className="mt-6 bg-white p-4 rounded-md shadow-md shadow-gray-400">
            <h2 className="text-primaryColor text-xl font-semibold border-b border-b-primaryColor/50">
              {" "}
              Summary
            </h2>
            <p className="text-primaryColor mt-2">
              Assigend Amount: {officeExpSummary.amount}
            </p>
            <p className="text-red-600 mt-1">
              Used: {officeExpSummary.usedAmount}
            </p>
            <p className="text-green-600 mt-1">
              Available: {officeExpSummary.amount - officeExpSummary.usedAmount}
            </p>
          </div>
        </div>
        <div className="col-span-3 mb-6">
          {permission2 && (
            <List pagination={false}>
              <DatagridConfigurable
                rowClick="edit"
                bulkActionButtons={
                  <BulkDeleteButton
                    mutationMode="pessimistic"
                    mutationOptions={{
                      onSuccess: handleDeleteSuccess,
                    }}
                  />
                }
              >
                <TextField source="reason" label="Expense Reason" />
                <NumberField source="amount" label="Amount" />
                <DateField source="created_at" label="Created At" />
                <EditButton label="Edit" />
              </DatagridConfigurable>
            </List>
          )}
        </div>
      </div>
    </div>
  );
};

const EditOfficeExpenseDetail = (props) => {
  const officeExpId = sessionStorage.getItem("officeExpId");
  const redirect = useRedirect();
  const notify = useNotify();
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(
        `${serverHost}/officeExpenseDetails/${values.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            reason: values.reason,
            amount: values.amount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update expense");
      }

      notify("Expense updated successfully", { type: "success" });
      redirect("list", `officeExpenses/${officeExpId}/show`);
    } catch (error) {
      notify(error.message, { type: "error" });
    }
  };

  return (
    <Edit {...props}>
      <SimpleForm onSubmit={handleSubmit}>
        <TextInput source="reason" label="Expense Reason" />
        <NumberInput source="amount" label="Amount" />
      </SimpleForm>
    </Edit>
  );
};

export { OfficeExpensesDetail, EditOfficeExpenseDetail };

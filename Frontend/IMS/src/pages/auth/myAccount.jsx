import React from "react";
import {
  List,
  DatagridConfigurable,
  TextField,
  Edit,
  SimpleForm,
  Show,
  SimpleShowLayout,
  Filter,
  TextInput,
  TopToolbar,
  EditButton,
  PasswordInput,
  useNotify,
  useRedirect,
} from "react-admin";
import CryptoJS from "crypto-js";

// Custom filter with hidden icon
const MyFilter = (props) => (
  <Filter {...props}>
    <TextInput
      label="User ID"
      source="userId"
      alwaysOn
      style={{ display: "none" }} // Hide the input field's icon
    />
  </Filter>
);

const CustomActions = () => (
  <TopToolbar>{/* Add custom buttons here if needed */}</TopToolbar>
);

const MyAccount = () => {
  const getId = localStorage.getItem("userId"); // Get user id when the user logged in
  const userId = JSON.parse(getId).userId;

  const getRole = localStorage.getItem("role"); // Get user id when the user logged in
  const role = JSON.parse(getRole).role;

  console.log("userId", userId);

  return (
    <div>
      <List
        filters={<MyFilter />} // Use the filter component here
        filterDefaultValues={{ userId, role }} // Set default filter values
        actions={<CustomActions />} // Use the custom toolbar
        pagination={false}
      >
        <DatagridConfigurable rowClick="edit" bulkActionButtons={false}>
          <TextField source="name" label=" Name" />
          <TextField source="email" label="Email" />
          <TextField source="phone" label="Phone" />
          {/* Add Action column with Edit button */}
          <EditButton />
        </DatagridConfigurable>
      </List>
    </div>
  );
};

{
  /**
    const EditAccount = (props) => {
    const notify = useNotify(); // Hook to display notifications
    const redirect = useRedirect(); // Hook to redirect after successful update

    const transform = async (data) => {

        if (!data.oldPassword) {
            notify('Insert old Password to make change', { type: 'error' });
            throw new Error('Insert old Password to make change');
        }
        if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
            notify('New password and confirm password do not match', { type: 'error' });
            throw new Error('New password and confirm password do not match');
        }



        if (data.newPassword) {
            data.newPassword = CryptoJS.SHA256(data.newPassword).toString();// has the password befor send
        }

        if (data.oldPassword) {
            data.oldPassword = CryptoJS.SHA256(data.oldPassword).toString();// has the password befor send
        }




        // Remove confirmPassword from the data before sending it to the server
        delete data.confirmPassword;

        return data;
    };

    const onSuccess = () => {
        notify('Account updated successfully', { type: 'success' });
        redirect('/account'); // Redirect to the account page after successful update
    };

    return (
        <Edit {...props} transform={transform} mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <TextInput source="name" label="Name" />
                <TextInput source="email" label="Email" />
                <TextInput source="phone" label="Phone" />
                <TextInput source="password" style={{ display: "none" }} />
                <PasswordInput source="oldPassword" label="Old Password" />
                <PasswordInput source="newPassword" label="New Password" />
                <PasswordInput source="confirmPassword" label="Confirm Password" />
            </SimpleForm>
        </Edit>
    );
};
 */
}

const EditAccount = (props) => {
  const notify = useNotify(); // Hook to display notifications
  const redirect = useRedirect(); // Hook to redirect after successful update

  const transform = async (data) => {
    if (!data.oldPassword) {
      notify("Insert old Password to make change", { type: "error" });
      throw new Error("Insert old Password to make change");
    }

    if (
      data.newPassword &&
      data.confirmPassword &&
      data.newPassword !== data.confirmPassword
    ) {
      notify("New password and confirm password do not match", {
        type: "error",
      });
      throw new Error("New password and confirm password do not match");
    }

    if (data.newPassword) {
      data.newPassword = CryptoJS.SHA256(data.newPassword).toString(); // has the password befor send
    }

    if (data.oldPassword) {
      data.oldPassword = CryptoJS.SHA256(data.oldPassword).toString(); // has the password befor send
    }

    // Remove confirmPassword from the data before sending it to the server
    delete data.confirmPassword;

    return data;
  };

  return (
    <Edit {...props} transform={transform}>
      <SimpleForm>
        <TextInput source="name" label="Name" />
        <TextInput source="email" label="Email" />
        <TextInput source="phone" label="Phone" />
        <TextInput source="password" style={{ display: "none" }} />
        <PasswordInput source="oldPassword" label="Old Password" />
        <PasswordInput source="newPassword" label="New Password" />
        <PasswordInput source="confirmPassword" label="Confirm Password" />
      </SimpleForm>
    </Edit>
  );
};

const ShowAccount = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="name" label=" Name" />
      <TextField source="email" label="Email" />
      <TextField source="phone" label="Phone" />
    </SimpleShowLayout>
  </Show>
);

export { MyAccount, EditAccount, ShowAccount };

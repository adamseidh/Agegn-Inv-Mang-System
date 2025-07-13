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
  FilterButton,
  SelectInput,
  BulkDeleteButton,
} from "react-admin";
import CryptoJS from "crypto-js";
import { StatusField } from "../shared/StatusField";
import TruncatedTextField from "../shared/TruncatedTextField";

const MessageFilter = [
  //<TextInput label="Search: TIN, Phone, Name" source="q" alwaysOn key="search" />,
  <SelectInput
    label="Message Status"
    source="message_status"
    choices={[
      { id: "UnSeen", name: "UnSeen" },
      { id: "Seen", name: "Seen" },
    ]}
    key="message_status"
  />,
];

const CustomActions = () => (
  <TopToolbar>
    {/* Add custom buttons here if needed */}
    <FilterButton />
  </TopToolbar>
);

const Messages = () => {
  return (
    <div>
      <List
        actions={<CustomActions />} // Use the custom toolbar
        pagination={false}
        filters={MessageFilter}
      >
        <DatagridConfigurable
          rowClick="show"
          bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}
        >
          <TextField source="name" label=" Sender Name" />
          <TextField source="phone" label="Sender Phone" />
          <TextField source="email" label="Sender Email" />
          <TruncatedTextField source="message_content" label="Message Content" />
          <StatusField source="message_status" />
          {/* Add Action column with Edit button */}
        </DatagridConfigurable>
      </List>
    </div>
  );
};

const ShowMessage = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="name" label=" Sender Name" />
        <TextField source="phone" label="Sender Phone" />
        <TextField source="email" label="Sender Email" />
        <TextField source="message_content" label="Message Content" />
      </SimpleShowLayout>
    </Show>
  );
};

export { Messages, ShowMessage };

// MyLayout.jsx
import { Layout } from "react-admin";
import CustomMenu from "../Components/CustomeMenu";
import MyAppBar from "./AppBar";
import { useEffect, useState } from "react";
import Permission from "../helpers/utils/permissions";

const MyLayout = (props) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUserId && storedRole && storedToken) {
      const parsedRole = JSON.parse(storedRole).role;

      setRole(parsedRole);
    }
  }, []);
  const { permission1, permission2, permission3 } = Permission(role);

  return (
    <Layout
      {...props}
      appBar={permission1 === true ? MyAppBar : undefined}
      menu={(menuProps) => <CustomMenu {...menuProps} />}
    />
  );
};

export default MyLayout;

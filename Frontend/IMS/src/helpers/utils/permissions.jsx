//users permisison
///

////

const Permission = (role) => {
  const permission1 = ["Supper Admin", "Admin", "Technical Manager"].includes(
    role
  ); //overall access
  const permission2 = [
    "Supper Admin",
    "Admin",
    "Technical Manager",
    "Sales",
    "Finance Manager",
    "Finance",
  ].includes(role); // prices
  const permission3 = [
    "Supper Admin",
    "Admin",
    "Technical Manager",
    "Store Manager",
    "Store Man",
  ].includes(role); //stock

  return { permission1, permission2, permission3 };
};

export default Permission;

import React, { useState, useEffect } from 'react';
import DollarIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from "@mui/icons-material/Group"; // Icon for Traders
import CardWithIcon from './CardWithIcon';
import { useDataProvider } from 'react-admin';
import RestoreFromTrashSharpIcon from '@mui/icons-material/RestoreFromTrashSharp';
import ViewListIcon from '@mui/icons-material/ViewList';
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';



export const TotalProductsCard = (props) => {
    const [totalProducts, setTotalProducts] = useState(0);
    const dataProvider = useDataProvider();

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const { data } = await dataProvider.getList('products', {
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });


                const totalData = data.length || 'None';
                setTotalProducts(totalData);
            } catch (error) {
                console.error('Error fetching  data:', error);
            }
        };

        fetchdata();
    }, [dataProvider]);
    return (
        <CardWithIcon
            icon={ViewListIcon}
            title="Total Products"
            subtitle={totalProducts}
        />
    );
};



export const TotalSuppliersCard = (props) => {
    const [totalSuppliers, setTotalSuppliers] = useState(0);
    const dataProvider = useDataProvider();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await dataProvider.getList('supplier', {
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });


                const totalData = data.length || 'None';
                setTotalSuppliers(totalData);
            } catch (error) {
                console.error('Error fetching  data:', error);
            }
        };

        fetchData();
    }, [dataProvider]);

    return (
        <CardWithIcon
            icon={SendAndArchiveIcon}
            title="Total Suppliers"
            subtitle={totalSuppliers}
        />
    );
};


export const TotalCustomersCard = (props) => {
    const [totalCustomers, setTotalCustomers] = useState(0);
    const dataProvider = useDataProvider();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await dataProvider.getList('customers', {
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });


                const totalData = data.length || 'None';
                setTotalCustomers(totalData);
            } catch (error) {
                console.error('Error fetching  data:', error);
            }
        };

        fetchData();
    }, [dataProvider]);
    return (
        <CardWithIcon
            icon={GroupIcon}
            title="Total Customers"
            subtitle={totalCustomers}
        />
    );
};



export const ExpiredProducts = (props) => {
    const [expiredProducts, setExpiredProducts] = useState(0);
    const dataProvider = useDataProvider();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await dataProvider.getList('projects', {
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });


                const totalData = data.length || 'None';
                setExpiredProducts(totalData);
            } catch (error) {
                console.error('Error fetching  data:', error);
            }
        };

        fetchData();
    }, [dataProvider]);

    return (
        <CardWithIcon
            icon={RestoreFromTrashSharpIcon}
            title="Expired Products"
            subtitle={'None'}
        />
    );
};


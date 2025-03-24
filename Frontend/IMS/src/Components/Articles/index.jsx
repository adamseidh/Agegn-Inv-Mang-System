import React, { useEffect, useState } from "react";
import {
    List,
    Datagrid,
    TextField,
    ImageInput,
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
    Button,
    FileInput,
    FileField,
    EditButton,
    BulkDeleteButton,
    useRedirect,
    DateField,
    DateInput,
    RichTextField,
    ImageField,
    useDataProvider,
    useRecordContext,
} from "react-admin";
import { RichTextInput } from 'ra-input-rich-text';
import axios from 'axios';


const Articles = () => {

    const PostListActions = () => (
        <TopToolbar>
            {/**<SelectColumnsButton /> */}
            {/**<FilterButton /> */}
            <CreateButton />
            {/** <ExportButton /> */}


        </TopToolbar>
    );

    return (
        <div>
            <List
                actions={<PostListActions />}
            >
                <DatagridConfigurable
                    bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />} rowClick="show">
                    <TextField source="title" label="Title" />

                    <RichTextField source="description" label="Description" />
                    <ImageField
                        source="image" // The field in your data that contains the image filename
                        label="Image"

                    />
                    <DateField source="publish_date" label="Date" />
                </DatagridConfigurable>
            </List>
        </div>
    );
};

const ShowAnArticle = (props) => {

    const serverHost = import.meta.env.VITE_REACT_APP_SERVER
    const [articles, setArticles] = useState([]);


    const fetchArticles = () => {
        axios.get(`${serverHost}/articles`).then(resp => {
            console.log('response', resp)
            const data = resp.data;
            console.log('her eis hte data of article', data)
            setArticles(data);
        }).catch((error) => {
            console.error(error)
        })
    }
    useEffect(() => {
        fetchArticles();
    },
        [])

    console.log('fetched articles.', articles)
    return (


        <div>
            <Show {...props}>
                <SimpleShowLayout>
                    <TextField source="title" label="Title" />
                    <RichTextField source="description" label="Description" />
                    <DateField source="publish_date" label="Date" />
                    <ImageField
                        source="image" // The field in your data that contains the image filename
                        label="Image"

                    />
                </SimpleShowLayout>
            </Show>

            <div className="border-2 p-6 m-3" dangerouslySetInnerHTML={{ __html: articles }} />


        </div>
    )
}

const CreateArticle = (props) => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
    const redirect = useRedirect();
    const dataProvider = useDataProvider();

    // Function to handle the form submission
    const handleSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("serverHost", data.serverHost);
        formData.append("description", data.description);
        formData.append("publish_date", data.publish_date);

        console.log('Form data while creating:', formData);

        if (data.image && data.image.rawFile) {
            formData.append("image", data.image.rawFile);
        }

        const gettoken = localStorage.getItem("token");
        const token = gettoken ? JSON.parse(gettoken).token : null;

        if (!token) {
            console.error("No authentication token found");
            return;
        }

        try {
            const response = await fetch(`${serverHost}/articles`, {
                method: 'POST',
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                redirect("list", "articles");
            } else {
                console.error('Error uploading article:', await response.json());
            }
        } catch (error) {
            console.error("Error creating article:", error);
        }
    };



    return (
        <Create {...props}>
            <SimpleForm onSubmit={handleSubmit}>
                <TextInput source="serverHost" defaultValue={serverHost} style={{ display: "none" }} />
                <TextInput source="title" label="Article Title" required />
                <DateInput source="publish_date" label="Updated Date" defaultValue={new Date().toISOString().split('T')[0]} required />
                <RichTextInput source="description" label="Article" required />

                {/* Image Upload Field */}
                <ImageInput source="image" label="Article Image" accept="image/*">
                    <ImageField source="src" title="title" />
                </ImageInput>
            </SimpleForm>
        </Create>
    );
};



const EditArticle = (props) => {
    const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
    const redirect = useRedirect();
    const [oldImage, setOldImage] = useState('');

    // Function to handle the form submission
    const handleSubmit = async (data) => {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("serverHost", data.serverHost);
        formData.append("description", data.description);
        formData.append("publish_date", data.publish_date);
        formData.append("oldImage", oldImage);

        console.log('Form Data', formData)

        if (data.image && data.image.rawFile) {
            formData.append("image", data.image.rawFile); // Extract the actual file
        }

        const gettoken = localStorage.getItem("token");
        const token = gettoken ? JSON.parse(gettoken).token : null;

        if (!token) {
            console.error("No authentication token found");
            return;
        }
        try {
            const response = await fetch(`${serverHost}/articles/${data.id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                redirect("list", "articles"); // Redirect to articles list after successful update
            } else {
                console.error('Error updating article:', await response.json());
            }
        } catch (error) {
            console.error("Error updating article:", error);
        }
    };


    // Custom component to display the existing image
    const ExistingImageField = () => {
        const record = useRecordContext(); // Get the current record
        if (!record || !record.image) return null; // If no record or no image, return nothing
        setOldImage(record.image); // Set the old image URL

        return (
            <div>
                <p>Previous Image:</p>
                <img
                    src={`${record.image}`} // Construct the full image URL
                    alt="Existing Article Image"
                    className="h-32 md:h-36  w-36 md:w-44 object-cover" />
            </div>
        );
    };

    return (
        <Edit {...props}>
            <SimpleForm onSubmit={handleSubmit}>
                <TextField source="oldImage" defaultValue={oldImage} style={{ display: 'none' }} />
                <TextInput source="serverHost" defaultValue={serverHost} style={{ display: "none" }} />
                <TextInput source="title" label="Article Title" required />
                <DateInput source="publish_date" label="Updated Date" defaultValue={new Date().toISOString().split('T')[0]} required />
                <RichTextInput source="description" label="Article" required />

                {/* Display the existing image */}
                <ExistingImageField />

                {/* Image Upload Field */}
                <ImageInput source="image" label="Article Image" accept="image/*">
                    <ImageField source="src" title="title" />
                </ImageInput>
            </SimpleForm>
        </Edit>
    );
};


export { Articles, CreateArticle, EditArticle, ShowAnArticle };

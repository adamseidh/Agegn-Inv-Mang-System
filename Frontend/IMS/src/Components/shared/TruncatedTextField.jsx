import React from 'react';
import { TextField, useRecordContext } from 'react-admin';

const TruncatedTextField = ({ source, ...props }) => {
    const record = useRecordContext(); // Get the current record

    if (!record || !record[source]) return null; // If no record or no content, return nothing

    const content = record[source];
    const truncatedContent = content.length > 12 ? `${content.substring(0, 12)}...` : content;

    return <span>{truncatedContent}</span>;
};

export default TruncatedTextField;
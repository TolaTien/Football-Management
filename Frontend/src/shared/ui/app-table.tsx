import { Table, TableProps } from 'antd';
import React from 'react';

interface AppTableProps<T> extends TableProps<T> {}

export const AppTable = <T extends object>(props: AppTableProps<T>) => {
    return (
        <Table 
            {...props} 
            pagination={props.pagination !== false ? {
                pageSize: 10,
                showSizeChanger: true,
                ...props.pagination
            } : false}
        />
    );
};

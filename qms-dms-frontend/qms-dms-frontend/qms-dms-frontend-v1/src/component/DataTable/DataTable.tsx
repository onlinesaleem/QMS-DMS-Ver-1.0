import React, { useEffect } from 'react';
import { DataGrid, DataGridProps, GridToolbar, useGridApiRef } from '@mui/x-data-grid';

interface Props extends DataGridProps  {
    rows1: any;
    columns1: any;
    trigger?: number;
    loading?: any;
}

const DataTable: React.FC<Props> = ({ rows1, columns1, trigger, loading }) => {
    const apiRef = useGridApiRef();
  
    useEffect(() => {
        if (trigger) {
            apiRef.current.setPageSize(5);
        }
    }, [trigger]);
   
    return (
        <div style={{ height: '100%', width: '100%' }}> {/* Allow the container to grow */}
            <DataGrid
                rows={rows1}
                columns={columns1}
                loading={loading}
                checkboxSelection
                slots={{ toolbar: GridToolbar }}
                pageSizeOptions={[5, 10]}
                autoHeight // Allow the DataGrid to adjust its height based on content
                apiRef={apiRef}
            />
        </div>
    );
}

export default DataTable;

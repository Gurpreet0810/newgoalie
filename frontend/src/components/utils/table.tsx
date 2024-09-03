import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Props {
  data: Array<{
    id: number;
    status: string;
    reasonType: string;
  }>
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'reason_type', headerName: 'Reason', width: 430 },
  { field: 'status', headerName: 'Status', width: 330 },
];

export default function BasicTable({ data }: Props) {

  return (
    <div style={{ height: 400, width: '100%',  }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        style={{ width: '100%'}} // Ensures the table takes full width
      />
    </div>
  );
}

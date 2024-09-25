

export type Order = 'asc' | 'desc';

export type DataType = {
    [key: string]: any; // Định nghĩa một kiểu chung cho Data
};

export interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DataType) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

export interface HeadCell {
    disablePadding: boolean;
    id: keyof DataType;
    label: string;
    numeric: boolean;
    isShowAddIcon?: boolean;
}


export interface EnhancedTableToolbarProps {
    numSelected: number;
    title: string
}
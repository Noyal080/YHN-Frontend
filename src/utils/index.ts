export interface AdminLayoutProps {
    children: React.ReactNode;
    breadcrumbItems: BreadcrumbProps [],
    title: string,
    activeSidebarItem: string
}

interface BreadcrumbProps{
    label : string;
    link :string
}

export interface SidebarProps {
    // onToggle: () => void;
    activeSidebarItem: string

}

export interface NavbarProps {
    breadcrumbItems : BreadcrumbProps [],
    title: string;
    isSidebarExpanded ?: boolean
}

interface Column {
    key: string;
    label: string;
}
  
interface Row {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; 
}
  
export interface CommonTableProps {
    title: string;
    columns: Column[];
    rows: Row[];
    onEdit?: (row: Row) => void;
    onDelete?: (row: Row) => void;
    onSearch?: (query: string) => void;
    onAdd?: () => void;
    addName?: string;
    filterComponent?: React.ReactNode;
    isDraggable?: boolean;
    count?: number;
    onPageChange?: () => void;
    entriesPerPage: string;
    setEntriesPerPage: (value: string) => void;
}
export interface CommonToastProps {
    type : 'success' | 'error' | 'warning' | 'info'
    description: string;
    loading ?: boolean
}

export interface CommonModalProps {
    open: boolean;
    onOpenChange: () => void;
    children: React.ReactNode;
    title: string
}




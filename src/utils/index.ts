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
    [key: string]: any; // Dynamic row content
}
  
export interface CommonTableProps {
    title: string;
    columns: Column[];
    rows: Row[];
    onEdit?: (row: Row) => void;
    onDelete?: (row: Row) => void;
    onSearch?: (query: string) => void;
    onAdd?: () => void;
    filterComponent?: React.ReactNode;
    isDraggable?: boolean;
    count?: number;
    onPageChange?: () => void;
    entriesPerPage: string;
    setEntriesPerPage: (value: string) => void;
  }


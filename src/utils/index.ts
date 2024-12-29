export interface AdminLayoutProps {
    children: React.ReactNode;
    breadcrumbItems : BreadcrumbProps [],
    title: string
}

interface BreadcrumbProps{
    label : string;
    link :string
}

export interface SidebarProps {
    onToggle: (expanded: boolean) => void;
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
    onEdit: (row: Row) => void;
    onDelete: (row: Row) => void;
  }


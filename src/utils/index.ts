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

export interface Column<T> {
  key: keyof T;
  label: string;
}

export interface CommonTableProps<T> {
  title: string;
  columns: Column<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
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




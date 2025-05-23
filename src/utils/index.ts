import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Gallery } from "./types";

export interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumbItems: BreadcrumbProps[];
  title: string;
  activeSidebarItem: string;
}

interface BreadcrumbProps {
  label: string;
  link?: string;
}

export interface SidebarProps {
  // onToggle: () => void;
  activeSidebarItem: string;
}

export interface NavbarProps {
  breadcrumbItems: BreadcrumbProps[];
  title: string;
  isSidebarExpanded?: boolean;
}

export interface CommonToastProps {
  type: "success" | "error" | "warning" | "info";
  description: string;
  loading?: boolean;
}

export interface CommonModalProps {
  open: boolean;
  onOpenChange: () => void;
  children: React.ReactNode;
  title: string;
  onButtonClick: () => void;
  buttonName?: string;
  type?: "primary" | "danger";
  loading? : boolean;
}

export interface Column<T> {
  key: keyof T;
  label: string;
  visible: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string | number; 
}

export interface CommonTableProps<T> {
  title: string;
  loading?: boolean;
  columns: Column<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  onDelete?: (row: T) => void;
  onSearch?: (query: string) => void;
  onAdd?: () => void;
  addName?: string;
  filterComponent?: React.ReactNode;
  count?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  pageSize?: number;
}

export interface TableHeadProps<T> {
  title: string;
  onSearch?: (query: string) => void;
  filterComponent?: React.ReactNode;
  onAdd?: () => void;
  addName?: string;
  columns: Column<T>[];
  handleColumnVisibilityChange: (columnKey: keyof T, visible: boolean) => void;
}

export interface TableSkeletonProps<T> {
  visibleColumns: Column<T>[];
  rowCount: number;
}

export interface ImageSliderProps {
  images: Gallery[];
}

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
}

export interface GalleryOptions {
  label: string;
  value: number;
}

export interface IconOption {
  value: string; // e.g., "fa-solid fa-user"
  label: string; // e.g., "faUser"
  icon: IconDefinition; // FontAwesome icon
}

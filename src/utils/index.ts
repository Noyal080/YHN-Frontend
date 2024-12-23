export interface AdminLayoutProps {
    children: React.ReactNode;
    breadcrumbItems : BreadcrumbProps [],
    dynamicHeader: string
}

interface BreadcrumbProps{
    label : string;
    link :string
}


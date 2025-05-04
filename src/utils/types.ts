import { IconProp } from "@fortawesome/fontawesome-svg-core";

// Change the data type here
export type SliderType = {
  id: number;
  title: string;
  priorityOrder: number;
  content: {
    image: string;
    button?: {
      label: string;
      link: string;
    };
    text: string;
  };
  status: boolean;
};

export interface SliderButton {
  button_name: string;
  button_link: string;
}

export type SliderInput = {
  id?: number;
  title: string;
  sub_title: string;
  priority_order: string;
  image: string | File;
  status: number;
  button_title?: string;
  button_route?: string;
  buttons?: SliderButton[];
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type PartnerSliderType = {
  id?: number;
  title: string;
  link: string;
  image: string | File; // Allow both string and File
  status: number;
};

export type TestimonialInput = {
  id?: number;
  name: string;
  status: number;
  image: string | File;
  description: string;
  designation_id?: number | null;
  // designation: string;
  type_id: number | null;
  type_type: string | null;
  description2: string;
  category: string;
};

export type TestimonialData = {
  id?: number;
  name: string;
  status: number;
  image: string;
  description: string;
  // designation_id: number | null;
  description2: string;
  // designation: {
  //   Name: string;
  // };
  category: string;
};

export type Option = {
  value: string;
  label: string;
};

export type ImageInputTypes = {
  id?: number;
  title: string;
  images: Gallery[];
  status: number;
};

export type Gallery = {
  id?: number;
  gallery_id: number;
  path: string;
};

export type ImageType = {
  id?: number;
  title: string;
  images: File[];
  status: number;
};

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

export type TeamsInput = {
  id?: number;
  name: string;
  image: string;
  position_id: number | null;
  priority_order: number | null;
  image_url?: string;
  role: string;
  status: number;
};

export type TeamsData = {
  priority_order: string;
  id?: number;
  name: string;
  image_url: string;
  position: {
    Name: string;
  };
  role: string;
  status: number;
};

export type MessageRequestType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
};

export type InternshipType = {
  id?: number | undefined;
  title: string;
  description: string;
  apply_link: string;
  status: number;
  start_date: string;
  end_date: string;
};

export type OurWorks = {
  id?: number;
  title: string;
  description: string;
  sector_id: number | null;
  services_id: number | null;
  sector: {
    name: string;
  };
  service: {
    title: string;
  };
  banner_image: File | string;
  banner_start_date: string;
  banner_end_date: string;
  banner_location_district?: string;
  banner_location_state?: string;
  banner_location_city?: string;
  gallery_id: number | null;
  gallery: GallerEventType;
  objectives: string;
  activities: string;
  status: number;
};

export type OurWorkType = {
  id?: number;
  title: string;
  description: string;
  // sector_id: number | null;
  services_id: number | null;
  banner_image?: File | string;
  banner_start_date?: string;
  banner_end_date?: string;
  banner_location_district?: string;
  banner_location_state?: string;
  banner_location_city?: string;
  gallery_id?: number | null;
  objectives?: string;
  activities?: string;
  upload_pdf?: File | string | null;
  status: number;
};

export type EventType = {
  id?: number;
  title: string;
  description: string;
  banner_image: string;
  banner_start_date: string;
  banner_end_date: string;
  banner_start_time: string;
  banner_end_time: string;
  banner_location_district?: string;
  banner_location_state?: string;
  banner_location_city?: string;
  gallery?: GallerEventType;
  register_link?: string;
  mail?: string;
  phone?: string;
  status: number;
};

export type GallerEventType = {
  id?: number;
  title: string;
  gallery_images: Gallery[];
  status: number;
};

export type EventInputs = {
  id?: number;
  title: string;
  description: string;
  banner_image: File | string;
  banner_start_date: string;
  banner_end_date: string;
  banner_start_time: string;
  banner_end_time: string;
  banner_location_district?: string;
  banner_location_state?: string;
  banner_location_city?: string;
  gallery_id: number | null;
  register_link?: string;
  mail?: string;
  phone?: string;
  status: number;
};

export type PaginationProps = {
  total_records: number;
  current_page: number;
  total_pages: number;
  per_page: number;
  has_more_pages: boolean | false;
};

export type VideoInputTypes = {
  id?: number;
  title: string;
  video_url: string;
  status: number;
};

export type ServicesType = {
  id?: number;
  title: string;
  description: string;
  icon: IconProp;
  status: number;
};

export type ServiceInput = {
  id?: number;
  title: string;
  description: string;
  icon: string;
  status: number;
};

export type DonationsType = {
  id?: string;
  donorName: string;
  contactNumber: string;
  email: string;
  description: string;
  country: string;
  contributionType: string;
  contributionAmount: number;
};

export type ViewWorkandEventType = {
  id?: number;
  title: string;
  description: string;
  banner_image: string;
  banner_start_date: string;
  banner_end_date: string;
  banner_location_district?: string;
  banner_location_state?: string;
  banner_location_city?: string;
  gallery_id: number | null;
  objectives?: string;
  activities?: string;
  register_link?: string;
  mail?: string;
  phone?: string;
};

export type ChairpersonMessageType = {
  company_description: string;
  message_from_chairperson: string;
  additional_information: string;
  chairperson_fullname: string;
  chairperson_contact: string;
  chairperson_image: string;
};

export type NewsType = {
  id?: number;
  title: string;
  description: string;
  image: string;
  publish_date: string;
  status: number;
};

export type NewsInputType = {
  id?: number;
  title: string;
  description: string;
  image: File | string;
  publish_date: string;
  status: number;
};

export type OurImpactType = {
  id?: number;
  name: string;
  number: string;
  icon: string;
  status: number;
};

export type FellowInternDataType = {
  id?: number;
  name: string;
  image: string;
  joining_date: string;
  completion_date: string;
  status: number;
};

export type FellowInternInput = {
  name: string;
  image: File | string;
  joining_date: string | null;
  completion_date: string | null;
  status: number;
};

export type JobApplicationType = {
  id?: number;
  title: string;
  description: string;
  apply_link: string;
  job_position: string;
  job_open_position_id: number | null;
  job_open_position?: {
    name: string;
  };
  start_date: string;
  end_date: string;
  status: number;
};

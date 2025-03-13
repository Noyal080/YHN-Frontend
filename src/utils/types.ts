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

export type SliderInput = {
  id?: number;
  title: string;
  sub_title: string;
  priority_order: number;
  image: string;
  status: number;
  button_title?: string;
  button_route?: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type PartnerSliderType = {
  id?: number;
  title: string;
  image: string | File; // Allow both string and File
  status: number;
};

export type TestimonialInput = {
  id?: number;
  name: string;
  status: number;
  image: string;
  description: string;
  designation_id : number  | null;
  // designation: string;
  category: string;
};

export type TestimonialData = {
  id?: number;
  name: string;
  status: number;
  image: string;
  description: string;
  designation_id : number  | null;
  designation: {
    Name : string
  };
  category: string;
}

export type Option = {
  value: string;
  label: string;
};

export type ServiceInput = {
  id?: number;
  title: string;
  description: string;
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
  image_url?: string;
  role: string;
  status: number;
};

export type TeamsData = {
  id?: number;
  name: string;
  image_url: string;
  position : {
    Name : string
  }
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
};

export type OurWorkType = {
  id?: number;
  title: string;
  description: string;
  sector: string;
  banner_image: File | string;
  date: string;
  location: string;
  gallery: number | null;
  objective: string;
  activities: string;
};

export type EventType = {
  id?: number;
  title: string;
  description: string;
  banner_image: string;
  banner_date: string;
  banner_location: string;
  gallery: GallerEventType;
  status : number
};

export type GallerEventType = {
  id?: number;
  title: string;
  gallery_images: Gallery[];
  status: number;
}


export type EventInputs = {
  id?: number;
  title: string;
  description: string;
  banner_image: File | string;
  banner_date: string;
  banner_location: string;
  gallery_id : number | null;
  status : number
};

export type PaginationProps = {
  total_records: number ;
  current_page: number ;
  total_pages: number ;
  per_page: number ;
  has_more_pages: boolean | false;
};

export type VideoInputTypes = {
  id? : number;
  title : string;
  description? : string;
  video_url : string;
  status : number
}

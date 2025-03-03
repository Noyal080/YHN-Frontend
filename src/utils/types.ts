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
  status: boolean;
  image: string;
  name: string;
  description: string;
  designation: string;
  usercategory: string;
};

export type Option = {
  value: string;
  label: string;
}

export type ServiceInput = {
  id?: number;
  title: string;
  description: string;
}

export type ImageInputTypes = {
  id?: number;
  title: string;
  images: Gallery[];
  status: number;
}

export type Gallery = {
  id ?: number;
  gallery_id : number;
  path : string ;
}

export type ImageType = {
  id?: number;
  title: string;
  images: File[];
  status: number;
}

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

export type TeamsInput = {
  id ? : number;
  name : string;
  image : string;
  position_id : number  | null;
  role : string;
  status : number;
}

export type MessageRequestType = {
  id?: number;
  full_name : string;
  email : string;
  phone : number;
  address : string;
  message : string
}

export type InternshipType = {
  id? :number | undefined;
  title : string;
  description : string;
  apply_link : string;
}

export type OurWorkType = {
  id?: number,
  title : string;
  description : string;
  sector : string;
  banner_image : File | string;
  date : string;
  location : string;
  gallery : number | null;
  objective : string;
  activities : string
}

export type EventType = {
  id?: number;
  title : string;
  description : string;
  banner_image : File | string;
  date : string;
  location : string;
  gallery : number | null;
}

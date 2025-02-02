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
  status: boolean;
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
  image: Gallery[];
  status: boolean;
}

export type Gallery = {
  id: number;
  imageUrl : string | File;
}

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

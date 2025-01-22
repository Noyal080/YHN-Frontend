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

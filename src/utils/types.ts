export type SliderType = {
    id : number;
    priorityOrder : number;
    content : {
        image : string;
        button ?: {
            label : string;
            link : string;
        }
    };
    status: boolean;
    text : string
}
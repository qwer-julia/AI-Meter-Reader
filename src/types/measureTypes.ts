export interface Measure {
    id: number, 
    measure_uuid: string,
    measure_datetime: string,
    measure_type: 'WATER' | 'GAS',
    measure_value: number,
    has_confirmed: boolean,
    image_url: string,
    customer_id: number,
    createdAt: string,
    updatedAt: string
}

export interface MeasureBody {
    measure_type: string,
    measure_datetime: string,
    customer_id: number,
    measure_value: number,
    image: string
}

export interface NewMeasureRequestBody {
    image: string;
    customer_code: string;
    customer_id: number;
    measure_datetime: string;
    measure_type: 'WATER' | 'GAS';
}

export interface UpdateMeasureRequestBody {
    measure_uuid: string;
    confirmed_value: number;
}
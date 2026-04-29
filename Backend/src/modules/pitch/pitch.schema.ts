


export interface Pagination{
    query: any;
}



export interface AddPitch {
    namePitch: string;
    status: 'active' | 'maintenance';
    pitchCategory: number;
    address: string;
    startTime: string;
    endTime: string;
    price: number;
};

export interface UpdatePitch {
    namePitch?: string;
    status: 'active' | 'maintenance';
    pitchCategory?: number;
    address?: string;
}

export interface UpdatePricePitch {
    startTime?: Date;
    endTime?: Date;
    price?: number;
}
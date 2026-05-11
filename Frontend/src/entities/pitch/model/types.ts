export interface Pitch {
    id: string;
    name: string;
    location: string;
    pricePerHour: number;
    type: '5-a-side' | '7-a-side' | '11-a-side';
    imageUrl: string;
    description: string;
}

export interface PitchState {
    pitches: Pitch[];
    currentPitch: Pitch | null;
    loading: boolean;
    error: string | null;
}

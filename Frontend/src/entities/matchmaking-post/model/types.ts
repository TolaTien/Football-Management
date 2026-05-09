import { User } from '../../user/model/types';
import { Pitch } from '../../pitch/model/types';

export enum MatchmakingStatus {
    OPEN = 'OPEN',
    FULL = 'FULL',
    EXPIRED = 'EXPIRED'
}

export interface MatchmakingPost {
    id: string;
    author: User;
    pitch: Pitch;
    title: string;
    description: string;
    requiredPlayers: number;
    currentPlayers: number;
    startTime: string; // ISO String
    endTime: string;   // ISO String
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    status: MatchmakingStatus;
    createdAt: string;
}

export interface CreateMatchmakingDTO {
    pitchId: string;
    title: string;
    description: string;
    requiredPlayers: number;
    startTime: string;
    endTime: string;
    level: string;
}

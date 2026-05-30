export type PitchStatus = 'active' | 'maintenance' | 'constructing';
export type PriceRuleStatus = 'active' | 'maintenance';

export interface Pitch {
  id: string;
  name: string;
  desc: string;
  type: string;
  status: PitchStatus;
  grassHealth: number;
  grassStatus: string;
  nextMaintenance: string;
  imageUrl: string;
  pitchCategory?: number;
  address?: string;
}

export interface PriceRule {
  id: string;
  pitchId: string;
  timeRange: string;
  price: number;
  type: string;
  status: PriceRuleStatus;
  icon: string;
}

export interface CreatePitchDto {
  namePitch: string;
  status: PitchStatus;
  pitchCategory: number;
  address: string;
  startTime: string;
  endTime: string;
  price: number;
}

export interface UpdatePitchDto {
  pitchId: string;
  namePitch?: string;
  status?: PitchStatus;
  pitchCategory?: number;
  address?: string;
}

export interface UpdatePriceConfigDto {
  pitchId: string;
  config: Array<{
    startTime: string;
    endTime: string;
    price: number;
  }>;
}

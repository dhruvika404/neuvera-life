export interface IcpCriteria {
  industries?: string[];
  titles?: string[];
  companySizes?: string[];
  locations?: string[];
  keywords?: string[];
  excludeKeywords?: string[];
  revenue?: { min?: number; max?: number };
}

export interface IcpProfile {
  id: string;
  name: string;
  description?: string | null;
  criteria: IcpCriteria;
  apolloFilters?: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: Date;
}

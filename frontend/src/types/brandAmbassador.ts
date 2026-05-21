export type AmbassadorStatus = 'active' | 'inactive' | 'pending';

export type InviteStatus = 'registered' | 'converted' | 'pending';

export type SaleStatus = 'completed' | 'pending' | 'refunded';

export type CommissionStatus = 'paid' | 'pending';

export interface InvitedCustomer {
  id: string;
  name: string;
  invitedAt: string;
  status: InviteStatus;
}

export interface SaleRecord {
  id: string;
  customerName: string;
  productLabel: string;
  amountToman: number;
  commissionToman: number;
  date: string;
  status: SaleStatus;
}

export interface CommissionEntry {
  id: string;
  period: string;
  amountToman: number;
  status: CommissionStatus;
  paidAt?: string;
}

export interface BrandAmbassador {
  id: string;
  name: string;
  phone: string;
  email: string;
  referralCode: string;
  joinedAt: string;
  status: AmbassadorStatus;
  avatarColor: string;
  invitedCount: number;
  successfulSalesCount: number;
  totalCommissionToman: number;
  conversionRate: number;
  performanceSummary: string;
  invitedCustomers: InvitedCustomer[];
  salesHistory: SaleRecord[];
  commissionDetails: CommissionEntry[];
}

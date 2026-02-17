export interface LaborItem {
  id: string;
  technician: string;
  timestamp: string;
  hours: number;
  rate: number;
}

export interface PartItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface ServiceTask {
  id: string;
  title: string;
  description: string;
  totalCost: number;
  status: 'Open' | 'Completed';
  assignee: string;
  labor: LaborItem[];
  parts: PartItem[];
  codes: {
    workCompleted: string;
    repair: string;
    failure: string;
  };
}

export interface WorkOrder {
  id: string;
  vehicleId: string;
  vehicleName: string;
  status: 'Completed' | 'In Progress' | 'Open';
  createdDate: string;
  createdBy: string;
  totalCost: number;
  currency: string;
  tasks: ServiceTask[];
}

export interface ThreeCs {
  concern: string;
  cause: string;
  correction: string;
}

export interface WarrantyDraft {
  coveredItems: string[]; // IDs of covered parts/labor
  missedOpportunities: Array<{
    itemId: string;
    reason: string;
  }>;
  threeCs: ThreeCs;
  exclusionFlags: string[];
  totalClaimable: number;
  status: 'drafting' | 'ready' | 'submitted';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  type?: 'text' | 'draft_preview' | 'success';
  data?: WarrantyDraft;
}

export interface ClaimPart extends PartItem {
  isCovered: boolean;
}

export interface ClaimLabor extends LaborItem {
  isCovered: boolean;
}

export interface ClaimData {
  workOrderId: string;
  vehicleName: string;
  vehicleId: string;
  odometer: number;
  engineHours: number;
  createdDate: string;
  createdBy: string;
  failureDate: string;
  repairDate: string;
  threeCs: ThreeCs;
  parts: ClaimPart[];
  labor: ClaimLabor[];
  totalAmount: number;
}
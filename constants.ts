import { WorkOrder } from './types';

export const MOCK_WORK_ORDER: WorkOrder = {
  id: "120",
  vehicleId: "V-2049",
  vehicleName: "Freightliner Cascadia",
  status: "Completed",
  createdDate: "April 1, 2025",
  createdBy: "Jake Carni",
  totalCost: 3200.00,
  currency: "USD",
  tasks: [
    {
      id: "task-001",
      title: "Oil change • $0.00",
      description: "Change oil and replace oil filter • 01-001-001",
      totalCost: 0,
      status: "Open",
      assignee: "Michael Scott",
      labor: [
        {
          id: "labor-001",
          technician: "Andrew Chin",
          timestamp: "Jan 15, 1:39 PM",
          hours: 1.5,
          rate: 120
        },
        {
          id: "labor-002",
          technician: "Daniel Wachtel",
          timestamp: "Jan 15, 2:58 PM",
          hours: 0.5,
          rate: 120
        }
      ],
      parts: [
        {
          id: "part-001",
          name: "Drain plug washer",
          sku: "P8180 (Alaska)",
          quantity: 1,
          unitPrice: 2.50
        },
        {
          id: "part-002",
          name: "Brake cleaner",
          sku: "P7392",
          quantity: 2,
          unitPrice: 12.00
        },
        {
          id: "part-003",
          name: "Oil filter",
          sku: "P0073 (Alaska)",
          quantity: 1,
          unitPrice: 45.00
        }
      ],
      codes: {
        workCompleted: "Select",
        repair: "Select",
        failure: "Select"
      }
    },
    {
      id: "task-002",
      title: "Front mirror missing • $0.00",
      description: "Replace missing driver side mirror assembly • 01-001-001",
      totalCost: 0,
      status: "Open",
      assignee: "Michael Scott",
      labor: [
         {
          id: "labor-003",
          technician: "Andrew Chin",
          timestamp: "Jan 16, 9:00 AM",
          hours: 2.0,
          rate: 120
        }
      ],
      parts: [
        {
          id: "part-004",
          name: "Mirror Assembly, Heated",
          sku: "M-9921",
          quantity: 1,
          unitPrice: 450.00
        }
      ],
      codes: {
        workCompleted: "Select",
        repair: "Select",
        failure: "Select"
      }
    }
  ]
};

export const WARRANTY_POLICY_CONTEXT = `
WARRANTY POLICY SUMMARY:
- Standard Powertrain Warranty: 5 years / 100,000 miles. Covers engine, transmission.
- Emissions Warranty: 5 years. Covers sensors, DEF system.
- Parts Warranty: 1 year on all OEM replacement parts.
- Exclusions: Consumables (oil, filters, brake pads) are generally excluded UNLESS part of a larger covered failure.
- Note: "Drain plug washer" is a consumable. "Brake cleaner" is shop supply (excluded).
- Mirror Assembly: Covered under Cab Exterior warranty if failure is structural, excluded if due to impact/accident.
`;

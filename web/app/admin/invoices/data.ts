export const MOCK_INVOICES = [
  {
    id: "INV-2026-0501",
    room: "101",
    tenant: "Trần Bình An",
    amount: 5270000,
    dueDate: "15/05/2026",
    status: "Pending",
    counters: {
      electric: { old: 2100, new: 2220, used: 120 },
      water: { old: 800, new: 812, used: 12 },
    },
    breakdown: {
      rent: 4500000,
      electric: 420000,
      water: 200000,
      service: 150000,
    },
  },
  {
    id: "INV-2026-0502",
    room: "202",
    tenant: "Trần Thị Bình",
    amount: 5650000,
    dueDate: "15/05/2026",
    status: "Paid",
    counters: {
      electric: { old: 3410, new: 3530, used: 120 },
      water: { old: 1105, new: 1115, used: 10 },
    },
    breakdown: {
      rent: 4800000,
      electric: 420000,
      water: 280000,
      service: 150000,
    },
  },
  {
    id: "INV-2026-0412",
    room: "405",
    tenant: "Lê Minh Công",
    amount: 5120000,
    dueDate: "15/04/2026",
    status: "Overdue",
    counters: {
      electric: { old: 1850, new: 1940, used: 90 },
      water: { old: 640, new: 648, used: 8 },
    },
    breakdown: {
      rent: 4500000,
      electric: 315000,
      water: 155000,
      service: 100000,
    },
  },
];

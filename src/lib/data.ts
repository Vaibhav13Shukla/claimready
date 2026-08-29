export type PassbookEntry = {
  id: string;
  month: string; // e.g. "Jan 2025"
  year: number;
  employee: number;
  employer: number;
  pension: number;
  type: "contribution" | "interest" | "withdrawal" | "transfer";
  note?: string;
};

export type Employment = {
  id: string;
  employer: string;
  memberId: string;
  from: string;
  to: string | null;
  city: string;
  balance: number;
  transferred: boolean;
};

export type ClaimStatus = "received" | "under-review" | "approved" | "paid" | "returned";

export type Claim = {
  id: string;
  type: string;
  reason: string;
  amount: number;
  filedOn: string;
  status: ClaimStatus;
  bank: string;
  expected: string;
  history: { label: string; date: string; done: boolean; note?: string }[];
};

export type Grievance = {
  id: string;
  category: string;
  about: string;
  filedOn: string;
  status: "received" | "with-officer" | "resolved";
  reply?: string;
};

export const DEMO = {
  uan: "100 200 300 400",
  uanPlain: "100200300400",
  password: "epfo123",
  otp: "1234",
};

export const member = {
  name: "Ramesh Kumar",
  nameHi: "रमेश कुमार",
  uan: DEMO.uan,
  dob: "14 March 1988",
  age: 37,
  father: "Suresh Kumar",
  mobile: "+91 98•••• ••21",
  email: "r••••kumar@email.com",
  aadhaar: "XXXX XXXX 4821",
  pan: "ABCDE••••F",
  bank: "State Bank of India ••••4432",
  ifsc: "SBIN0001234",
  joined: "01 July 2011",
  employer: "Sunrise Textiles Pvt Ltd",
  employerCity: "Surat, Gujarat",
  monthlySalary: 32000,
  kyc: { aadhaar: true, pan: true, bank: true, mobile: true },
  nominee: {
    name: "Sunita Kumar",
    relation: "Wife",
    share: 100,
    dob: "22 August 1991",
  },
  balance: {
    employee: 296400,
    employer: 189950,
    pension: 118500,
    interestThisYear: 38940,
  },
  interestRate: 8.25,
  serviceYears: 14,
};

export const totalBalance = member.balance.employee + member.balance.employer;

export const employments: Employment[] = [
  {
    id: "e3",
    employer: "Sunrise Textiles Pvt Ltd",
    memberId: "GJSRT00234560000001234",
    from: "May 2019",
    to: null,
    city: "Surat, Gujarat",
    balance: 318250,
    transferred: true,
  },
  {
    id: "e2",
    employer: "Mahalaxmi Engineering Works",
    memberId: "MHBAN00112230000004567",
    from: "Aug 2014",
    to: "Apr 2019",
    city: "Pune, Maharashtra",
    balance: 124300,
    transferred: true,
  },
  {
    id: "e1",
    employer: "Bharat Auto Components",
    memberId: "DLCPM00445560000007788",
    from: "Jul 2011",
    to: "Jul 2014",
    city: "Faridabad, Haryana",
    balance: 43800,
    transferred: false,
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function buildPassbook(): PassbookEntry[] {
  const rows: PassbookEntry[] = [];
  let base = 2100;
  for (let y = 2021; y <= 2025; y++) {
    for (let m = 0; m < 12; m++) {
      if (y === 2025 && m > 9) continue;
      const employee = Math.round(base + m * 12 + (y - 2021) * 260);
      const employer = Math.round(employee * 0.64);
      const pension = Math.round(employee * 0.36);
      rows.push({
        id: `${y}-${m}`,
        month: `${MONTHS[m]} ${y}`,
        year: y,
        employee,
        employer,
        pension,
        type: "contribution",
      });
    }
    rows.push({
      id: `${y}-int`,
      month: `Interest ${y}`,
      year: y,
      employee: Math.round(base * 9.4),
      employer: Math.round(base * 6.1),
      pension: 0,
      type: "interest",
      note: `Interest credited at 8.25% for ${y}-${String(y + 1).slice(2)}`,
    });
    base += 180;
  }
  return rows.reverse();
}

export const initialClaims: Claim[] = [
  {
    id: "GJSRT250914001",
    type: "Advance (Form 31)",
    reason: "Medical treatment of family member",
    amount: 45000,
    filedOn: "14 September 2025",
    status: "paid",
    bank: "State Bank of India ••••4432",
    expected: "22 September 2025",
    history: [
      { label: "Claim received", date: "14 Sep 2025", done: true },
      { label: "Checked by EPFO officer", date: "17 Sep 2025", done: true },
      { label: "Approved", date: "19 Sep 2025", done: true },
      { label: "Money sent to your bank", date: "20 Sep 2025", done: true, note: "UTR 3390218844" },
    ],
  },
];

export type Office = {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  pincodes: string[];
};

export const offices: Office[] = [
  {
    id: "o1",
    name: "Regional Office Surat",
    city: "Surat",
    state: "Gujarat",
    address: "Bhavishya Nidhi Bhawan, Ring Road, Surat 395002",
    phone: "0261 2345 678",
    email: "ro.surat@epfindia.gov.in",
    hours: "Mon–Fri, 9:30 am – 5:30 pm",
    pincodes: ["395001", "395002", "395003", "394210"],
  },
  {
    id: "o2",
    name: "Regional Office Pune (Golden Jubilee)",
    city: "Pune",
    state: "Maharashtra",
    address: "Golden Jubilee Bhawan, Akurdi, Pune 411044",
    phone: "020 2765 4321",
    email: "ro.pune@epfindia.gov.in",
    hours: "Mon–Fri, 9:30 am – 5:30 pm",
    pincodes: ["411001", "411044", "411057"],
  },
  {
    id: "o3",
    name: "Regional Office Delhi (South)",
    city: "New Delhi",
    state: "Delhi",
    address: "Bhavishya Nidhi Bhawan, Wazirpur, New Delhi 110052",
    phone: "011 2345 8899",
    email: "ro.delhisouth@epfindia.gov.in",
    hours: "Mon–Fri, 9:30 am – 5:30 pm",
    pincodes: ["110001", "110052", "110075"],
  },
  {
    id: "o4",
    name: "Regional Office Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Bhavishya Nidhi Bhawan, Rajajinagar, Bengaluru 560010",
    phone: "080 2233 4455",
    email: "ro.bengaluru@epfindia.gov.in",
    hours: "Mon–Fri, 9:30 am – 5:30 pm",
    pincodes: ["560001", "560010", "560066"],
  },
  {
    id: "o5",
    name: "Regional Office Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Bhavishya Nidhi Bhawan, Royapettah, Chennai 600014",
    phone: "044 2811 2233",
    email: "ro.chennai@epfindia.gov.in",
    hours: "Mon–Fri, 9:30 am – 5:30 pm",
    pincodes: ["600001", "600014", "600096"],
  },
  {
    id: "o6",
    name: "Regional Office Kolkata",
    city: "Kolkata",
    state: "West Bengal",
    address: "Bhavishya Nidhi Bhawan, Salt Lake, Kolkata 700091",
    phone: "033 2357 1122",
    email: "ro.kolkata@epfindia.gov.in",
    hours: "Mon–Fri, 9:30 am – 5:30 pm",
    pincodes: ["700001", "700091", "700156"],
  },
  {
    id: "o7",
    name: "Regional Office Lucknow",
    city: "Lucknow",
    state: "Uttar Pradesh",
    address: "Bhavishya Nidhi Bhawan, Vidhan Sabha Marg, Lucknow 226001",
    phone: "0522 2288 776",
    email: "ro.lucknow@epfindia.gov.in",
    hours: "Mon–Fri, 9:30 am – 5:30 pm",
    pincodes: ["226001", "226010", "226016"],
  },
  {
    id: "o8",
    name: "Regional Office Patna",
    city: "Patna",
    state: "Bihar",
    address: "Bhavishya Nidhi Bhawan, Bailey Road, Patna 800001",
    phone: "0612 2233 445",
    email: "ro.patna@epfindia.gov.in",
    hours: "Mon–Fri, 9:30 am – 5:30 pm",
    pincodes: ["800001", "800013", "801503"],
  },
];

export const rupees = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

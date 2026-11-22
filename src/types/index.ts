export type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
};

export type CategoryCount = { category: string; count: number };

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export type Appointment = {
  _id: string;
  serviceId: string;
  customerId: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string;
  message: string;
  servicePrice: number;
  paymentStatus: PaymentStatus;
  status: AppointmentStatus;
  createdAt: string;
  service?: {
    serviceName?: string;
    category?: string;
    image?: string;
    duration?: number;
  };
};

export type CustomerStats = {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  paidAppointments: number;
};

export type AdminStats = {
  totalCustomers: number;
  totalActiveServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  totalSuccessfulPayments: number;
  revenue: { currency: string; total: number }[];
};

export type AdminAppointment = Omit<Appointment, "service"> & {
  confirmedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  paidAt?: string;
  service?: {
    _id?: string;
    serviceName?: string;
    category?: string;
    image?: string;
    duration?: number;
  };
  customer?: {
    _id?: string;
    name?: string;
    email?: string;
    image?: string;
    phone?: string;
  };
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string;
  role: "admin" | "customer";
  isBlocked?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
};

export type AdminUserDetails = AdminUser & {
  appointmentStats: { total: number; pending: number; confirmed: number; cancelled: number };
};

export type Transaction = {
  _id: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
  appointmentDate?: string;
  timeSlot?: string;
  serviceName?: string;
  customer?: { name?: string; email?: string; image?: string };
};
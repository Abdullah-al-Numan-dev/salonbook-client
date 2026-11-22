import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  PlusCircle,
  Scissors,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const customerNav: NavItem[] = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customer/appointments", label: "My Appointments", icon: CalendarCheck },
  { href: "/dashboard/customer/profile", label: "My Profile", icon: UserRound },
];

export const adminNav: NavItem[] = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/services", label: "Manage Services", icon: Scissors },
  { href: "/dashboard/admin/services/new", label: "Add Service", icon: PlusCircle },
  { href: "/dashboard/admin/appointments", label: "Manage Appointments", icon: CalendarCheck },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
  { href: "/dashboard/admin/profile", label: "My Profile", icon: UserRound },
];
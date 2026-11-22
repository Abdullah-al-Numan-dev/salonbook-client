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
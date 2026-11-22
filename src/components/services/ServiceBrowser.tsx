"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Select from "@/components/ui/Select";
import { fieldClass } from "@/components/ui/FormField";
import ServiceCard, { ServiceCardSkeleton } from "./ServiceCard";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Pagination, Service } from "@/types";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function ServiceBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(parseInt(searchParams.get("page") || "1") || 1, 1);
  const urlSearch = searchParams.get("search") || "";

  const [searchText, setSearchText] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchText, 400);

  // Keep the box in sync when the URL changes from outside (back button, links)
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchText(urlSearch);
  }

  function updateParams(changes: Record<string, string | null>, resetPage = true) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value && value !== "all" && value !== "newest") params.set(key, value);
      else params.delete(key);
    }
    if (resetPage) params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Push the debounced search text into the URL
  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearch.trim()) {
      updateParams({ search: debouncedSearch.trim() || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, loading, error, refetch } = useFetch(
    () =>
      api<{ data: Service[]; pagination: Pagination }>("/api/services", {
        query: { search: urlSearch, category, sort, page, limit: 9 },
      }),
    [urlSearch, category, sort, page]
  );

  const hasFilters = urlSearch || category !== "all" || sort !== "newest";
  const pagination = data?.pagination;

  function clearAll() {
    setSearchText("");
    router.replace(pathname, { scroll: false });
  }

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (p > 1) params.set("page", String(p));
    else params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Container className="py-10 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-semibold">Browse Services</h1>
        <p className="mt-2 text-muted">
          Explore everything our salon offers. Search by name, filter by category or sort by price.
        </p>
      </div>

      {/* Search and sort */}
      <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search services by name"
            aria-label="Search services by name"
            className={cn(fieldClass, "h-11 pl-10 pr-10")}
          />
          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select
          aria-label="Sort services"
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="h-11"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Category chips */}
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {["all", ...CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => updateParams({ category: c })}
            aria-pressed={category === c}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              category === c
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface hover:border-primary hover:text-primary"
            )}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-8">
        {!loading && !error && pagination && (
          <p className="mb-4 text-sm text-muted" aria-live="polite">
            {pagination.total} {pagination.total === 1 ? "service" : "services"} found
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-3 font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </p>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Could not load services"
            description={error}
            action={<Button onClick={refetch}>Try again</Button>}
          />
        ) : data && data.data.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No services found"
            description="Try a different search or category."
            action={hasFilters ? <Button onClick={clearAll}>Clear filters</Button> : undefined}
          />
        )}

        {/* Pagination */}
        {!loading && !error && pagination && pagination.totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => goToPage(pagination.page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => goToPage(pagination.page + 1)}
            >
              Next
            </Button>
          </nav>
        )}
      </div>
    </Container>
  );
}
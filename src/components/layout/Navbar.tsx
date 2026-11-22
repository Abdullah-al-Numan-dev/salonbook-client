"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "./Logo";
import Container from "@/components/ui/Container";
import Button, { buttonStyles } from "@/components/ui/Button";
import { useAuthUser } from "@/hooks/useAuthUser";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isPending, signOut } = useAuthUser();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the profile dropdown on outside click or Esc
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeAll = () => {
    setMobileOpen(false);
    setMenuOpen(false);
  };

  async function handleLogout() {
    closeAll();
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not log out. Please try again");
    }
  }

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  const avatar = user?.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.image}
      alt=""
      referrerPolicy="no-referrer"
      className="h-9 w-9 rounded-full object-cover"
    />
  ) : (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
      {initial}
    </span>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {publicLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-soft",
                isActive(l.href) ? "text-primary" : "text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-soft",
                isActive("/dashboard") ? "text-primary" : "text-foreground"
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-primary-soft" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-primary-soft"
              >
                {avatar}
                <ChevronDown className="h-4 w-4 text-muted" aria-hidden="true" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 rounded-xl border border-border bg-surface p-2 shadow-lg"
                >
                  <div className="border-b border-border px-3 py-2">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={closeAll}
                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-primary-soft"
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin" className={buttonStyles({ variant: "ghost", size: "sm" })}>
                Sign In
              </Link>
              <Link href="/signup" className={buttonStyles({ size: "sm" })}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 hover:bg-primary-soft md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <Container className="space-y-1 py-4">
            {publicLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={closeAll}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-primary-soft",
                  isActive(l.href) ? "text-primary" : "text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeAll}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-primary-soft"
                >
                  Dashboard
                </Link>
                <div className="mt-3 flex items-center gap-3 border-t border-border px-3 pt-4">
                  {avatar}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                </div>
                <div className="px-3 pt-3">
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-3 pt-3">
                <Link
                  href="/signin"
                  onClick={closeAll}
                  className={buttonStyles({ variant: "outline" })}
                >
                  Sign In
                </Link>
                <Link href="/signup" onClick={closeAll} className={buttonStyles()}>
                  Sign Up
                </Link>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
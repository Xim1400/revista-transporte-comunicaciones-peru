"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  // Cierra la búsqueda al cambiar de ruta (patrón de ajuste de estado
  // durante el render, sin efecto, para evitar cascadas de renders).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setSearchOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-brand-navy transition-shadow",
        scrolled && "shadow-md"
      )}
    >
      <div className="h-[3px] w-full bg-brand-yellow" />
      <nav className="container-editorial flex h-16 items-center justify-between gap-4">
        <Logo variant="light" />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white",
                    active && "text-white"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-[1px] h-[2px] bg-brand-yellow transition-opacity",
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Buscar"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
          </button>

          <Sheet>
            <SheetTrigger
              aria-label="Abrir menú"
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo variant="dark" />
                </SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <SheetClose
                      render={
                        <Link
                          href={link.href}
                          className="block rounded-md px-3 py-2.5 text-base font-medium text-foreground/90 hover:bg-muted hover:text-primary"
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {searchOpen && (
        <div className="border-t border-white/10 bg-brand-navy">
          <div className="container-editorial py-3">
            <SearchBar onSubmit={() => setSearchOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

function SearchBar({ onSubmit }: { onSubmit: () => void }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
        router.push(`/buscar?q=${encodeURIComponent(value)}`);
      }}
      className="flex items-center gap-2"
    >
      <Search className="size-4 shrink-0 text-white/60" />
      <input
        autoFocus
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar noticias, temas, proyectos…"
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
      />
      <button
        type="submit"
        className="shrink-0 bg-brand-yellow px-3 py-1.5 text-xs font-semibold text-brand-navy"
      >
        Buscar
      </button>
    </form>
  );
}

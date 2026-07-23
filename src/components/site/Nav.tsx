import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import logoAsset from "@/assets/deep-auto-logo-new.jpg.asset.json";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  const links: { label: string; to?: string; href?: string }[] = [
    { label: "Home", to: "/" },
    { label: "Services", href: "/#services" },
    { label: "Shop", href: "/#products" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Reviews", to: "/reviews" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container-x flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logoAsset.url}
            alt="Deep Auto Service"
            width={180}
            height={48}
            className="h-12 md:h-14 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} className="text-sm font-medium text-foreground hover:text-primary transition-colors [&.active]:text-primary">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                {l.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 rounded-full text-foreground hover:bg-muted transition-colors" aria-label="Cart">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">
                {count}
              </span>
            )}
          </Link>
          <a href="/#book" className="hidden md:inline-flex btn-primary hover:btn-primary-hover text-sm">
            Book Now
          </a>
          <button className="lg:hidden p-2 text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="container-x py-4 flex flex-col gap-3">
            {links.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="py-2 font-medium">
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="py-2 font-medium">
                  {l.label}
                </a>
              ),
            )}
            <a href="/#book" onClick={() => setOpen(false)} className="btn-primary hover:btn-primary-hover mt-2">Book Now</a>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-x py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src={logoWhiteAsset.url}
              alt="Deep Auto Service"
              width={180}
              height={48}
              className="h-12 w-auto object-contain"
            />
          </div>
          <p className="text-sm leading-relaxed text-primary-foreground/80">
            Toronto's premium destination for automotive detailing, ceramic coating, and pro-grade care.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Services</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/85">
            <li><a href="/#services" className="hover:text-white">Interior Detailing</a></li>
            <li><a href="/#services" className="hover:text-white">Exterior Detailing</a></li>
            <li><a href="/#services" className="hover:text-white">Ceramic Coating</a></li>
            <li><a href="/#services" className="hover:text-white">Paint Correction</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Company</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/85">
            <li><Link to="/reviews" className="hover:text-white">Reviews</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            <li><a href="/#rental" className="hover:text-white">Car Rentals</a></li>
            <li><a href="/#contact" className="hover:text-white">Contact</a></li>
            <li><Link to="/auth" className="hover:text-white">Admin</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Visit Us</h4>
          <address className="not-italic text-sm space-y-2 text-primary-foreground/85">
            <div>11 Steinway Blvd, Toronto</div>
            <div><a href="tel:+14165577455" className="hover:text-white">+1 (416) 557-7455</a></div>
            <div>Mon–Fri: 10am – 9pm</div>
            <div>Saturday: 10am – 6pm</div>
          </address>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-x py-6 text-xs text-primary-foreground/70 flex flex-wrap justify-between gap-2">
          <div>© {new Date().getFullYear()} Deep Auto Service. All rights reserved.</div>
          <div>Premium detailing · Toronto, ON</div>
        </div>
      </div>
    </footer>
  );
}

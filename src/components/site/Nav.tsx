import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: "Services" },
    { href: "#rental", label: "Rentals" },
    { href: "#products", label: "Shop" },
    { href: "#gallery", label: "Results" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-[var(--gradient-primary)] grid place-items-center text-primary-foreground font-bold">
            D
          </div>
          <div className={`font-display font-bold text-lg leading-none ${scrolled ? "text-foreground" : "text-white"}`}>
            Deep Auto
            <div className={`text-[10px] tracking-[0.25em] font-sans font-medium ${scrolled ? "text-muted-foreground" : "text-white/70"}`}>SERVICE</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? "text-foreground" : "text-white/90"}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className={`relative p-2 rounded-full transition-colors ${scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">
                {count}
              </span>
            )}
          </Link>
          <a href="#book" className="hidden md:inline-flex btn-primary hover:btn-primary-hover text-sm">
            Book Now
          </a>
          <button
            className={`lg:hidden p-2 ${scrolled ? "text-foreground" : "text-white"}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="container-x py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2 font-medium">
                {l.label}
              </a>
            ))}
            <a href="#book" onClick={() => setOpen(false)} className="btn-primary hover:btn-primary-hover mt-2">Book Now</a>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[oklch(0.13_0.02_260)] text-white/80">
      <div className="container-x py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-[var(--gradient-primary)] grid place-items-center text-primary-foreground font-bold">D</div>
            <div className="font-display font-bold text-lg text-white">Deep Auto Service</div>
          </div>
          <p className="text-sm leading-relaxed">
            Toronto's premium destination for automotive detailing, ceramic coating, and pro-grade care.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#services">Interior Detailing</a></li>
            <li><a href="#services">Exterior Detailing</a></li>
            <li><a href="#services">Ceramic Coating</a></li>
            <li><a href="#services">Paint Correction</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#rental">Car Rentals</a></li>
            <li><a href="#products">Shop Products</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link to="/auth">Admin</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Visit Us</h4>
          <address className="not-italic text-sm space-y-2">
            <div>11 Steinway Blvd, Toronto</div>
            <div><a href="tel:+14165577455" className="hover:text-white">+1 (416) 557-7455</a></div>
            <div>Mon–Fri: 10am – 9pm</div>
            <div>Saturday: 10am – 6pm</div>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-6 text-xs text-white/50 flex flex-wrap justify-between gap-2">
          <div>© {new Date().getFullYear()} Deep Auto Service. All rights reserved.</div>
          <div>Premium detailing · Toronto, ON</div>
        </div>
      </div>
    </footer>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Shield, Droplets, Wand2, Star, Phone, MapPin, Clock, Check, ArrowRight, Car } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";

import { Navbar, Footer } from "@/components/site/Nav";
import { BookingDialog, RentalDialog } from "@/components/site/Dialogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { addToCart } from "@/lib/cart";

import heroImg from "@/assets/hero-car.jpg";
import svcInterior from "@/assets/service-interior.jpg";
import svcExterior from "@/assets/service-exterior.jpg";
import svcCeramic from "@/assets/service-ceramic.jpg";
import svcPaint from "@/assets/service-paint.jpg";
import rentalExterior from "@/assets/rental-exterior.jpg.asset.json";
import rentalInterior from "@/assets/rental-interior.jpg.asset.json";
import rentalStarlight from "@/assets/rental-starlight.jpg.asset.json";
import beforeAfter from "@/assets/before-after.jpg";
import pShampoo from "@/assets/product-shampoo.jpg";
import pTire from "@/assets/product-tire.jpg";
import pCeramic from "@/assets/product-ceramic.jpg";
import pWax from "@/assets/product-wax.jpg";
import storefront from "@/assets/storefront.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deep Auto Service — Premium Auto Detailing Toronto" },
      { name: "description", content: "Expert car detailing, ceramic coating, paint correction, rentals and premium auto products in Toronto. Book online today." },
    ],
  }),
  component: Home,
});

const productImages: Record<string, string> = {
  "car-shampoo": pShampoo,
  "tire-shine": pTire,
  "ceramic-coating": pCeramic,
  "wax-polish": pWax,
};

const services = [
  { title: "Interior Detailing", price: 150, image: svcInterior, desc: "Deep vacuum, steam clean, leather conditioning and pristine finish." },
  { title: "Exterior Detailing", price: 200, image: svcExterior, desc: "Hand wash, decontamination, clay bar and premium sealant." },
  { title: "Ceramic Coating", price: 400, image: svcCeramic, desc: "Long-lasting hydrophobic protection with a glass-like finish." },
  { title: "Paint Correction", price: 300, image: svcPaint, desc: "Remove swirls, scratches and oxidation for showroom clarity." },
];

const testimonials = [
  { name: "Marcus T.", rating: 5, text: "The ceramic coating on my M3 is unreal. Beads water like nothing else. Deep Auto is the only shop I trust in Toronto." },
  { name: "Priya S.", rating: 5, text: "Interior looked brand new after their deep clean. Fair pricing, incredible attention to detail." },
  { name: "David L.", rating: 5, text: "Paint correction turned my 5-year-old sedan into a mirror. Professional, punctual, and premium quality." },
  { name: "Sofia R.", rating: 5, text: "Rented the truck for a move — clean, powerful, easy pickup. Same premium standard as their detailing." },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Trust />
      <Services />
      <Rental />
      <Products />
      <Gallery />
      <Testimonials />
      <CtaBanner />
      <Contact />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section id="book" className="relative min-h-[92svh] flex items-end overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Deep Auto Service — premium detailing in Toronto" width={1920} height={1200} className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>
      <div className="container-x relative z-10 pt-40 pb-20 text-white">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05]">
            Premium Auto Detailing<br />That Restores, Protects, and Impresses.
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-xl">
            Serving Toronto and the GTA with professional detailing services and premium automotive care products.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookingDialog trigger={
              <button className="rounded-md px-7 py-4 bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all shadow-lg">
                Book an Appointment
              </button>
            } />
            <a href="#products" className="rounded-md px-7 py-4 bg-black text-white font-semibold border border-white/20 hover:bg-white/10 transition-colors">
              Shop Auto Care Products
            </a>
          </div>
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { k: "500+", v: "Cars Detailed" },
              { k: "4.9★", v: "Customer Rating" },
              { k: "10+", v: "Years Experience" },
            ].map((s) => (
              <div key={s.k}>
                <div className="font-display text-3xl md:text-4xl font-bold">{s.k}</div>
                <div className="text-xs uppercase tracking-widest text-white/60 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>


  );
}

function Trust() {
  const items = [
    { icon: Shield, label: "Fully Insured" },
    { icon: Sparkles, label: "Ceramic Certified" },
    { icon: Droplets, label: "Eco Products" },
    { icon: Wand2, label: "10+ Years Experience" },
  ];
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="container-x py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-3 justify-center md:justify-start">
            <it.icon className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="section-y">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow justify-center">Signature Services</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">Detailing tailored to your vehicle</h2>
          <p className="mt-4 text-muted-foreground">Every service uses professional-grade products and a meticulous, hand-crafted process.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-luxury)] transition-all duration-500 hover:-translate-y-1">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={s.image} alt={s.title} width={800} height={600} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <div className="text-primary font-bold">from ${s.price}</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground min-h-[3rem]">{s.desc}</p>
                <BookingDialog
                  defaultService={s.title}
                  trigger={
                    <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                      Book this service <ArrowRight className="w-4 h-4" />
                    </button>
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Rental() {
  return (
    <section id="rental" className="section-y bg-muted/40 overflow-hidden relative">
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="container-x relative grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="eyebrow">Car Rental Services</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">Ride in confidence — rent our Black Truck.</h2>
          <p className="mt-4 text-muted-foreground max-w-lg">
            Reliable, powerful, and detailed to our own standard. Perfect for daily driving, moves, or business use.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Immaculately maintained", "Full insurance available", "Flexible pickup times", "Delivered spotless"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Starting at</div>
              <div className="font-display text-5xl font-bold text-primary">$200<span className="text-lg text-muted-foreground font-normal">/day</span></div>
            </div>
            <RentalDialog trigger={<button className="btn-primary hover:btn-primary-hover">Book Rental <Car className="w-4 h-4" /></button>} />
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-[var(--gradient-primary)] blur-3xl opacity-20 rounded-full" />
          <div className="relative grid grid-cols-6 grid-rows-6 gap-3 aspect-[5/4]">
            <img src={rentalExterior.url} alt="Black Lincoln Navigator exterior at sunset" loading="lazy" className="col-span-6 row-span-4 w-full h-full object-cover rounded-2xl shadow-[var(--shadow-luxury)]" />
            <img src={rentalInterior.url} alt="Navigator cockpit at night with city skyline" loading="lazy" className="col-span-3 row-span-2 w-full h-full object-cover rounded-xl shadow-[var(--shadow-soft)]" />
            <img src={rentalStarlight.url} alt="Navigator rear cabin with starlight headliner" loading="lazy" className="col-span-3 row-span-2 w-full h-full object-cover rounded-xl shadow-[var(--shadow-soft)]" />
          </div>
        </div>
      </div>
    </section>

  );
}

function Products() {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("active", true).order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <section id="products" className="section-y">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow justify-center">The Shop</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">Pro-grade products, at home.</h2>
          <p className="mt-4 text-muted-foreground">The same premium formulations we use in the studio, ready for your garage.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(products ?? []).map((p) => {
            const img = productImages[p.slug] ?? pShampoo;
            return (
              <div key={p.id} className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-[var(--shadow-luxury)] transition-all hover:-translate-y-1 duration-500">
                <div className="aspect-square bg-muted/60 overflow-hidden">
                  <img src={img} alt={p.name} width={600} height={600} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2.5rem]">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="font-bold text-lg text-primary">${Number(p.price).toFixed(2)}</div>
                    <button
                      onClick={() => {
                        addToCart({ id: p.id, name: p.name, price: Number(p.price), image: img });
                        toast.success(`${p.name} added to cart`);
                      }}
                      className="btn-primary hover:btn-primary-hover !py-2 !px-4 !text-xs"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="section-y bg-muted/40">
      <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="eyebrow">Before & After</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">Transformations you can feel.</h2>
          <p className="mt-4 text-muted-foreground">
            From dull and neglected to showroom-fresh — see the difference our meticulous process makes on every vehicle.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <div className="font-display text-5xl font-bold text-primary">500+</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Cars Detailed</div>
            </div>
            <div>
              <div className="font-display text-5xl font-bold text-primary">4.9<span className="text-2xl">/5</span></div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Customer Rating</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-luxury)]">
          <img src={beforeAfter} alt="Before and after detailing" width={1200} height={700} loading="lazy" className="w-full" />
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section-y">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow justify-center">Client Reviews</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">Trusted by Toronto's drivers</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-soft)]">
              <div className="flex gap-0.5 text-primary mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">"{t.text}"</p>
              <div className="mt-4 text-sm font-semibold">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section
      className="section-y relative text-white bg-black bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${storefront.url})` }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="container-x relative text-center">
        <h2 className="font-display text-4xl md:text-6xl font-bold">Ready to transform your vehicle?</h2>
        <p className="mt-4 text-white/85 max-w-xl mx-auto">
          Book online in under a minute. Our team will confirm your appointment shortly.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <BookingDialog trigger={
            <button className="rounded-full px-8 py-4 bg-primary text-primary-foreground font-semibold hover:scale-[1.02] transition-transform shadow-lg">
              Book Now
            </button>
          } />
          <a href="#contact" className="btn-ghost hover:bg-white/10 border-white/40 text-white">Contact Us</a>
        </div>
      </div>
    </section>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(5).max(1000),
});

function Contact() {
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("Couldn't send message.");
      return;
    }
    toast.success("Thanks! We'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section id="contact" className="section-y bg-muted/40">
      <div className="container-x grid lg:grid-cols-2 gap-12">
        <div>
          <div className="eyebrow">Get In Touch</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">Visit the studio.</h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Drop by, call, or send us a message — we're happy to answer questions and quote your vehicle.
          </p>
          <div className="mt-8 space-y-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center text-primary shrink-0"><MapPin className="w-5 h-5" /></div>
              <div>
                <div className="font-semibold">Address</div>
                <div className="text-sm text-muted-foreground">11 Steinway Blvd, Toronto, ON</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center text-primary shrink-0"><Phone className="w-5 h-5" /></div>
              <div>
                <div className="font-semibold">Phone</div>
                <a href="tel:+14165577455" className="text-sm text-muted-foreground hover:text-primary">+1 (416) 557-7455</a>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center text-primary shrink-0"><Clock className="w-5 h-5" /></div>
              <div>
                <div className="font-semibold">Hours</div>
                <div className="text-sm text-muted-foreground">
                  Mon – Fri: 10am – 9pm<br />
                  Saturday: 10am – 6pm
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-soft)]">
            <iframe
              title="Deep Auto Service location"
              src="https://www.google.com/maps?q=11+Steinway+Blvd+Toronto&output=embed"
              className="w-full h-64 border-0"
              loading="lazy"
            />
          </div>
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl bg-card border border-border p-8 shadow-[var(--shadow-soft)] grid gap-4 h-fit">
          <h3 className="font-display text-2xl font-semibold">Send us a message</h3>
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input name="name" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input name="phone" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Message</Label>
            <Textarea name="message" rows={5} required maxLength={1000} />
          </div>
          <Button type="submit" disabled={loading} className="rounded-full h-11">
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}

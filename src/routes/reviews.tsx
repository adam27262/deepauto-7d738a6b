import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Navbar, Footer } from "@/components/site/Nav";
import { BookingDialog } from "@/components/site/Dialogs";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews — Deep Auto Service" },
      { name: "description", content: "See what our customers say about Deep Auto Service. 4.9/5 rating, 500+ vehicles detailed in Toronto." },
      { property: "og:title", content: "Customer Reviews — Deep Auto Service" },
      { property: "og:description", content: "Hear what our satisfied customers have to say about our detailing services." },
    ],
  }),
  component: ReviewsPage,
});

const reviews = [
  { name: "Sarah M.", date: "June 2024", text: "Absolutely amazing service! My car looks brand new. The team was professional and took great care of my vehicle. Highly recommend!" },
  { name: "James T.", date: "May 2024", text: "Best detailing in Toronto. The ceramic coating they applied has kept my car looking pristine. Worth every penny!" },
  { name: "Michael R.", date: "April 2024", text: "Fast, friendly, and professional. They even beat the competitor's quote and delivered superior results!" },
  { name: "Jessica L.", date: "March 2024", text: "I was skeptical about getting my luxury car detailed, but Deep Auto proved they know exactly how to handle fine finishes. Exceptional work!" },
  { name: "David K.", date: "February 2024", text: "The paint correction service was exactly what my vehicle needed. My car looks showroom ready now. Outstanding attention to detail!" },
  { name: "Amanda S.", date: "January 2024", text: "Interior detailing was thorough and comprehensive. Everything smells fresh and looks immaculate. Great team!" },
  { name: "Chris P.", date: "December 2023", text: "Professional service from start to finish. They took time to explain everything they were doing and the results are incredible." },
  { name: "Nicole W.", date: "November 2023", text: "Booked online, showed up on time, and received world-class detailing. This is now my go-to place for vehicle care!" },
  { name: "Robert H.", date: "October 2023", text: "Fleet detailing service for our company vehicles has been stellar. Consistent quality and professional service every time." },
];

function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16 bg-primary text-primary-foreground">
        <div className="container-x">
          <h1 className="font-display text-5xl md:text-6xl font-bold">Customer Reviews</h1>
          <p className="mt-4 text-primary-foreground/85 max-w-2xl">Hear what our satisfied customers have to say about our detailing services.</p>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-x grid gap-6 md:grid-cols-3 mb-14">
          {[
            { k: "500+", v: "Vehicles Detailed" },
            { k: "4.9/5", v: "Average Rating" },
            { k: "100%", v: "Customer Satisfaction" },
          ].map((s) => (
            <div key={s.v} className="rounded-2xl bg-card border border-border p-8 text-center shadow-[var(--shadow-soft)]">
              <div className="font-display text-5xl font-bold text-primary">{s.k}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-luxury)] transition-shadow">
              <div className="flex gap-0.5 text-yellow-500 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 italic leading-relaxed">"{r.text}"</p>
              <div className="mt-5">
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-x text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Join Our Happy Customers</h2>
          <p className="mt-3 text-primary-foreground/85">Experience professional detailing that exceeds expectations.</p>
          <div className="mt-6 flex justify-center">
            <BookingDialog trigger={
              <button className="rounded-full px-8 py-4 bg-foreground text-background font-semibold hover:scale-[1.02] transition-transform">
                Book Your Appointment
              </button>
            } />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

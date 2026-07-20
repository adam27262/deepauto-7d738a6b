import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar, Footer } from "@/components/site/Nav";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Detailing Tips & Guides — Deep Auto Service Blog" },
      { name: "description", content: "Expert advice on automotive care, maintenance, and detailing techniques from Deep Auto Service." },
      { property: "og:title", content: "Detailing Tips & Guides — Deep Auto Service Blog" },
      { property: "og:description", content: "Expert advice on automotive care, maintenance, and detailing techniques." },
    ],
  }),
  component: BlogPage,
});

const posts = [
  { category: "Ceramic Coating", title: "The Ultimate Guide to Ceramic Coating", excerpt: "Learn everything you need to know about ceramic coatings, how they work, and why they are worth the investment for your vehicle.", date: "June 2024", read: "5 min read" },
  { category: "Maintenance", title: "5 Tips for Maintaining Your Paint Protection", excerpt: "Maximize the lifespan of your paint protection with these simple maintenance tips. Proper care ensures long-lasting results.", date: "May 2024", read: "4 min read" },
  { category: "Interior Care", title: "Interior Detailing: Why Professional Cleaning Matters", excerpt: "Discover how professional interior detailing goes beyond regular vacuuming to preserve your vehicle's interior condition and value.", date: "April 2024", read: "6 min read" },
  { category: "Seasonal Care", title: "Seasonal Vehicle Care Checklist", excerpt: "Different seasons require different care approaches. Follow our comprehensive checklist to keep your vehicle in top shape year-round.", date: "March 2024", read: "7 min read" },
  { category: "Paint Care", title: "Paint Correction vs. Waxing: What's the Difference?", excerpt: "Confused about paint correction? Learn how it differs from waxing and when you need each service for optimal paint health.", date: "February 2024", read: "5 min read" },
  { category: "Products", title: "Professional Products vs. Consumer Products: A Detailed Comparison", excerpt: "Understand why professional-grade detailing products deliver superior results compared to off-the-shelf alternatives.", date: "January 2024", read: "6 min read" },
  { category: "Interior Care", title: "Odor Removal Techniques That Actually Work", excerpt: "Say goodbye to stubborn smells. Learn the professional techniques we use to eliminate odors and refresh your vehicle's interior.", date: "December 2023", read: "4 min read" },
  { category: "Restoration", title: "Headlight Restoration: Restore Clarity and Safety", excerpt: "Oxidized headlights reduce visibility and vehicle appeal. Discover how professional restoration can restore clarity and brightness.", date: "November 2023", read: "5 min read" },
];

function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16 bg-primary text-primary-foreground">
        <div className="container-x">
          <h1 className="font-display text-5xl md:text-6xl font-bold">Detailing Tips & Guides</h1>
          <p className="mt-4 text-primary-foreground/85 max-w-2xl">Expert advice on automotive care, maintenance, and detailing techniques.</p>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.title} className="rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-luxury)] hover:-translate-y-1 transition-all duration-500 flex flex-col">
              <span className="self-start rounded-md bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1">{p.category}</span>
              <h2 className="mt-4 font-display text-xl font-semibold leading-snug">{p.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
              <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                <span>{p.date}</span>
                <span>{p.read}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container-x text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Want Professional Help Instead?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Our team can handle all your detailing needs with professional expertise and premium results.</p>
          <div className="mt-6 flex justify-center">
            <Link to="/" hash="services" className="btn-primary hover:btn-primary-hover">View Services</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

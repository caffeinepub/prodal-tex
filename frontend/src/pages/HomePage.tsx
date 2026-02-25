import { Link } from '@tanstack/react-router';
import { ArrowRight, Award, Globe, Truck, ChevronRight } from 'lucide-react';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { data: products, isLoading, error } = useGetAllProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/generated/fabric-hero-banner.dim_1400x600.png')" }}
      >
        <div className="absolute inset-0 bg-charcoal/70" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-teal font-body text-sm tracking-[0.3em] uppercase mb-4">
            Premium Fabric Supplier
          </p>
          <h1 className="font-heading text-5xl md:text-7xl text-white mb-6 leading-tight">
            Crafting Excellence<br />in Every Thread
          </h1>
          <p className="text-white/90 font-body text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            PRODAL TEX delivers premium quality fabrics to manufacturers and designers worldwide.
            Trusted for consistency, quality, and reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-teal hover:bg-teal/90 text-white font-body px-8">
              <Link to="/products">Explore Fabrics <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal font-body px-8">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-charcoal py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Award, title: 'Premium Quality', desc: 'ISO certified manufacturing with rigorous quality control' },
            { icon: Globe, title: 'Global Export', desc: 'Supplying to manufacturers across 20+ countries' },
            { icon: Truck, title: 'Bulk Orders', desc: 'Minimum order quantities starting from 300 kg' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 text-white">
              <div className="p-2 bg-teal/20 rounded-lg flex-shrink-0">
                <Icon className="h-6 w-6 text-teal" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold mb-1">{title}</h3>
                <p className="text-white/90 font-body text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-offwhite">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-teal font-body text-sm tracking-[0.3em] uppercase mb-3">Our Collection</p>
            <h2 className="font-heading text-4xl text-charcoal mb-4">Featured Fabrics</h2>
            <p className="text-foreground/70 font-body max-w-xl mx-auto">
              Explore our curated selection of premium fabrics, crafted for quality and performance.
            </p>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-border">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-700 font-body font-medium mb-2">Unable to load products</p>
                <p className="text-red-600 font-body text-sm">Please try again later or contact us directly.</p>
              </div>
            </div>
          )}

          {!isLoading && !error && products && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          )}

          {!isLoading && !error && products && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60 font-body">No products available yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-teal text-teal hover:bg-teal hover:text-white font-body px-8">
              <Link to="/products">View All Fabrics <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Clothing Section */}
      <section
        className="relative py-24 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/generated/combined-fabrics-clothing-banner.dim_1400x600.png')" }}
      >
        <div className="absolute inset-0 bg-charcoal/65" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-white">
            <p className="text-teal font-body text-sm tracking-[0.3em] uppercase mb-3">From Fabric to Fashion</p>
            <h2 className="font-heading text-4xl md:text-5xl mb-6 leading-tight">
              Powering the Clothing Industry
            </h2>
            <p className="text-white/90 font-body text-lg mb-8 leading-relaxed">
              Our fabrics are trusted by leading garment manufacturers and fashion brands.
              From sportswear to formal wear, PRODAL TEX delivers the quality your designs deserve.
            </p>
            <Button asChild className="bg-teal hover:bg-teal/90 text-white font-body">
              <Link to="/contact">Partner With Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="flex-1">
            <img
              src="/assets/generated/clothing-category-banner.dim_600x400.png"
              alt="Clothing manufacturing"
              className="rounded-lg shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-teal py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl text-white mb-4">Ready to Source Premium Fabrics?</h2>
          <p className="text-white/90 font-body text-lg mb-8">
            Contact our team today for bulk pricing, samples, and custom orders.
          </p>
          <Button asChild size="lg" className="bg-white text-teal hover:bg-offwhite font-body px-10">
            <Link to="/contact">Request a Quote Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

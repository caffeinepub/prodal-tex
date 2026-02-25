import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2, Package, Truck, Award, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useGetAllProducts } from '../hooks/useQueries';

const sellingPoints = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Every fabric roll meets rigorous quality standards — consistent color, weight, and texture across every batch.',
  },
  {
    icon: Package,
    title: 'Wide Color Range',
    description: 'From bold primaries to subtle pastels, our dyed fabric collection spans hundreds of shades to match any design vision.',
  },
  {
    icon: Truck,
    title: 'Bulk Availability',
    description: 'Reliable supply for large-scale manufacturing with flexible minimum order quantities and fast dispatch.',
  },
  {
    icon: CheckCircle2,
    title: 'Certified Fabric',
    description: 'Our Polyester Knitted Dyed Fabrics are tested for colorfastness, shrinkage, and durability to international standards.',
  },
];

export default function HomePage() {
  const { data: products, isLoading } = useGetAllProducts();

  const featuredProducts = products?.slice(0, 3) ?? [];

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[520px] md:min-h-[600px] flex items-center overflow-hidden bg-charcoal-dark">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/fabric-hero-banner.dim_1400x600.png"
            alt="Premium Polyester Knitted Dyed Fabric"
            className="w-full h-full object-cover opacity-70"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-dark/90 via-charcoal-dark/60 to-charcoal-dark/30" />
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <span className="inline-block text-teal-light font-body text-sm font-medium tracking-widest uppercase mb-4">
              Premium Textile Manufacturer
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-offwhite leading-tight mb-6">
              PRODAL TEX
              <span className="block text-teal-light italic font-normal text-3xl md:text-4xl mt-2">
                Polyester Knitted Dyed Fabric
              </span>
            </h1>
            <p className="font-body text-base md:text-lg text-offwhite/80 leading-relaxed mb-8 max-w-xl">
              Supplying premium quality Polyester Knitted Dyed Fabrics to manufacturers, designers, and retailers worldwide. Exceptional color consistency, superior texture, and reliable bulk supply.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-teal hover:bg-teal-light text-offwhite font-body font-medium tracking-wide gap-2 border-0 shadow-lg"
                >
                  Browse Collection
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-charcoal hover:bg-charcoal-light text-offwhite font-body font-medium tracking-wide border border-offwhite/40 hover:border-offwhite/60 shadow-lg"
                >
                  Request a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Strip ──────────────────────────────────────────────────── */}
      <section className="bg-teal py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-offwhite/90 font-body text-sm font-medium tracking-wide">
            {['Polyester Knitted', 'Dyed Fabric', 'Bulk Orders', 'Custom Colors', 'Fast Dispatch'].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-offwhite/60" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / Intro ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-teal font-body text-sm font-medium tracking-widest uppercase">About PRODAL TEX</span>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mt-3 mb-6">
              Crafting Excellence in Every Thread
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
              At PRODAL TEX, we specialize in manufacturing and supplying premium Polyester Knitted Dyed Fabrics. Our state-of-the-art dyeing processes ensure vibrant, long-lasting colors while maintaining the soft hand-feel and durability that our clients demand. From fashion apparel to sportswear and home textiles, our fabrics power the world's leading brands.
            </p>
          </div>
        </div>
      </section>

      {/* ── Selling Points ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-teal font-body text-sm font-medium tracking-widest uppercase">Why Choose Us</span>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mt-3">
              The PRODAL TEX Difference
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {sellingPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4 shadow-xs hover:shadow-card transition-shadow"
                >
                  <div className="w-11 h-11 rounded-md bg-teal/10 flex items-center justify-center">
                    <Icon size={22} className="text-teal" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-2">{point.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{point.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Clothing Section ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-charcoal-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-teal-light font-body text-sm font-medium tracking-widest uppercase">Ready-Made Garments</span>
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-offwhite mt-2">
                Clothing
              </h2>
              <p className="font-body text-base text-offwhite/60 mt-2">
                Premium ready-made garments crafted from our finest fabrics
              </p>
            </div>
            <Badge
              variant="outline"
              className="self-start sm:self-auto border-teal-light/40 text-teal-light font-body text-xs tracking-widest uppercase px-3 py-1.5"
            >
              Coming Soon
            </Badge>
          </div>
        </div>
      </section>

      {/* ── Fabrics Section ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-teal font-body text-sm font-medium tracking-widest uppercase">Our Collection</span>
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mt-2">
                Fabrics
              </h2>
              <p className="font-body text-base text-muted-foreground mt-2">
                Premium textile materials for every manufacturing need
              </p>
            </div>
            <Link to="/products">
              <Button
                variant="outline"
                className="border-teal text-teal hover:bg-teal hover:text-offwhite font-body font-medium gap-2 transition-colors"
              >
                View All Fabrics
                <ArrowRight size={15} />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-teal" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center">
                <Package size={28} className="text-teal/60" />
              </div>
              <p className="font-body text-base font-medium text-foreground/70">
                No products yet
              </p>
              <p className="font-body text-sm text-muted-foreground text-center max-w-xs">
                Check back soon — our fabric collection will be listed here shortly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-charcoal-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-offwhite mb-4">
            Ready to Order Premium Fabric?
          </h2>
          <p className="font-body text-base text-offwhite/60 mb-8 max-w-xl mx-auto">
            Contact our team for pricing, samples, and bulk order inquiries. We respond within 24 hours.
          </p>
          <Link to="/contact">
            <Button
              size="lg"
              className="bg-teal hover:bg-teal-light text-offwhite font-body font-medium tracking-wide gap-2 border-0 shadow-lg"
            >
              Contact PRODAL TEX
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { Loader2, ArrowLeft, Layers, Ruler, Package, Tag, MessageSquare, IndianRupee } from 'lucide-react';
import { useGetProduct } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ProductWidth } from '../backend';

const PLACEHOLDER = '/assets/generated/fabric-swatch-placeholder.dim_600x600.png';

// Map backend imageFilename values to actual static asset paths
const IMAGE_MAP: Record<string, string> = {
  'ferrari_cheque.jpg': '/assets/IMG_8128-1.jpeg',
  'ferrari-cheque.jpg': '/assets/IMG_8128-1.jpeg',
  'ferrari-cheque-swatch.jpg': '/assets/IMG_8128-1.jpeg',
};

function resolveImageSrc(imageFilename: string): string {
  if (!imageFilename) return PLACEHOLDER;
  if (IMAGE_MAP[imageFilename]) return IMAGE_MAP[imageFilename];
  return `/assets/${imageFilename}`;
}

function formatWidth(width: ProductWidth): string {
  if (width.__kind__ === 'inches') {
    return `${Number(width.inches)} inches`;
  }
  return `${Number(width.centimeters)} cm`;
}

export default function ProductDetailPage() {
  const { id } = useParams({ from: '/products/$id' });
  const navigate = useNavigate();
  const productId = BigInt(id);
  const { data: product, isLoading, error } = useGetProduct(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={40} className="animate-spin text-teal" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="font-body text-muted-foreground text-lg">Product not found.</p>
        <Link to="/products">
          <Button variant="outline" className="border-teal text-teal hover:bg-teal hover:text-offwhite font-body gap-2">
            <ArrowLeft size={15} />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const imageSrc = resolveImageSrc(product.imageFilename);

  const specs = [
    { icon: Layers, label: 'Weight', value: `${Number(product.weightGSM)} GSM` },
    { icon: Ruler, label: 'Width', value: formatWidth(product.width) },
    { icon: Package, label: 'Min. Order', value: `${Number(product.minOrderQuantity)} kg` },
    { icon: IndianRupee, label: 'Rate', value: `₹${product.pricePerMeter.toFixed(0)}/++ kg` },
    { icon: Tag, label: 'Fabric Type', value: product.fabricType },
    { icon: MessageSquare, label: 'Color', value: product.color },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-secondary/30 border-b border-border py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm font-body text-muted-foreground">
            <Link to="/" className="hover:text-teal transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-teal transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden border border-border shadow-card bg-muted aspect-square">
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <Badge className="bg-teal/10 text-teal border-teal/20 font-body text-xs mb-3">
                {product.fabricType}
              </Badge>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>
              <p className="font-body text-base text-muted-foreground mt-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-teal">
                ₹{product.pricePerMeter.toFixed(0)}
              </span>
              <span className="font-body text-sm text-muted-foreground">/++ kg</span>
            </div>

            <Separator />

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-secondary/40 rounded-md p-4 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs font-body text-muted-foreground uppercase tracking-wide">
                    <Icon size={13} className="text-teal" />
                    {label}
                  </div>
                  <span className="font-body text-sm font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-teal hover:bg-teal-light text-offwhite font-body font-medium tracking-wide gap-2 border-0 flex-1"
                onClick={() =>
                  navigate({
                    to: '/contact',
                    search: { productId: product.id.toString() },
                  })
                }
              >
                <MessageSquare size={17} />
                Inquire Now
              </Button>
              <Link to="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary font-body font-medium gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft size={15} />
                  Back to Products
                </Button>
              </Link>
            </div>

            <p className="text-xs font-body text-muted-foreground">
              Minimum order quantity: <strong>{Number(product.minOrderQuantity)} kg</strong>. Contact us for custom quantities or color matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

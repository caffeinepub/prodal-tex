import { Link } from '@tanstack/react-router';
import type { FabricProduct, ProductWidth } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layers, Ruler } from 'lucide-react';

interface ProductCardProps {
  product: FabricProduct;
}

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

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = resolveImageSrc(product.imageFilename);

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-muted">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-teal text-offwhite text-xs font-body font-medium border-0 shadow-sm">
            {product.fabricType}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground leading-snug group-hover:text-teal transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-body text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-3 text-xs font-body text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Layers size={12} className="text-teal" />
            <span className="font-medium text-foreground">{Number(product.weightGSM)} GSM</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler size={12} className="text-teal" />
            <span className="font-medium text-foreground">{formatWidth(product.width)}</span>
          </span>
        </div>

        {/* Color */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-body text-muted-foreground">Color:</span>
          <span className="text-xs font-body font-medium text-foreground bg-muted px-2 py-0.5 rounded-full">
            {product.color}
          </span>
        </div>

        {/* Price & CTA */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-lg font-heading font-semibold text-teal">
              ₹{product.pricePerMeter.toFixed(0)}
            </span>
            <span className="text-xs font-body text-muted-foreground ml-1">/++ kg</span>
          </div>
          <Link to="/products/$id" params={{ id: product.id.toString() }}>
            <Button
              size="sm"
              variant="outline"
              className="border-teal text-teal hover:bg-teal hover:text-offwhite font-body font-medium gap-1.5 transition-colors"
            >
              View Details
              <ArrowRight size={13} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Link } from '@tanstack/react-router';
import { Tag, Weight, Ruler, Layers } from 'lucide-react';
import type { FabricProduct, ProductWidth } from '../backend';

const IMAGE_MAP: Record<string, string> = {
  'ferrari_cheque.jpg': '/assets/generated/ferrari-cheque-swatch.dim_800x800.jpg',
  'ferrari-cheque.jpg': '/assets/generated/ferrari-cheque-swatch.dim_800x800.jpg',
  'ferrari_cheque_swatch.jpg': '/assets/generated/ferrari-cheque-swatch.dim_800x800.jpg',
};

function getImageSrc(filename: string): string {
  if (IMAGE_MAP[filename]) return IMAGE_MAP[filename];
  if (filename.startsWith('http')) return filename;
  return '/assets/generated/fabric-swatch-placeholder.dim_600x600.png';
}

function formatWidth(width: ProductWidth): string {
  if (width.__kind__ === 'inches') return `${width.inches} inches`;
  if (width.__kind__ === 'centimeters') return `${width.centimeters} cm`;
  return 'N/A';
}

interface ProductCardProps {
  product: FabricProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = getImageSrc(product.imageFilename);

  return (
    <Link
      to="/products/$id"
      params={{ id: product.id.toString() }}
      className="group block bg-white rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-card transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/generated/fabric-swatch-placeholder.dim_600x600.png';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-teal text-white text-xs font-body px-2 py-1 rounded-full">
            {product.fabricType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading text-xl text-charcoal mb-1 group-hover:text-teal transition-colors">
          {product.name}
        </h3>
        <p className="text-foreground/60 font-body text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-body text-foreground/70">
            <Layers className="h-3.5 w-3.5 text-teal flex-shrink-0" />
            <span>{Number(product.weightGSM)} GSM</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-body text-foreground/70">
            <Ruler className="h-3.5 w-3.5 text-teal flex-shrink-0" />
            <span>{formatWidth(product.width)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-body text-foreground/70">
            <Weight className="h-3.5 w-3.5 text-teal flex-shrink-0" />
            <span>Min {Number(product.minOrderQuantity)} kg</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-body text-foreground/70">
            <Tag className="h-3.5 w-3.5 text-teal flex-shrink-0" />
            <span>{product.color}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="font-heading text-lg text-charcoal">
              ₹{product.pricePerMeter.toFixed(0)}
            </span>
            <span className="text-foreground/50 font-body text-xs">/++ kg</span>
          </div>
          <span className="text-teal font-body text-sm font-medium group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

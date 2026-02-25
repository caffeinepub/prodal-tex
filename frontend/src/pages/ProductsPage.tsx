import { useState, useMemo } from 'react';
import { Loader2, SlidersHorizontal, X, Package } from 'lucide-react';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProductsPage() {
  const { data: products, isLoading, error } = useGetAllProducts();
  const [colorFilter, setColorFilter] = useState<string>('all');

  const uniqueColors = useMemo(() => {
    if (!products) return [];
    const colors = Array.from(new Set(products.map((p) => p.color)));
    return colors.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (colorFilter === 'all') return products;
    return products.filter((p) => p.color === colorFilter);
  }, [products, colorFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-charcoal-dark py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-teal-light font-body text-sm font-medium tracking-widest uppercase">
            Our Collection
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-offwhite mt-3 mb-4">
            Fabric Products
          </h1>
          <p className="font-body text-base text-offwhite/60 max-w-xl mx-auto">
            Explore our full range of premium Polyester Knitted Dyed Fabrics — available in a wide spectrum of colors, weights, and widths.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-card sticky top-16 md:top-20 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
            <SlidersHorizontal size={15} className="text-teal" />
            <span>Filter by Color:</span>
          </div>
          <Select value={colorFilter} onValueChange={setColorFilter}>
            <SelectTrigger className="w-48 font-body text-sm border-border">
              <SelectValue placeholder="All Colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              {uniqueColors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {colorFilter !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setColorFilter('all')}
              className="text-muted-foreground hover:text-foreground font-body gap-1.5"
            >
              <X size={13} />
              Clear
            </Button>
          )}
          {!isLoading && (
            <span className="ml-auto text-xs font-body text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-teal" />
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="font-body text-destructive">Failed to load products. Please try again.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center">
              <Package size={36} className="text-teal/50" />
            </div>
            <p className="font-body text-lg font-medium text-foreground/70">
              {colorFilter !== 'all' ? `No products found for "${colorFilter}"` : 'No products yet'}
            </p>
            <p className="font-body text-sm text-muted-foreground text-center max-w-sm">
              {colorFilter !== 'all'
                ? 'Try a different color filter or browse the full collection.'
                : 'No fabric products have been added yet — check back soon!'}
            </p>
            {colorFilter !== 'all' && (
              <Button
                variant="outline"
                className="mt-2 border-teal text-teal hover:bg-teal hover:text-offwhite font-body"
                onClick={() => setColorFilter('all')}
              >
                Show All Products
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

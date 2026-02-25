import { useState } from 'react';
import { Package, RefreshCw, AlertCircle } from 'lucide-react';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  const { data: products, isLoading, error, refetch, isFetching } = useGetAllProducts();
  const [selectedColor, setSelectedColor] = useState<string>('All');

  const colors = ['All', ...Array.from(new Set((products ?? []).map((p) => p.color)))];

  const filtered =
    selectedColor === 'All'
      ? (products ?? [])
      : (products ?? []).filter((p) => p.color === selectedColor);

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Page Header */}
      <section className="bg-charcoal py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-teal font-body text-sm tracking-[0.3em] uppercase mb-3">Our Collection</p>
          <h1 className="font-heading text-5xl text-white mb-4">Premium Fabrics</h1>
          <p className="text-white/90 font-body text-lg max-w-2xl mx-auto">
            Explore our full range of high-quality fabrics, available for bulk orders.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border bg-white">
                <Skeleton className="h-64 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="font-heading text-xl text-charcoal mb-2">Unable to Load Products</h2>
              <p className="text-red-600 font-body text-sm mb-6">
                We couldn't fetch the product list. Please try again.
              </p>
              <Button
                onClick={() => refetch()}
                disabled={isFetching}
                className="bg-teal hover:bg-teal/90 text-white font-body"
              >
                {isFetching ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <>
            {/* Color Filter */}
            {colors.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full font-body text-sm transition-colors border ${
                      selectedColor === color
                        ? 'bg-teal text-white border-teal'
                        : 'bg-white text-charcoal border-border hover:border-teal hover:text-teal'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Package className="h-16 w-16 text-teal/40 mb-4" />
                <h2 className="font-heading text-2xl text-charcoal mb-2">No products yet</h2>
                <p className="text-foreground/60 font-body max-w-sm">
                  Our fabric collection is being updated. Please check back soon or contact us directly.
                </p>
              </div>
            )}

            {/* Product Cards */}
            {filtered.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((product) => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

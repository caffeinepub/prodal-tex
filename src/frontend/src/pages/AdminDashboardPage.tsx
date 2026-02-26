import { useState, useEffect } from 'react';
import { useGetAllInquiries } from '@/hooks/useQueries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InboxIcon, LockIcon, EyeIcon, EyeOffIcon, RefreshCwIcon } from 'lucide-react';

const ADMIN_PASSWORD = 'luckygoyal0001';

function formatTimestamp(timestamp: bigint): string {
  if (timestamp === 0n) return '—';
  const ms = Number(timestamp / 1_000_000n);
  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="border-white/10">
          {Array.from({ length: 8 }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full bg-white/10" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function PasswordScreen({
  onSubmit,
}: {
  onSubmit: (password: string) => void;
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError('');
      onSubmit(password);
    } else {
      setError('Incorrect password. Access denied.');
    }
  };

  return (
    <main className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center">
            <LockIcon size={36} className="text-teal-light" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="font-heading text-3xl font-bold text-offwhite tracking-wide mb-2 text-center">
          Admin Dashboard
        </h1>
        <p className="font-body text-offwhite/60 text-sm leading-relaxed mb-8 text-center">
          Enter the admin password to access the enquiries dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="font-body text-offwhite/80 text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter admin password"
                className="bg-white/5 border-white/20 text-offwhite placeholder:text-offwhite/30 font-body pr-10 focus:border-teal/50 focus:ring-teal/20"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-offwhite/40 hover:text-offwhite/70 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="font-body text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-teal hover:bg-teal-light text-offwhite font-body font-medium tracking-wide border-0 py-2 h-auto"
          >
            <LockIcon size={15} className="mr-2" />
            Access Dashboard
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    data: inquiries,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllInquiries(isAuthenticated);

  // When authentication state becomes true, explicitly trigger a fetch
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  if (!isAuthenticated) {
    return <PasswordScreen onSubmit={() => setIsAuthenticated(true)} />;
  }

  return (
    <main className="min-h-screen bg-charcoal py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-offwhite tracking-wide">
              Admin Dashboard
            </h1>
            <p className="mt-2 font-body text-offwhite/60 text-sm">
              All submitted quote requests from customers
            </p>
            {!isLoading && !isError && inquiries && (
              <div className="mt-3">
                <Badge className="bg-teal/20 text-teal-light border border-teal/30 font-body text-xs px-3 py-1">
                  {inquiries.length} {inquiries.length === 1 ? 'Inquiry' : 'Inquiries'} Total
                </Badge>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAuthenticated(false)}
            className="self-start border-white/20 text-offwhite/70 hover:text-offwhite hover:bg-white/10 font-body text-xs tracking-wide"
          >
            <LockIcon size={14} className="mr-2" />
            Lock Dashboard
          </Button>
        </div>

        {/* Error State */}
        {isError && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-6 py-5 font-body text-sm">
            <p className="text-red-400 font-medium mb-1">Failed to load inquiries</p>
            <p className="text-red-400/70 text-xs mb-3">
              {error instanceof Error ? error.message : 'An unexpected error occurred.'}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs"
            >
              <RefreshCwIcon size={13} className="mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* Table Card */}
        {!isError && (
          <div className="rounded-lg border border-white/10 bg-charcoal-dark shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-teal-light font-body font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                      Customer Name
                    </TableHead>
                    <TableHead className="text-teal-light font-body font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                      Email
                    </TableHead>
                    <TableHead className="text-teal-light font-body font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                      Phone
                    </TableHead>
                    <TableHead className="text-teal-light font-body font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                      Company
                    </TableHead>
                    <TableHead className="text-teal-light font-body font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                      Product ID
                    </TableHead>
                    <TableHead className="text-teal-light font-body font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                      Quantity
                    </TableHead>
                    <TableHead className="text-teal-light font-body font-semibold text-xs uppercase tracking-wider whitespace-nowrap min-w-[200px]">
                      Message
                    </TableHead>
                    <TableHead className="text-teal-light font-body font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                      Date & Time
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton />
                  ) : inquiries && inquiries.length > 0 ? (
                    inquiries.map((inquiry) => (
                      <TableRow
                        key={inquiry.id.toString()}
                        className="border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <TableCell className="text-offwhite font-body font-medium whitespace-nowrap">
                          {inquiry.customerName}
                        </TableCell>
                        <TableCell className="text-offwhite/80 font-body text-sm whitespace-nowrap">
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="hover:text-teal-light transition-colors"
                          >
                            {inquiry.email}
                          </a>
                        </TableCell>
                        <TableCell className="text-offwhite/80 font-body text-sm whitespace-nowrap">
                          <a
                            href={`tel:${inquiry.phone}`}
                            className="hover:text-teal-light transition-colors"
                          >
                            {inquiry.phone}
                          </a>
                        </TableCell>
                        <TableCell className="text-offwhite/70 font-body text-sm whitespace-nowrap">
                          {inquiry.companyName ?? (
                            <span className="text-offwhite/30 italic">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-offwhite/70 font-body text-sm whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className="border-teal/30 text-teal-light font-body text-xs"
                          >
                            #{inquiry.productId.toString()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-offwhite/80 font-body text-sm whitespace-nowrap">
                          {inquiry.quantityRequired.toString()} m
                        </TableCell>
                        <TableCell className="text-offwhite/70 font-body text-sm max-w-xs">
                          <p className="line-clamp-2 leading-relaxed">{inquiry.message}</p>
                        </TableCell>
                        <TableCell className="text-offwhite/60 font-body text-xs whitespace-nowrap">
                          {formatTimestamp(inquiry.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableCell colSpan={8} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-offwhite/40">
                          <InboxIcon size={40} strokeWidth={1.2} />
                          <p className="font-body text-sm">No inquiries submitted yet.</p>
                          <p className="font-body text-xs text-offwhite/25">
                            Customer quote requests will appear here once submitted.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

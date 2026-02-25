import { useGetAllInquiries } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
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
import { InboxIcon, LockIcon, LogInIcon, LogOutIcon, ShieldOffIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

function formatTimestamp(timestamp: bigint): string {
  if (timestamp === 0n) return '—';
  // ICP timestamps are in nanoseconds
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

function LoginScreen({
  onLogin,
  isLoggingIn,
}: {
  onLogin: () => void;
  isLoggingIn: boolean;
}) {
  return (
    <main className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center">
            <LockIcon size={36} className="text-teal-light" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="font-heading text-3xl font-bold text-offwhite tracking-wide mb-3">
          Admin Access Only
        </h1>
        <p className="font-body text-offwhite/60 text-sm leading-relaxed mb-8">
          This area is restricted to authorised administrators. Please log in with your identity to
          access the dashboard.
        </p>
        <Button
          onClick={onLogin}
          disabled={isLoggingIn}
          className="bg-teal hover:bg-teal-light text-offwhite font-body font-medium tracking-wide border-0 px-8 py-2 h-auto"
        >
          {isLoggingIn ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-offwhite border-t-transparent inline-block" />
              Logging in…
            </>
          ) : (
            <>
              <LogInIcon size={16} className="mr-2" />
              Login to Access Dashboard
            </>
          )}
        </Button>
        <p className="mt-4 font-body text-offwhite/30 text-xs">
          Secure authentication via Internet Identity
        </p>
      </div>
    </main>
  );
}

function UnauthorizedScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <main className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <ShieldOffIcon size={36} className="text-red-400" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="font-heading text-3xl font-bold text-offwhite tracking-wide mb-3">
          Access Denied
        </h1>
        <p className="font-body text-offwhite/60 text-sm leading-relaxed mb-2">
          Your account does not have permission to view the admin dashboard.
        </p>
        <p className="font-body text-offwhite/40 text-xs leading-relaxed mb-8">
          This dashboard is restricted to the site owner only. If you believe this is a mistake,
          please contact the administrator.
        </p>
        <Button
          onClick={onLogout}
          variant="outline"
          className="border-white/20 text-offwhite/70 hover:text-offwhite hover:bg-white/10 font-body text-sm tracking-wide px-8 py-2 h-auto"
        >
          <LogOutIcon size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </main>
  );
}

function isAuthorizationError(error: unknown): boolean {
  if (!error) return false;
  const msg = String(error);
  return (
    msg.toLowerCase().includes('unauthorized') ||
    msg.toLowerCase().includes('only admin') ||
    msg.toLowerCase().includes('not authorized') ||
    msg.toLowerCase().includes('access denied')
  );
}

export default function AdminDashboardPage() {
  const { identity, login, clear, isLoggingIn, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const {
    data: inquiries,
    isLoading,
    isError,
    error,
  } = useGetAllInquiries();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  // Show loading state while identity is being restored from storage
  if (isInitializing) {
    return (
      <main className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-offwhite/50">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
          <p className="font-body text-sm">Checking authentication…</p>
        </div>
      </main>
    );
  }

  // Show login screen for unauthenticated users
  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} isLoggingIn={isLoggingIn} />;
  }

  // Show access denied screen when authenticated but not authorized (backend trap)
  if (isError && isAuthorizationError(error)) {
    return <UnauthorizedScreen onLogout={handleLogout} />;
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
            onClick={handleLogout}
            className="self-start border-white/20 text-offwhite/70 hover:text-offwhite hover:bg-white/10 font-body text-xs tracking-wide"
          >
            <LogOutIcon size={14} className="mr-2" />
            Logout
          </Button>
        </div>

        {/* Generic Error State (non-auth errors) */}
        {isError && !isAuthorizationError(error) && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400 font-body text-sm">
            Failed to load inquiries. Please try refreshing the page.
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

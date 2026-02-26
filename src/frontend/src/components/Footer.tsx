import { Link } from '@tanstack/react-router';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'prodal-tex');

  return (
    <footer className="bg-charcoal-dark text-offwhite border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/prodal-tex-logo.dim_400x100.png"
                alt="PRODAL TEX"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const sibling = target.nextElementSibling as HTMLElement | null;
                  if (sibling) sibling.style.display = 'block';
                }}
              />
              <span className="hidden font-heading text-xl font-semibold text-offwhite" style={{ display: 'none' }}>
                PRODAL TEX
              </span>
            </div>
            <p className="text-sm font-body leading-relaxed text-white/85">
              Premium Polyester Knitted Dyed Fabric — crafted for quality, designed for excellence. Trusted by manufacturers and designers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-base font-semibold text-white tracking-wide">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Our Products', path: '/products' },
                { label: 'Contact & Inquiries', path: '/contact' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-body text-white/85 hover:text-teal-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-heading text-base font-semibold text-white tracking-wide">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 text-sm font-body text-white/85">
                <Mail size={15} className="mt-0.5 text-teal-light shrink-0" />
                <a href="mailto:Lakshaypgoyal@gmail.com" className="hover:text-teal-light transition-colors break-all">
                  Lakshaypgoyal@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm font-body text-white/85">
                <Phone size={15} className="mt-0.5 text-teal-light shrink-0" />
                <a href="tel:+919978625857" className="hover:text-teal-light transition-colors">
                  +91 99786 25857
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm font-body text-white/85">
                <MapPin size={15} className="mt-0.5 text-teal-light shrink-0" />
                <span className="leading-relaxed">
                  Shop No. UG 18/A to 27/A, Sangini Trade Center,<br />
                  Sarolikumbhariya Road, Kubharia Gaon,<br />
                  Sayam Sangini, Surat – 395010
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-body text-white/70">
          <span>© {year} PRODAL TEX. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with{' '}
            <Heart size={12} className="text-teal-light fill-teal-light mx-0.5" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-light hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useGetAllProducts, useSubmitInquiry } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, Loader2, Mail, Phone, MapPin, Clock } from 'lucide-react';

interface FormState {
  customerName: string;
  email: string;
  phone: string;
  companyName: string;
  productId: string;
  quantityRequired: string;
  message: string;
}

const initialForm: FormState = {
  customerName: '',
  email: '',
  phone: '',
  companyName: '',
  productId: '',
  quantityRequired: '',
  message: '',
};

export default function ContactPage() {
  const search = useSearch({ from: '/contact' }) as { productId?: string };
  const { data: products } = useGetAllProducts();
  const submitInquiry = useSubmitInquiry();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  // Pre-select product from URL param
  useEffect(() => {
    if (search?.productId) {
      setForm((prev) => ({ ...prev, productId: search.productId! }));
    }
  }, [search?.productId]);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'A valid email is required.';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!form.productId) newErrors.productId = 'Please select a product.';
    if (!form.quantityRequired || isNaN(Number(form.quantityRequired)) || Number(form.quantityRequired) <= 0)
      newErrors.quantityRequired = 'Enter a valid quantity.';
    if (!form.message.trim()) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    submitInquiry.mutate(
      {
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        companyName: form.companyName.trim() || null,
        productId: BigInt(form.productId),
        quantityRequired: BigInt(Math.round(Number(form.quantityRequired))),
        message: form.message.trim(),
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setForm(initialForm);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-charcoal-dark py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-teal-light font-body text-sm font-medium tracking-widest uppercase">
            Get in Touch
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-offwhite mt-3 mb-4">
            Contact & Inquiries
          </h1>
          <p className="font-body text-base text-offwhite/60 max-w-xl mx-auto">
            Interested in our fabrics? Fill out the form below and our team will get back to you within 24 hours.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Contact Info Sidebar */}
          <aside className="space-y-8">
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={16} className="text-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-body text-muted-foreground uppercase tracking-wide">Email</p>
                    <a
                      href="mailto:Lakshaypgoyal@gmail.com"
                      className="text-sm font-body font-medium text-foreground hover:text-teal transition-colors break-all"
                    >
                      Lakshaypgoyal@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone size={16} className="text-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-body text-muted-foreground uppercase tracking-wide">Phone</p>
                    <a
                      href="tel:+919978625857"
                      className="text-sm font-body font-medium text-foreground hover:text-teal transition-colors"
                    >
                      +91 99786 25857
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} className="text-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-body text-muted-foreground uppercase tracking-wide">Address</p>
                    <p className="text-sm font-body font-medium text-foreground leading-relaxed">
                      Shop No. UG 18/A to 27/A,<br />
                      Sangini Trade Center,<br />
                      Sarolikumbhariya Road,<br />
                      Kubharia Gaon, Sayam Sangini,<br />
                      Surat – 395010
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={16} className="text-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-body text-muted-foreground uppercase tracking-wide">Business Hours</p>
                    <p className="text-sm font-body font-medium text-foreground">Mon–Sat, 9am–7pm</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-teal/5 border border-teal/20 rounded-lg p-5">
              <h3 className="font-heading text-base font-semibold text-foreground mb-2">Bulk Orders Welcome</h3>
              <p className="text-sm font-body text-muted-foreground leading-relaxed">
                We specialize in large-scale fabric supply. Mention your required quantity and we'll provide a competitive quote tailored to your needs.
              </p>
            </div>
          </aside>

          {/* Inquiry Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 gap-5 text-center bg-card border border-border rounded-lg shadow-card">
                <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-teal" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">Inquiry Submitted!</h3>
                  <p className="font-body text-muted-foreground max-w-sm">
                    Thank you for reaching out. Our team will review your inquiry and respond within 24 hours.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-teal text-teal hover:bg-teal hover:text-offwhite font-body mt-2"
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-lg shadow-card p-6 md:p-8 space-y-6"
              >
                <h2 className="font-heading text-xl font-semibold text-foreground">Send an Inquiry</h2>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="customerName" className="font-body text-sm font-medium">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="customerName"
                      placeholder="John Smith"
                      value={form.customerName}
                      onChange={(e) => handleChange('customerName', e.target.value)}
                      className={`font-body text-sm ${errors.customerName ? 'border-destructive' : ''}`}
                    />
                    {errors.customerName && (
                      <p className="text-xs text-destructive font-body">{errors.customerName}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="font-body text-sm font-medium">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`font-body text-sm ${errors.email ? 'border-destructive' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive font-body">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="font-body text-sm font-medium">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 99786 25857"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`font-body text-sm ${errors.phone ? 'border-destructive' : ''}`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive font-body">{errors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="companyName" className="font-body text-sm font-medium">
                      Company Name <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Your Company Ltd."
                      value={form.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      className="font-body text-sm"
                    />
                  </div>
                </div>

                {/* Product & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="productId" className="font-body text-sm font-medium">
                      Product of Interest <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.productId}
                      onValueChange={(val) => handleChange('productId', val)}
                    >
                      <SelectTrigger
                        id="productId"
                        className={`font-body text-sm ${errors.productId ? 'border-destructive' : ''}`}
                      >
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products?.map((p) => (
                          <SelectItem key={p.id.toString()} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.productId && (
                      <p className="text-xs text-destructive font-body">{errors.productId}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="quantityRequired" className="font-body text-sm font-medium">
                      Quantity Required (meters) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="quantityRequired"
                      type="number"
                      min="1"
                      placeholder="e.g. 500"
                      value={form.quantityRequired}
                      onChange={(e) => handleChange('quantityRequired', e.target.value)}
                      className={`font-body text-sm ${errors.quantityRequired ? 'border-destructive' : ''}`}
                    />
                    {errors.quantityRequired && (
                      <p className="text-xs text-destructive font-body">{errors.quantityRequired}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="font-body text-sm font-medium">
                    Message / Notes <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your requirements, color preferences, delivery timeline, etc."
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className={`font-body text-sm resize-none ${errors.message ? 'border-destructive' : ''}`}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive font-body">{errors.message}</p>
                  )}
                </div>

                {/* Submit Error */}
                {submitInquiry.isError && (
                  <p className="text-sm text-destructive font-body">
                    Failed to submit inquiry. Please try again.
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitInquiry.isPending}
                  className="w-full bg-teal hover:bg-teal-light text-offwhite font-body font-medium tracking-wide gap-2 border-0"
                >
                  {submitInquiry.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    'Send Inquiry'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

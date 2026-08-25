import { Phone, Mail, Store } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
                M
              </div>
              <span className="text-xs font-bold">MANIAC SHOP</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              A clean, fast storefront for browsing products and placing
              orders. Built for performance.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">
              Contact
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="tel:+97797749419302"
                  className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="size-3.5" />
                  +977 9749419302
                </a>
              </li>
              <li>
                <a
                  href="mailto:dineshbohara2073@gmail.com"
                  className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-3.5" />
                  dineshbohara2073@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/store"
                  className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Store className="size-3.5" />
                  Store
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center">
          <p className="text-[11px] text-muted-foreground">
            © 2026 MANIAC SHOP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

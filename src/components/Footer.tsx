import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Mail } from "lucide-react";
import EducateLink2 from "@/assets/Educate-Link-2.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Find Jobs", href: "/jobs" },
        { name: "Resources", href: "/resources" },
        { name: "Forum", href: "/forum" },
        { name: "Suppliers", href: "/suppliers" },
      ],
    },
    {
      title: "For Users",
      links: [
        { name: "Teachers", href: "/teachers" },
        { name: "Schools", href: "/schools" },
        { name: "Recruiters", href: "/recruiters" },
        { name: "Suppliers", href: "/suppliers-info" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Help Center", href: "/help" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "GDPR", href: "/gdpr" },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <div className="h-16 w-48 flex items-center justify-center">
                <img
                  src={EducateLink2}
                  alt="Educate Link"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Connecting the global education community. Find opportunities,
              share resources, and build the future of education together.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/educatelink"
                className="w-10 h-10 rounded-lg bg-muted hover:bg-brand-primary/10 flex items-center justify-center transition-colors group"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
              </a>
              <a
                href="https://linkedin.com/company/educatelink"
                className="w-10 h-10 rounded-lg bg-muted hover:bg-brand-primary/10 flex items-center justify-center transition-colors group"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
              </a>
              <a
                href="https://instagram.com/educatelink"
                className="w-10 h-10 rounded-lg bg-muted hover:bg-brand-primary/10 flex items-center justify-center transition-colors group"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
              </a>
              <a
                href="mailto:hello@educatelink.com"
                className="w-10 h-10 rounded-lg bg-muted hover:bg-brand-primary/10 flex items-center justify-center transition-colors group"
                aria-label="Send us an email"
              >
                <Mail className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading font-semibold text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-brand-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-muted-foreground text-sm">
            © {currentYear} Educate Link. All rights reserved. Connecting global
            education since 2024.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <Link
              to="/status"
              className="text-muted-foreground hover:text-brand-primary transition-colors"
            >
              System Status
            </Link>
            <Link
              to="/api"
              className="text-muted-foreground hover:text-brand-primary transition-colors"
            >
              API
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-brand-accent-green"></div>
              <span className="text-muted-foreground">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

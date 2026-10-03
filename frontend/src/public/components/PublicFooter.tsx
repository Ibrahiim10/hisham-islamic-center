import { Link } from 'react-router-dom';
import { HishamLogo } from '../../components/brand/HishamLogo';
import { PUBLIC_SITE, PROGRAMS } from '../../constants/site';

export function PublicFooter() {
  return (
    <footer className="border-t border-outline-variant/40 bg-brand-primary text-white">
      <div className="mx-auto grid max-w-6xl gap-space-xl px-space-md py-16 lg:grid-cols-4 lg:gap-12 lg:px-space-lg lg:py-20">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <HishamLogo variant="sidebar" className="h-12 w-12" />
            <div>
              <p className="font-title-sm text-title-sm font-semibold">{PUBLIC_SITE.name}</p>
              <p className="font-label-sm text-label-sm text-white/70">{PUBLIC_SITE.motto}</p>
            </div>
          </div>
          <p className="mt-space-md font-body-md text-body-md leading-relaxed text-white/80">
            Structured Islamic education combining Qur&apos;an learning, Islamic studies, Arabic foundations, and character development for families in Nairobi.
          </p>
        </div>

        <div>
          <h2 className="font-label-md text-label-md font-semibold uppercase tracking-wider text-brand-secondary">Contact</h2>
          <address className="mt-space-md space-y-2 not-italic font-body-md text-body-md text-white/85">
            {PUBLIC_SITE.address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <a href={`tel:${PUBLIC_SITE.phoneTel}`} className="block font-medium text-white hover:text-brand-secondary">
              {PUBLIC_SITE.phone}
            </a>
          </address>
        </div>

        <div>
          <h2 className="font-label-md text-label-md font-semibold uppercase tracking-wider text-brand-secondary">Quick Links</h2>
          <ul className="mt-space-md space-y-2.5 font-body-md text-body-md">
            <li><Link to="/" className="text-white/85 hover:text-white">Home</Link></li>
            <li><Link to="/about" className="text-white/85 hover:text-white">About</Link></li>
            <li><Link to="/programs" className="text-white/85 hover:text-white">Programs</Link></li>
            <li><Link to="/admission" className="text-white/85 hover:text-white">Admission</Link></li>
            <li><Link to="/contact" className="text-white/85 hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-label-md text-label-md font-semibold uppercase tracking-wider text-brand-secondary">Programs</h2>
          <ul className="mt-space-md space-y-2.5 font-body-md text-body-md">
            <li><Link to={PROGRAMS.tahfidh.path} className="text-white/85 hover:text-white">Tahfidh</Link></li>
            <li><Link to={PROGRAMS.farbar.path} className="text-white/85 hover:text-white">Farbar</Link></li>
            <li><Link to={PROGRAMS.women.path} className="text-white/85 hover:text-white">Women&apos;s Section</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center font-body-sm text-body-sm text-white/65">
        © {new Date().getFullYear()} {PUBLIC_SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}

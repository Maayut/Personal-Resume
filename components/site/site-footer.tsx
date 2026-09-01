import { profile } from '@/lib/resume';

export function SiteFooter() {
  const telephone = profile.phone.replaceAll('-', '');

  return (
    <footer className="site-footer" id="contact">
      <div className="site-container footer-grid">
        <p className="section-label">CONTACT / WUHAN</p>
        <div>
          <h2 className="footer-heading">保持联系</h2>
          <div className="footer-links">
            <a href={`tel:${telephone}`}>{profile.phone}</a>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
          <p className="footer-facts">
            <span>{profile.city}</span>
            <span>{profile.age}</span>
            <span>{profile.gender}</span>
            <span>{profile.height}</span>
            <span>{profile.weight}</span>
            <span>{profile.ethnicity}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

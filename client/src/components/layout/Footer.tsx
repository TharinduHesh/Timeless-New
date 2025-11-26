import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer bg-gradient-to-b from-black/50 to-black/70 py-16 border-t border-accent/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="footer-section">
            <h3 className="text-2xl font-display font-bold text-accent mb-4 tracking-wider">TIMELESS</h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-6 max-w-sm">
              Luxury timepieces and accessories for the discerning collector. Experience the perfect blend of craftsmanship and elegance.
            </p>
            <div className="flex space-x-5">
              <a 
                href="https://www.facebook.com/share/1A2gZUoaMm/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent flex items-center justify-center text-gray-300 hover:text-accent transition-all duration-300"
                aria-label="Facebook"
              >
                <FiFacebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/timeless.shop.lk?igsh=YzdsMGVvczR6Z2x2&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent flex items-center justify-center text-gray-300 hover:text-accent transition-all duration-300"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
            </div>
          </div>



          {/* Customer Service */}
          <div className="footer-section">
            <h3 className="text-accent font-semibold mb-6 text-base uppercase tracking-wide">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 inline-block duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 inline-block duration-200">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 inline-block duration-200">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 inline-block duration-200">
                  Warranty
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 inline-block duration-200">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3 className="text-accent font-semibold mb-6 text-base uppercase tracking-wide">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 inline-block duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 inline-block duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 inline-block duration-200">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm">
          <p className="text-gray-400 mb-2">&copy; {currentYear} Timeless. All rights reserved.</p>
          <p className="text-gray-500 text-xs" style={{userSelect: 'none', pointerEvents: 'none'}}>
            <span dangerouslySetInnerHTML={{__html: atob('UG93ZXJlZCBieSA8YSBocmVmPSJodHRwczovL2J0ZWNoem8uaW5meS51ay8iIHRhcmdldD0iX2JsYW5rIiByZWw9Im5vb3BlbmVyIG5vcmVmZXJyZXIiIGNsYXNzPSJ0ZXh0LWFjY2VudCBob3Zlcjp0ZXh0LWFjY2VudC1zdHJvbmcgdHJhbnNpdGlvbi1jb2xvcnMiIHN0eWxlPSJwb2ludGVyLWV2ZW50czogYXV0bzsiPkJURUNIWk88L2E+')}} />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

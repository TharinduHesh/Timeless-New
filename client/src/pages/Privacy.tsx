import { Helmet } from 'react-helmet-async';

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Timeless</title>
      </Helmet>

      <div className="privacy-page section-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-center mb-12">
            Cookie Policy
          </h1>

          <div className="card-glass p-8 md:p-12 space-y-8">
            <section>
              <p className="text-muted text-sm mb-6">Last Updated: 2025/11/26</p>
              <p className="text-muted leading-relaxed mb-6">
                Our website uses cookies to improve user experience, track website performance, and remember user preferences. Cookies help us analyze browsing behavior so we can improve our services and website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">What Cookies Collect</h2>
              <p className="text-muted leading-relaxed mb-4">
                Cookies do not collect personal information unless you voluntarily provide it while placing an order or creating an account. You may choose to disable cookies in your browser settings, but some website features may not function correctly without them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Consent</h2>
              <p className="text-muted leading-relaxed mb-6">
                By using our website, you consent to our use of cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-muted leading-relaxed">
                For questions about our cookie policy, please contact:
              </p>
              <ul className="space-y-2 text-muted mt-4">
                <li className="flex gap-2"><span className="text-accent">•</span> Email: timelessaccessories0@gmail.com</li>
                <li className="flex gap-2"><span className="text-accent">•</span> Phone: +94 77 828 4062</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;

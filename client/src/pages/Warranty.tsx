import { Helmet } from 'react-helmet-async';

const Warranty = () => {
  return (
    <>
      <Helmet>
        <title>Warranty Information - Timeless</title>
      </Helmet>

      <div className="warranty-page section-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-center mb-12">
            Warranty Policy
          </h1>

          <div className="card-glass p-8 md:p-12 space-y-8">
            <section>
              <p className="text-muted text-sm mb-6">Last Updated: 2025/11/26</p>
              <p className="text-muted leading-relaxed mb-6">
                All watches sold by Timeless store include a warranty period that covers manufacturing defects, internal mechanical issues, movement malfunctions, and other faults not caused by customer misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">What's Not Covered</h2>
              <p className="text-muted leading-relaxed mb-4">
                The warranty does not cover:
              </p>
              <ul className="space-y-2 text-muted">
                <li className="flex gap-2"><span className="text-accent">•</span> Physical damage</li>
                <li className="flex gap-2"><span className="text-accent">•</span> Accidental drops</li>
                <li className="flex gap-2"><span className="text-accent">•</span> Strap damage due to usage</li>
                <li className="flex gap-2"><span className="text-accent">•</span> Misuse</li>
                <li className="flex gap-2"><span className="text-accent">•</span> Water damage</li>
                <li className="flex gap-2"><span className="text-accent">•</span> Issues caused by unauthorized repairs</li>
              </ul>
              <p className="text-muted leading-relaxed mt-4">
                Water damage immediately voids the warranty on items that are not water-resistant or waterproof.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Making a Warranty Claim</h2>
              <p className="text-muted leading-relaxed mb-4">
                Any warranty claim requires the customer to provide order details and clear photo or video evidence of the issue. After verification, instructions for repair or replacement will be provided. If the product model is unavailable, a similar model or store credit may be offered.
              </p>
              <p className="text-muted leading-relaxed">
                Warranty becomes void if the product is opened, tampered with, repaired by an unauthorized person, or damaged intentionally or through improper handling.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-muted leading-relaxed">
                For warranty support, please contact:
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

export default Warranty;

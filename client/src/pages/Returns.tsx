import { Helmet } from 'react-helmet-async';

const Returns = () => {
  return (
    <>
      <Helmet>
        <title>Returns & Exchanges - Timeless</title>
      </Helmet>

      <div className="returns-page section-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-center mb-12">
            Return Policy
          </h1>

          <div className="card-glass p-8 md:p-12 space-y-8">
            <section>
              <p className="text-muted text-sm mb-6">Last Updated: 2025/11/26</p>
              <p className="text-muted leading-relaxed mb-6">
                Customers may request a return or exchange only if the item is damaged, defective, or incorrect upon delivery. Issues must be reported within 48 hours of receiving the item. Customers must provide photo or video evidence for verification. After approval, instructions for returning or replacing the item will be provided.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Non-Returnable Items</h2>
              <p className="text-muted leading-relaxed mb-4">
                The following are not eligible for return:
              </p>
              <ul className="space-y-2 text-muted">
                <li className="flex gap-2"><span className="text-accent">•</span> Items damaged due to customer misuse</li>
                <li className="flex gap-2"><span className="text-accent">•</span> Opened packaging without proof of damage</li>
                <li className="flex gap-2"><span className="text-accent">•</span> "Change of mind" situations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Refund Process</h2>
              <p className="text-muted leading-relaxed">
                Refunds are issued only if a suitable replacement is not available and will use the same method as the customer's payment (COD refunds may require bank account details).
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Returns;

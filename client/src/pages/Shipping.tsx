import { Helmet } from 'react-helmet-async';

const Shipping = () => {
  return (
    <>
      <Helmet>
        <title>Shipping Information - Timeless</title>
      </Helmet>

      <div className="shipping-page section-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-center mb-12">
            Delivery and Shipping Policy
          </h1>

          <div className="card-glass p-8 md:p-12 space-y-8">
            <section>
              <p className="text-muted text-sm mb-6">Last Updated: 2025/11/26</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Local Delivery</h2>
              <p className="text-muted leading-relaxed mb-4">
                Local delivery typically takes between 2 to 7 days. However, depending on courier delays, weather conditions, holidays, or unexpected circumstances, delivery may take up to 30 days. Customers will be notified if delays occur.
              </p>
              <p className="text-muted leading-relaxed">
                We provide Cash on Delivery for local orders where available, and no additional delivery fee is charged unless stated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">International Shipping</h2>
              <p className="text-muted leading-relaxed mb-4">
                International shipping may require additional fees depending on the destination country, customs rules, and courier charges. Delivery times for international orders vary by country and courier service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Order Confirmation</h2>
              <p className="text-muted leading-relaxed">
                Order confirmation may require a verification call or message. Orders with incomplete or inaccurate information may be delayed or cancelled.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shipping;

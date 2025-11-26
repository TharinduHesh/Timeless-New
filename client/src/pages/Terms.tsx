import { Helmet } from 'react-helmet-async';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Timeless</title>
      </Helmet>

      <div className="terms-page section-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-center mb-12">
            Terms and Conditions
          </h1>

          <div className="card-glass p-8 md:p-12 space-y-8">
            <section>
              <p className="text-muted text-sm mb-6">Last Updated: 2025/11/26</p>
              <p className="text-muted leading-relaxed mb-6">
                Welcome to Timeless store. By using our website or placing an order, you agree to the following Terms and Conditions. Please read them carefully.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                All product descriptions, images, and details on our website are provided as accurately as possible, but small variations may occur due to lighting or manufacturing updates. All prices are listed in LKR and may change without notice during promotions or updates. By placing an order, you agree to provide correct and complete delivery information. Orders may be cancelled if incorrect or suspicious information is provided.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                We offer Cash on Delivery (COD) for local orders where available. For international orders, only available online payment methods can be used. Delivery times vary based on location, courier delays, weather conditions, holidays, and other external factors.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                Returns, replacements, and warranty handling are subject to the policies listed below. We are not responsible for any indirect, accidental, or consequential damages. Our liability is limited to the value of the product purchased.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-muted leading-relaxed">
                For questions or support, contact us at:
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

export default Terms;

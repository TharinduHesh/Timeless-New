import { Helmet } from 'react-helmet-async';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Timeless</title>
        <meta name="description" content="Learn about Timeless and our passion for luxury timepieces." />
      </Helmet>

      <div className="about-page section-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-center mb-8">
            About Timeless
          </h1>

          <div className="card-glass p-8 md:p-12 mb-8">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Welcome to Timeless, your premier destination for luxury timepieces. Since our founding, 
              we've been dedicated to bringing you the finest collection of watches from the world's 
              most prestigious brands.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              At Timeless, we believe that a watch is more than just a timepiece—it's a statement of 
              style, a testament to craftsmanship, and a companion for life's most important moments. 
              Our curated selection represents the pinnacle of horological excellence.
            </p>

            <h2 className="text-2xl font-bold text-accent mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              To provide watch enthusiasts and collectors with authentic, high-quality timepieces 
              coupled with exceptional customer service. We're committed to making luxury accessible 
              and ensuring every purchase is a memorable experience.
            </p>

            <h2 className="text-2xl font-bold text-accent mt-8 mb-4">Why Choose Us</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300 text-lg">
                <span className="text-accent mt-1">•</span>
                <span>100% Authentic Watches - All products come with certificates of authenticity</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 text-lg">
                <span className="text-accent mt-1">•</span>
                <span>Expert Curation - Every watch in our collection is carefully selected</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 text-lg">
                <span className="text-accent mt-1">•</span>
                <span>Exceptional Service - Our team is dedicated to your satisfaction</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 text-lg">
                <span className="text-accent mt-1">•</span>
                <span>Secure Shopping - Your privacy and security are our top priorities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

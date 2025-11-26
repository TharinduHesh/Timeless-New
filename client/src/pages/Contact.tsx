import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiPhone, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { firestoreContactService } from '../services/firestore';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await firestoreContactService.create(formData);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Timeless</title>
        <meta name="description" content="Get in touch with Timeless. We're here to help!" />
      </Helmet>

      <div className="contact-page section-container">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-center mb-12">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="card-glass p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <FiMail className="text-accent" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Email</h3>
            <a href="mailto:timelessaccessories0@gmail.com" className="text-accent hover:text-accent-strong text-sm break-all">
              timelessaccessories0@gmail.com
            </a>
          </div>

          <div className="card-glass p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <FiPhone className="text-accent" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Phone / WhatsApp</h3>
            <a href="tel:+94778284062" className="text-accent hover:text-accent-strong">
              +94 77 828 4062
            </a>
          </div>

          <div className="card-glass p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <FiMapPin className="text-accent" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Location</h3>
            <p className="text-muted text-sm">
              503/2, Kendakaduwa,<br />
              Gannoruwa, Peradeniya
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="card-glass p-8 md:p-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-dark w-full"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-dark w-full"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input-dark w-full"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-dark w-full resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card-glass max-w-md w-full p-8 text-center animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <FiCheckCircle className="text-green-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
            <p className="text-gray-300 mb-6">
              Thank you for contacting us. We will respond to your inquiry shortly.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="btn-gold w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;

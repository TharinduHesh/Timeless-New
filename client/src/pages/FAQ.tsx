import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Are all watches authentic?',
      answer: 'Yes, all our watches are 100% authentic and come with certificates of authenticity from the manufacturers.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unworn watches in original condition with all packaging and documentation.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship worldwide. Shipping costs and delivery times vary by location.'
    },
    {
      question: 'What warranty do you offer?',
      answer: 'All watches come with manufacturer warranties. Additionally, we offer extended warranty options for added peace of mind.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Domestic shipping typically takes 3-5 business days. International shipping can take 7-14 business days depending on location.'
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes, you will receive a tracking number via email once your order ships.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and wire transfers for high-value purchases.'
    },
    {
      question: 'Do you offer financing?',
      answer: 'Yes, we partner with financing providers to offer flexible payment plans on eligible purchases.'
    },
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - Timeless</title>
        <meta name="description" content="Frequently asked questions about Timeless watches and services." />
      </Helmet>

      <div className="faq-page section-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-center mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted text-center text-lg mb-12">
            Find answers to common questions about our watches and services
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card-glass overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white font-semibold text-lg pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <FiChevronUp className="text-accent flex-shrink-0" size={24} />
                  ) : (
                    <FiChevronDown className="text-accent flex-shrink-0" size={24} />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;

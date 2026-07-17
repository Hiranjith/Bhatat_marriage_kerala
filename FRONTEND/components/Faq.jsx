import React, { useState } from "react";

const faqs = [
{
question: "Is registration free on Bharath Marriage?",
answer:
"Yes. Creating a profile and browsing matches is completely free. Our goal is to make finding a compatible life partner simple, accessible, and trustworthy for every family.",
},
{
question: "Are profiles verified before being displayed?",
answer:
"We follow profile verification procedures to help maintain authenticity and improve trust within our community. Members are encouraged to provide accurate information to ensure meaningful matches.",
},
{
question: "Can I search profiles based on religion, caste, age, and location?",
answer:
"Yes. Bharath Marriage provides advanced search filters that allow you to find profiles based on religion, caste, age, location, education, profession, and other important preferences.",
},
{
question: "How is my personal information protected?",
answer:
"Your privacy is important to us. Sensitive information is handled securely, and profile visibility is designed to give members control over what information is shared.",
},
{
question: "Can parents create and manage profiles for their children?",
answer:
"Absolutely. Many families actively participate in the matchmaking process. Parents and guardians can create, manage, and search for suitable matches on behalf of their children.",
},
{
question: "How do I contact a profile that interests me?",
answer:
"Once you find a suitable profile, you can express interest and begin communication through the platform according to the available membership features.",
},
];

export default function FAQSection() {
const [openIndex, setOpenIndex] = useState(0);

const toggleFAQ = (index) => {
setOpenIndex(openIndex === index ? null : index);
};

return ( <section className="bg-white py-14 md:py-20 border-t border-slate-100"> <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop"> <div className="text-center mb-10 md:mb-12"> <span className="font-label-caps text-xs text-heritage-gold tracking-widest block mb-2 font-semibold">
FREQUENTLY ASKED QUESTIONS </span>

```
      <h2 className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-charcoal-text mb-4 uppercase tracking-wide leading-tight">
        Questions Families Often Ask
      </h2>

      <p className="font-body-lg text-sm text-soft-gray max-w-2xl mx-auto leading-relaxed">
        Find answers to common questions about registration, profile privacy,
        matchmaking, and how Bharath Marriage helps you find your ideal life
        partner.
      </p>
    </div>

    <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-deep-maroon/30 hover:shadow-sm"
        >
          <button
            type="button"
            onClick={() => toggleFAQ(index)}
            className="w-full flex items-start justify-between gap-3 p-4 md:p-5 text-left cursor-pointer"
          >
            <h3 className="font-semibold text-charcoal-text text-sm sm:text-[15px] md:text-base leading-relaxed">
              {faq.question}
            </h3>

            <span
              className={`material-symbols-outlined text-[22px] shrink-0 text-deep-maroon transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-slate-100">
              <p className="pt-4 text-[13px] sm:text-sm text-soft-gray leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
);
}

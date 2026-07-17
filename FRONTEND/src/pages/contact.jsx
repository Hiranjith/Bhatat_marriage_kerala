import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full flex flex-col bg-[#fbfaf9]">
      <Helmet>
        <title>Contact Bharath Marriage | Kerala Matrimony Service</title>
        <meta
          name="description"
          content="Contact Bharath Marriage for profile registration, membership plans, and trusted matrimonial assistance in Kerala."
        />
      </Helmet>

      <section className="relative bg-gradient-to-br from-primary via-deep-maroon to-[#6b0030] pt-28 pb-14 md:pt-36 md:pb-16 overflow-hidden">
        {/* Decorative background dots */}
        <div className="absolute inset-0 opacity-10 hero-pattern pointer-events-none" />
        {/* Soft glow blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-16 w-96 h-96 bg-heritage-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 font-label-caps text-[10px] tracking-[0.2em] text-heritage-gold font-semibold uppercase mb-5">
            <span className="w-8 h-px bg-heritage-gold/50" />
            Get In Touch
            <span className="w-8 h-px bg-heritage-gold/50" />
          </span>

          <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
            We're Here To <span className="text-heritage-gold">Help You</span>
          </h1>

          <p className="max-w-xl mx-auto text-white/70 text-sm leading-relaxed">
            Questions about your membership, profile, or finding the right match?
            Our team is always ready to assist you.
          </p>
        </div>
      </section>



      {/* ── FORM + TRUST PANEL ── */}
      <section className="py-14 md:py-20 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">

          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
            {/* Form header strip */}
            <div className="bg-gradient-to-r from-primary to-deep-maroon px-6 py-5">
              <span className="font-label-caps text-[10px] tracking-widest text-heritage-gold font-semibold">
                SEND A MESSAGE
              </span>
              <h2 className="font-display-lg text-xl md:text-2xl text-white mt-1 leading-snug">
                Let's Start A Conversation
              </h2>
            </div>

            <div className="p-6 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[32px] text-emerald-500">check_circle</span>
                  </div>
                  <h3 className="font-semibold text-charcoal-text text-lg mb-1">Message Sent!</h3>
                  <p className="text-soft-gray text-sm">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="mt-6 text-deep-maroon text-xs font-semibold hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                        Full Name
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Ananya Menon"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-charcoal-text placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-deep-maroon/30 focus:border-deep-maroon transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                        Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-charcoal-text placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-deep-maroon/30 focus:border-deep-maroon transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-charcoal-text placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-deep-maroon/30 focus:border-deep-maroon transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-charcoal-text focus:outline-none focus:ring-2 focus:ring-deep-maroon/30 focus:border-deep-maroon transition-all cursor-pointer"
                      >
                        <option value="">Select a topic</option>
                        <option value="account">Account / Login Help</option>
                        <option value="profile">Profile Verification</option>
                        <option value="membership">Membership & Plans</option>
                        <option value="privacy">Privacy & Safety</option>
                        <option value="match">Finding Matches</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell us how we can help you…"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-charcoal-text placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-deep-maroon/30 focus:border-deep-maroon transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-deep-maroon hover:bg-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm cursor-pointer"
                  >
                    Send Message
                    <span className="material-symbols-outlined text-[18px] leading-none">send</span>
                  </button>

                  <p className="text-center text-[10px] text-slate-400">
                    We respect your privacy. Your data will never be shared.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Right — Trust & Info panel */}
          <div className="flex flex-col gap-5 pt-0 lg:pt-2">
            <div>
              <span className="font-label-caps text-[10px] tracking-widest text-heritage-gold font-semibold">
                WHY REACH OUT?
              </span>
              <h2 className="font-display-lg text-2xl md:text-3xl text-charcoal-text mt-2 mb-3 leading-tight">
                Dedicated Support<br />For Every Step
              </h2>
              <p className="text-soft-gray text-sm leading-relaxed">
                Whether you need help with your account, profile verification,
                membership plans, or finding the perfect match — our team
                responds quickly and with care.
              </p>
            </div>

            {/* Trust items */}
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: 'verified_user',
                  color: 'text-deep-maroon',
                  bg: 'bg-deep-maroon/8',
                  title: 'Safe & Verified',
                  desc: 'Every profile goes through a manual verification process.',
                },
                {
                  icon: 'support_agent',
                  color: 'text-heritage-gold',
                  bg: 'bg-heritage-gold/10',
                  title: 'Expert Support',
                  desc: 'Dedicated relationship counsellors available 6 days a week.',
                },
                {
                  icon: 'lock',
                  color: 'text-deep-maroon',
                  bg: 'bg-deep-maroon/8',
                  title: '100% Privacy',
                  desc: 'Your contact details are hidden until you choose to reveal them.',
                },
                {
                  icon: 'favorite',
                  color: 'text-heritage-gold',
                  bg: 'bg-heritage-gold/10',
                  title: 'Trusted Matchmaking',
                  desc: 'Thousands of families have found matches through us.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3.5 bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <span className={`material-symbols-outlined text-[18px] ${item.color}`}>{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-text text-sm">{item.title}</h4>
                    <p className="text-soft-gray text-xs leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-14 md:py-18 bg-white border-t border-slate-100 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-label-caps text-[10px] tracking-widest text-heritage-gold font-semibold">
              QUICK ANSWERS
            </span>
            <h2 className="font-display-lg text-2xl md:text-3xl text-charcoal-text mt-2">
              Common Questions
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              {
                q: 'Are all profiles on Bharath Marriage verified?',
                a: 'Yes. Every profile undergoes a manual review. Verified profiles are marked with a green badge so you can trust the information.',
              },
              {
                q: 'How do I contact a match?',
                a: 'Once you express interest and they accept, you can exchange contact details through our secure messaging system.',
              },
              {
                q: 'Can I hide my photos from everyone?',
                a: 'Absolutely. You control who can see your photos. Navigate to Privacy Settings in your dashboard to manage this.',
              },
              {
                q: 'What are the membership plan options?',
                a: 'We offer Free, Silver, and Gold plans. Premium plans unlock unlimited message requests, phone number visibility, and priority listing.',
              },
              {
                q: 'How do I delete my account?',
                a: 'You can permanently delete your account from Settings → Account → Delete Account. All your data will be removed within 48 hours.',
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group py-4 cursor-pointer list-none"
              >
                <summary className="flex items-center justify-between gap-4 text-sm font-semibold text-charcoal-text select-none list-none">
                  {item.q}
                  <span className="material-symbols-outlined text-[18px] text-deep-maroon shrink-0 group-open:rotate-180 transition-transform duration-200">
                    keyboard_arrow_down
                  </span>
                </summary>
                <p className="mt-2.5 text-soft-gray text-sm leading-relaxed pr-8">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative bg-gradient-to-r from-primary to-deep-maroon py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 hero-pattern pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-heritage-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <span className="font-label-caps text-[10px] tracking-widest text-heritage-gold font-semibold block mb-3">
            JOIN BHARATH MARRIAGE
          </span>
          <h2 className="font-display-lg text-2xl md:text-4xl text-white mb-4 leading-tight">
            Ready To Begin Your Journey?
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            Join thousands of families who found meaningful relationships built
            on trust, compatibility, and shared values.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/login"
              className="bg-white text-deep-maroon font-semibold text-sm px-7 py-3 rounded-xl hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Register Free
            </Link>
            <Link
              to="/search"
              className="border border-white/30 text-white font-semibold text-sm px-7 py-3 rounded-xl hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              Browse Profiles
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
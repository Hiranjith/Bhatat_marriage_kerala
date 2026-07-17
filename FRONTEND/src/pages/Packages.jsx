import React from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    id: "free",
    tier: "Standard",
    price: "Free",
    isPopular: false,
    isElite: false,
    btnClass: "border border-deep-maroon text-deep-maroon hover:bg-deep-maroon/5",
    features: {
      "Profile Listing": true,
      "Browse Profiles": true,
      "View Photos & Horoscopes": false,
      "Detailed Profile Info": false,
      "Direct Chat & Messaging": false,
      "View Contact Numbers": false,
      "Premium Profile Badge": false,
      "Video Calling": false,
      "Download Horoscope": false,
    },
  },
  {
    id: "silver",
    tier: "Silver",
    price: "₹400/mo",
    discount: "20% OFF",
    isPopular: false,
    isElite: false,
    btnClass: "border border-deep-maroon text-deep-maroon hover:bg-deep-maroon/5",
    features: {
      "Profile Listing": true,
      "Browse Profiles": true,
      "View Photos & Horoscopes": true,
      "Detailed Profile Info": false,
      "Direct Chat & Messaging": false,
      "View Contact Numbers": false,
      "Premium Profile Badge": false,
      "Video Calling": false,
      "Download Horoscope": false,
    },
  },
  {
    id: "gold",
    tier: "Gold",
    price: "₹600/mo",
    discount: "15% OFF",
    isPopular: false,
    isElite: false,
    btnClass: "bg-deep-maroon hover:bg-primary text-white shadow-md hover:shadow-lg",
    features: {
      "Profile Listing": true,
      "Browse Profiles": true,
      "View Photos & Horoscopes": true,
      "Detailed Profile Info": true,
      "Direct Chat & Messaging": true,
      "View Contact Numbers": false,
      "Premium Profile Badge": false,
      "Video Calling": false,
      "Download Horoscope": false,
    },
  },
  {
    id: "platinum",
    tier: "Platinum",
    price: "₹800/mo",
    discount: "10% OFF",
    isPopular: true,
    isElite: false,
    btnClass: "bg-deep-maroon hover:bg-primary text-white shadow-md hover:shadow-lg",
    features: {
      "Profile Listing": true,
      "Browse Profiles": true,
      "View Photos & Horoscopes": true,
      "Detailed Profile Info": true,
      "Direct Chat & Messaging": true,
      "View Contact Numbers": true,
      "Premium Profile Badge": false,
      "Video Calling": false,
      "Download Horoscope": true,
    },
  },
  {
    id: "diamond",
    tier: "Diamond",
    price: "₹1000/mo",
    discount: "5% OFF",
    isPopular: false,
    isElite: true,
    btnClass: "bg-heritage-gold hover:bg-amber-600 text-white shadow-md hover:shadow-lg",
    features: {
      "Profile Listing": true,
      "Browse Profiles": true,
      "View Photos & Horoscopes": true,
      "Detailed Profile Info": true,
      "Direct Chat & Messaging": true,
      "View Contact Numbers": true,
      "Premium Profile Badge": true,
      "Video Calling": true,
      "Download Horoscope": true,
    },
  },
];

const featureList = [
  { key: "Profile Listing", icon: "person" },
  { key: "Browse Profiles", icon: "manage_search" },
  { key: "View Photos & Horoscopes", icon: "photo_library" },
  { key: "Detailed Profile Info", icon: "badge" },
  { key: "Direct Chat & Messaging", icon: "chat" },
  { key: "View Contact Numbers", icon: "contact_phone" },
  { key: "Download Horoscope", icon: "download" },
  { key: "Premium Profile Badge", icon: "workspace_premium" },
  { key: "Video Calling", icon: "videocam" },
];

function CheckIcon({ isElite }) {
  return (
    <span
      className={`material-symbols-outlined ${isElite ? "text-heritage-gold" : "text-emerald-500"}`}
      style={{ fontSize: "19px", fontVariationSettings: "'FILL' 1" }}
    >
      check_circle
    </span>
  );
}

function CrossIcon() {
  return (
    <span
      className="material-symbols-outlined text-slate-200"
      style={{ fontSize: "19px" }}
    >
      remove
    </span>
  );
}

export default function Packages() {
  const navigate = useNavigate();

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/#register');
  };

  return (
    <div className="bg-gradient-to-br from-[#fbfaf9] via-rose-50/20 to-amber-50/10 min-h-screen pt-20 md:pt-28 pb-20">
      <Helmet>
        <title>Matrimony Packages & Membership Plans | Bharath Marriage</title>
        <meta
          name="description"
          content="Explore affordable matrimony packages and membership plans to connect with verified bride and groom profiles across Kerala."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[10px] md:text-[11px] font-semibold text-deep-maroon tracking-[0.2em] uppercase mb-2">
            Membership
          </p>
          <h1 className="font-display-lg text-2xl md:text-[34px] text-charcoal-text font-bold tracking-tight leading-tight">
            Choose Your Plan
          </h1>
          <p className="text-soft-gray text-xs md:text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Select the best package to connect with verified matches and find your perfect life partner.
          </p>
        </div>

        {/* ── Comparison Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-center">

              {/* Table Head */}
              <thead>
                <tr className="border-b border-slate-100">
                  {/* Features label column */}
                  <th className="py-6 px-6 text-left text-[11px] font-semibold text-soft-gray uppercase tracking-wider w-[26%]">
                    Features
                  </th>

                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className={`py-0 px-3 border-l border-slate-100 w-[14.8%] relative
                        ${plan.isPopular ? "bg-deep-maroon/[0.03]" : plan.isElite ? "bg-amber-50/40" : ""}
                      `}
                    >
                      {/* Popular / Elite top stripe */}
                      {(plan.isPopular || plan.isElite) && (
                        <div
                          className={`absolute top-0 left-0 right-0 h-[3px]
                            ${plan.isPopular ? "bg-deep-maroon" : "bg-heritage-gold"}
                          `}
                        />
                      )}

                      <div className="py-5 px-1">
                        {/* Badge pill */}
                        {plan.isPopular && (
                          <span className="inline-block mb-1.5 text-[8px] font-bold bg-deep-maroon text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                            Popular
                          </span>
                        )}
                        {plan.isElite && (
                          <span className="inline-block mb-1.5 text-[8px] font-bold bg-heritage-gold text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                            Elite
                          </span>
                        )}
                        {!plan.isPopular && !plan.isElite && (
                          <span className="inline-block mb-1.5 h-[18px]" />
                        )}

                        {/* Tier name */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider block
                            ${plan.isElite ? "text-heritage-gold" : plan.isPopular ? "text-deep-maroon" : "text-slate-500"}
                          `}
                        >
                          {plan.tier}
                        </span>

                        {/* Price */}
                        <span
                          className={`text-base md:text-lg font-black mt-0.5 block leading-tight
                            ${plan.isElite ? "text-heritage-gold" : plan.id === "free" ? "text-slate-400" : "text-charcoal-text"}
                          `}
                        >
                          {plan.price}
                        </span>

                        {/* Discount badge */}
                        {plan.discount ? (
                          <span className="inline-block mt-1 text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            {plan.discount}
                          </span>
                        ) : (
                          <span className="text-[8px] text-slate-400 font-medium uppercase tracking-wider mt-1 block">
                            Lifetime
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body — Features */}
              <tbody>
                {featureList.map(({ key, icon }, idx) => (
                  <tr
                    key={key}
                    className={`border-b border-slate-100 transition-colors hover:bg-slate-50/50
                      ${idx % 2 !== 0 ? "bg-slate-50/25" : ""}
                    `}
                  >
                    {/* Feature name */}
                    <td className="py-3.5 px-6 text-left">
                      <div className="flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-slate-400 flex-shrink-0"
                          style={{ fontSize: "14px" }}
                        >
                          {icon}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 leading-tight">
                          {key}
                        </span>
                      </div>
                    </td>

                    {/* Plan cells */}
                    {plans.map((plan) => (
                      <td
                        key={plan.id}
                        className={`py-3.5 px-3 border-l border-slate-100
                          ${plan.isPopular ? "bg-deep-maroon/[0.02]" : plan.isElite ? "bg-amber-50/25" : ""}
                        `}
                      >
                        {plan.features[key]
                          ? <CheckIcon isElite={plan.isElite} />
                          : <CrossIcon />
                        }
                      </td>
                    ))}
                  </tr>
                ))}

                {/* CTA row */}
                <tr>
                  <td className="py-5 px-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Get Started
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className={`py-5 px-3 border-l border-slate-100
                        ${plan.isPopular ? "bg-deep-maroon/[0.02]" : plan.isElite ? "bg-amber-50/25" : ""}
                      `}
                    >
                      <button
                        onClick={handleRegisterClick}
                        className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.97] cursor-pointer
                          ${plan.btnClass}
                        `}
                      >
                        {plan.id === "free" ? "Free" : "Choose"}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>

            </table>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-soft-gray text-[10px] md:text-[11px] mt-6 leading-relaxed">
          All packages include profile verification review. Cancel or modify your plan at any time.
        </p>

      </div>
    </div>
  );
}
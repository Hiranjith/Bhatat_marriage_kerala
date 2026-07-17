import React, { useState } from 'react';
import ProfileCard from '../ProfileCard';

const initialShortlists = [
  {
    id: "BKLH000000001",
    name: 'Aishwarya R.',
    age: 26,
    height: "5'4\"",
    religion: 'Hindu - Nair',
    education: 'M.Tech',
    profession: 'Software Engineer',
    location: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400&h=500',
    verified: true,
    premium: true,
  },
  {
    id: "BKLH000000007",
    name: 'Kavya Madhavan',
    age: 25,
    height: "5'3\"",
    religion: 'Hindu - Nair',
    education: 'BFA - Design',
    profession: 'UI/UX Designer',
    location: 'Ernakulam',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=500',
    verified: true,
    premium: false,
  },
];

export default function ShortlistsView() {
  const [shortlists, setShortlists] = useState(initialShortlists);

  const removeShortlist = (id) => {
    setShortlists((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <section className="rounded-none md:rounded-xl border-none md:border md:border-slate-200/60 bg-transparent md:bg-white p-0 md:p-5 shadow-none md:shadow-sm text-left">
        <div className="mb-5 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-charcoal-text uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-deep-maroon"></span>
            Shortlisted Profiles ({shortlists.length})
          </h2>
          <p className="text-[11px] text-soft-gray mt-1">Quickly view or contact profiles you have saved for later consideration.</p>
        </div>

        {shortlists.length === 0 ? (
          <div className="text-center py-12 text-xs text-soft-gray">
            <span className="material-symbols-outlined text-[36px] text-slate-300 mb-2">bookmark_border</span>
            <p>You haven't shortlisted any profiles yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 pt-2">
            {shortlists.map((profile) => (
              <div key={profile.id} className="relative group/shortlist">
                <ProfileCard profile={profile} fullWidth />
                
                {/* Remove button overlay */}
                <button
                  onClick={() => removeShortlist(profile.id)}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black transition-colors shadow cursor-pointer"
                  title="Remove from shortlists"
                >
                  <span className="material-symbols-outlined text-sm leading-none">close</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

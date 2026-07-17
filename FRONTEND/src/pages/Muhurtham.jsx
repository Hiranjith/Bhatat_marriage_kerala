import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const years = ["2026", "2027", "2028"];

const MUHURTHAM_DATA = [
  // 2026
  { date: "2026-01-14", day: "Wednesday", nakshatram: "രോഹിണി", thithi: "പഞ്ചമി", time: "09:15 AM – 10:30 AM", quality: "Excellent", month: "January", year: "2026" },
  { date: "2026-01-28", day: "Wednesday", nakshatram: "രേവതി", thithi: "ദശമി", time: "08:40 AM – 10:00 AM", quality: "Excellent", month: "January", year: "2026" },
  { date: "2026-02-12", day: "Thursday", nakshatram: "ഉത്രം", thithi: "സപ്തമി", time: "07:30 AM – 09:10 AM", quality: "Good", month: "February", year: "2026" },
  { date: "2026-02-22", day: "Sunday", nakshatram: "അത്തം", thithi: "പഞ്ചമി", time: "09:00 AM – 10:45 AM", quality: "Excellent", month: "February", year: "2026" },
  { date: "2026-03-05", day: "Thursday", nakshatram: "ചോതി", thithi: "തൃതീയ", time: "08:15 AM – 09:30 AM", quality: "Good", month: "March", year: "2026" },
  { date: "2026-03-19", day: "Thursday", nakshatram: "അനിഴം", thithi: "ദ്വാദശി", time: "07:45 AM – 09:20 AM", quality: "Excellent", month: "March", year: "2026" },
  { date: "2026-04-16", day: "Thursday", nakshatram: "മകയിരം", thithi: "ഏകാദശി", time: "09:30 AM – 11:00 AM", quality: "Excellent", month: "April", year: "2026" },
  { date: "2026-04-29", day: "Wednesday", nakshatram: "രോഹിണി", thithi: "ചതുർത്ഥി", time: "08:20 AM – 10:00 AM", quality: "Good", month: "April", year: "2026" },
  { date: "2026-05-13", day: "Wednesday", nakshatram: "രേവതി", thithi: "ദ്വാദശി", time: "07:10 AM – 08:50 AM", quality: "Excellent", month: "May", year: "2026" },
  { date: "2026-05-24", day: "Sunday", nakshatram: "ഉത്രാടം", thithi: "അഷ്ടമി", time: "09:15 AM – 10:55 AM", quality: "Good", month: "May", year: "2026" },
  { date: "2026-06-11", day: "Thursday", nakshatram: "അത്തം", thithi: "ഏകാദശി", time: "08:45 AM – 10:15 AM", quality: "Excellent", month: "June", year: "2026" },
  { date: "2026-06-25", day: "Thursday", nakshatram: "ചോതി", thithi: "ദശമി", time: "09:30 AM – 11:10 AM", quality: "Good", month: "June", year: "2026" },
  { date: "2026-07-15", day: "Wednesday", nakshatram: "അനിഴം", thithi: "ദ്വിതീയ", time: "07:50 AM – 09:30 AM", quality: "Good", month: "July", year: "2026" },
  { date: "2026-07-29", day: "Wednesday", nakshatram: "രോഹിണി", thithi: "ദ്വാദശി", time: "08:15 AM – 10:00 AM", quality: "Excellent", month: "July", year: "2026" },
  { date: "2026-08-12", day: "Wednesday", nakshatram: "ഉത്രാടം", thithi: "ദ്വാദശി", time: "06:42 AM – 08:10 AM", quality: "Excellent", month: "August", year: "2026" },
  { date: "2026-08-19", day: "Wednesday", nakshatram: "രേവതി", thithi: "തൃതീയ", time: "07:05 AM – 09:30 AM", quality: "Excellent", month: "August", year: "2026" },
  { date: "2026-09-03", day: "Thursday", nakshatram: "രോഹിണി", thithi: "പঞ্চമി", time: "06:55 AM – 08:45 AM", quality: "Good", month: "September", year: "2026" },
  { date: "2026-09-17", day: "Thursday", nakshatram: "മകയിരം", thithi: "ഏകാദശി", time: "07:15 AM – 09:00 AM", quality: "Good", month: "September", year: "2026" },
  { date: "2026-10-08", day: "Thursday", nakshatram: "ഉത്രം", thithi: "സപ്തമി", time: "06:30 AM – 08:20 AM", quality: "Excellent", month: "October", year: "2026" },
  { date: "2026-10-22", day: "Thursday", nakshatram: "രേവതി", thithi: "ദ്വാദശി", time: "08:00 AM – 09:40 AM", quality: "Good", month: "October", year: "2026" },
  { date: "2026-11-12", day: "Thursday", nakshatram: "അത്തം", thithi: "തൃതീയ", time: "09:10 AM – 10:50 AM", quality: "Excellent", month: "November", year: "2026" },
  { date: "2026-11-26", day: "Thursday", nakshatram: "ചോതി", thithi: "ദ്വാദശി", time: "08:30 AM – 10:15 AM", quality: "Good", month: "November", year: "2026" },
  { date: "2026-12-10", day: "Thursday", nakshatram: "രോഹിണി", thithi: "പঞ্চമി", time: "09:15 AM – 10:25 AM", quality: "Excellent", month: "December", year: "2026" },
  { date: "2026-12-14", day: "Monday", nakshatram: "രേവതി", thithi: "ഏകാദശി", time: "10:05 AM – 11:40 AM", quality: "Excellent", month: "December", year: "2026" },

  // 2027
  { date: "2027-01-13", day: "Wednesday", nakshatram: "മകയിരം", thithi: "പঞ্চമി", time: "09:10 AM – 10:45 AM", quality: "Excellent", month: "January", year: "2027" },
  { date: "2027-01-27", day: "Wednesday", nakshatram: "ചോതി", thithi: "ദശമി", time: "08:30 AM – 10:10 AM", quality: "Good", month: "January", year: "2027" },
  { date: "2027-02-11", day: "Thursday", nakshatram: "അനിഴം", thithi: "ഷഷ്ഠി", time: "07:40 AM – 09:20 AM", quality: "Good", month: "February", year: "2027" },
  { date: "2027-02-25", day: "Thursday", nakshatram: "രേവതി", thithi: "ഏകാദശി", time: "08:15 AM – 09:50 AM", quality: "Excellent", month: "February", year: "2027" },
  { date: "2027-03-10", day: "Wednesday", nakshatram: "രോഹിണി", thithi: "തൃതീയ", time: "09:20 AM – 10:55 AM", quality: "Excellent", month: "March", year: "2027" },
  { date: "2027-03-24", day: "Wednesday", nakshatram: "മകയിരം", thithi: "ദ്വാദശി", time: "08:05 AM – 09:40 AM", quality: "Good", month: "March", year: "2027" },
  { date: "2027-04-15", day: "Thursday", nakshatram: "ഉത്രം", thithi: "നവമി", time: "09:00 AM – 10:30 AM", quality: "Good", month: "April", year: "2027" },
  { date: "2027-04-28", day: "Wednesday", nakshatram: "അത്തം", thithi: "തൃതീയ", time: "08:15 AM – 09:50 AM", quality: "Excellent", month: "April", year: "2027" },
  { date: "2027-05-12", day: "Wednesday", nakshatram: "ചോതി", thithi: "ഷഷ്ഠി", time: "07:30 AM – 09:10 AM", quality: "Good", month: "May", year: "2027" },
  { date: "2027-05-27", day: "Thursday", nakshatram: "അനിഴം", thithi: "ഏകാദശി", time: "08:45 AM – 10:20 AM", quality: "Excellent", month: "May", year: "2027" },
  { date: "2027-06-10", day: "Thursday", nakshatram: "രോഹിണി", thithi: "പঞ্চമി", time: "09:00 AM – 10:40 AM", quality: "Excellent", month: "June", year: "2027" },
  { date: "2027-06-23", day: "Wednesday", nakshatram: "രേവതി", thithi: "ദശമി", time: "08:10 AM – 09:50 AM", quality: "Good", month: "June", year: "2027" },
  { date: "2027-07-14", day: "Wednesday", nakshatram: "മകയിരം", thithi: "ദ്വിതീയ", time: "07:55 AM – 09:30 AM", quality: "Good", month: "July", year: "2027" },
  { date: "2027-07-28", day: "Wednesday", nakshatram: "ഉത്രം", thithi: "ദ്വാദശി", time: "08:20 AM – 10:05 AM", quality: "Excellent", month: "July", year: "2027" },
  { date: "2027-08-12", day: "Thursday", nakshatram: "അത്തം", thithi: "ദശമി", time: "09:15 AM – 10:55 AM", quality: "Excellent", month: "August", year: "2027" },
  { date: "2027-08-25", day: "Wednesday", nakshatram: "ചോതി", thithi: "തൃതീയ", time: "08:00 AM – 09:35 AM", quality: "Good", month: "August", year: "2027" },
  { date: "2027-09-09", day: "Thursday", nakshatram: "അനിഴം", thithi: "ഷഷ്ഠി", time: "07:45 AM – 09:20 AM", quality: "Good", month: "September", year: "2027" },
  { date: "2027-09-22", day: "Wednesday", nakshatram: "രോഹിണി", thithi: "ഏകാദശി", time: "09:10 AM – 10:40 AM", quality: "Excellent", month: "September", year: "2027" },
  { date: "2027-10-14", day: "Thursday", nakshatram: "രേവതി", thithi: "ചതുർത്ഥി", time: "08:25 AM – 10:00 AM", quality: "Good", month: "October", year: "2027" },
  { date: "2027-10-28", day: "Thursday", nakshatram: "മകയിരം", thithi: "ദ്വാദശി", time: "09:05 AM – 10:45 AM", quality: "Excellent", month: "October", year: "2027" },
  { date: "2027-11-10", day: "Wednesday", nakshatram: "ഉത്രം", thithi: "ദ്വിതീയ", time: "07:50 AM – 09:25 AM", quality: "Good", month: "November", year: "2027" },
  { date: "2027-11-25", day: "Thursday", nakshatram: "അത്തം", thithi: "ഏകാദശി", time: "09:15 AM – 10:55 AM", quality: "Excellent", month: "November", year: "2027" },
  { date: "2027-12-09", day: "Thursday", nakshatram: "ചോതി", thithi: "പঞ্চമി", time: "08:35 AM – 10:10 AM", quality: "Good", month: "December", year: "2027" },
  { date: "2027-12-22", day: "Wednesday", nakshatram: "അനിഴം", thithi: "ദ്വാദശി", time: "09:20 AM – 11:00 AM", quality: "Excellent", month: "December", year: "2027" },

  // 2028
  { date: "2028-01-12", day: "Wednesday", nakshatram: "രോഹിണി", thithi: "പঞ্চമി", time: "09:15 AM – 10:50 AM", quality: "Excellent", month: "January", year: "2028" },
  { date: "2028-01-26", day: "Wednesday", nakshatram: "രേവതി", thithi: "ദശമി", time: "08:30 AM – 10:05 AM", quality: "Excellent", month: "January", year: "2028" },
  { date: "2028-02-10", day: "Thursday", nakshatram: "മകയിരം", thithi: "ഷഷ്ഠി", time: "07:50 AM – 09:25 AM", quality: "Good", month: "February", year: "2028" },
  { date: "2028-02-24", day: "Thursday", nakshatram: "ഉത്രം", thithi: "ഏകാദശി", time: "08:45 AM – 10:20 AM", quality: "Excellent", month: "February", year: "2028" },
  { date: "2028-03-09", day: "Thursday", nakshatram: "അത്തം", thithi: "തൃതീയ", time: "09:10 AM – 10:45 AM", quality: "Excellent", month: "March", year: "2028" },
  { date: "2028-03-22", day: "Wednesday", nakshatram: "ചോതി", thithi: "ദ്വാദശി", time: "08:00 AM – 09:35 AM", quality: "Good", month: "March", year: "2028" },
  { date: "2028-04-13", day: "Thursday", nakshatram: "അനിഴം", thithi: "ചതുർത്ഥി", time: "07:35 AM – 09:10 AM", quality: "Good", month: "April", year: "2028" },
  { date: "2028-04-27", day: "Thursday", nakshatram: "രോഹിണി", thithi: "ദ്വാദശി", time: "09:20 AM – 11:00 AM", quality: "Excellent", month: "April", year: "2028" },
  { date: "2028-05-10", day: "Wednesday", nakshatram: "രേവതി", thithi: "ഷഷ്ഠി", time: "08:15 AM – 09:50 AM", quality: "Good", month: "May", year: "2028" },
  { date: "2028-05-25", day: "Thursday", nakshatram: "മകയിരം", thithi: "ഏകാദശി", time: "09:05 AM – 10:45 AM", quality: "Excellent", month: "May", year: "2028" },
  { date: "2028-06-14", day: "Wednesday", nakshatram: "ഉത്രം", thithi: "പঞ্চമി", time: "08:30 AM – 10:05 AM", quality: "Good", month: "June", year: "2028" },
  { date: "2028-06-29", day: "Thursday", nakshatram: "അത്തം", thithi: "ദ്വാദശി", time: "09:15 AM – 10:55 AM", quality: "Excellent", month: "June", year: "2028" },
  { date: "2028-07-12", day: "Wednesday", nakshatram: "ചോതി", thithi: "ദ്വിതീയ", time: "07:50 AM – 09:25 AM", quality: "Good", month: "July", year: "2028" },
  { date: "2028-07-27", day: "Thursday", nakshatram: "അനിഴം", thithi: "ഏകാദശി", time: "08:45 AM – 10:20 AM", quality: "Excellent", month: "July", year: "2028" },
  { date: "2028-08-09", day: "Wednesday", nakshatram: "രോഹിണി", thithi: "ചതുർത്ഥി", time: "09:10 AM – 10:45 AM", quality: "Good", month: "August", year: "2028" },
  { date: "2028-08-24", day: "Thursday", nakshatram: "രേവതി", thithi: "ദ്വാദശി", time: "08:20 AM – 09:55 AM", quality: "Excellent", month: "August", year: "2028" },
  { date: "2028-09-13", day: "Wednesday", nakshatram: "മകയിരം", thithi: "പঞ্চമി", time: "09:00 AM – 10:35 AM", quality: "Excellent", month: "September", year: "2028" },
  { date: "2028-09-28", day: "Thursday", nakshatram: "ഉത്രം", thithi: "ഏകാദശി", time: "08:30 AM – 10:05 AM", quality: "Good", month: "September", year: "2028" },
  { date: "2028-10-12", day: "Thursday", nakshatram: "അത്തം", thithi: "ഷഷ്ഠി", time: "07:45 AM – 09:20 AM", quality: "Good", month: "October", year: "2028" },
  { date: "2028-10-26", day: "Thursday", nakshatram: "ചോതി", thithi: "ദ്വാദശി", time: "09:15 AM – 10:55 AM", quality: "Excellent", month: "October", year: "2028" },
  { date: "2028-11-15", day: "Wednesday", nakshatram: "അനിഴം", thithi: "തൃതീയ", time: "08:10 AM – 09:45 AM", quality: "Good", month: "November", year: "2028" },
  { date: "2028-11-29", day: "Wednesday", nakshatram: "രോഹിണി", thithi: "ഏകാദശി", time: "09:20 AM – 11:00 AM", quality: "Excellent", month: "November", year: "2028" },
  { date: "2028-12-14", day: "Thursday", nakshatram: "രേവതി", thithi: "ദ്വാദശി", time: "08:40 AM – 10:15 AM", quality: "Excellent", month: "December", year: "2028" },
  { date: "2028-12-28", day: "Thursday", nakshatram: "മകയിരം", thithi: "പঞ্চമി", time: "09:10 AM – 10:45 AM", quality: "Good", month: "December", year: "2028" },
];

const qualityStyles = {
  Excellent: "bg-emerald-50 text-emerald-700",
  Good: "bg-amber-50 text-amber-700",
};

const SelectField = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-[9px] md:text-[11px] text-charcoal-text/70 font-semibold mb-1 uppercase tracking-wide">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-slate-200 rounded-md md:rounded-lg py-1.5 md:py-2 px-2 md:px-3 text-[11px] md:text-xs text-charcoal-text bg-white focus:outline-none focus:ring-1 focus:ring-deep-maroon focus:border-deep-maroon cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default function Muhurtham() {
  const [form, setForm] = useState({
    preferredMonth: '',
    preferredYear: '',
  });
  const [showResults, setShowResults] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowResults(true);
  };

  const isFormValid = form.preferredMonth !== '' && form.preferredYear !== '';

  const filteredMuhurthams = MUHURTHAM_DATA.filter(
    (item) => item.month === form.preferredMonth && item.year === form.preferredYear
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-24 pb-16 px-margin-mobile md:px-margin-desktop">
      <Helmet>
        <title>Marriage Muhurtham Dates & Timings | Bharath Marriage</title>
        <meta
          name="description"
          content="Find auspicious Muhurtham dates and marriage timings based on traditional Kerala matrimonial practices."
        />
      </Helmet>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <p className="text-[9px] md:text-[11px] font-label-caps font-semibold text-deep-maroon tracking-[0.18em] uppercase mb-1.5 md:mb-2">
            Auspicious Dates
          </p>
          <h1 className="font-display-lg text-lg md:text-2xl text-charcoal-text leading-tight">
            Muhurtham Calendar
          </h1>
          <p className="text-soft-gray text-[11px] md:text-xs mt-2 max-w-sm mx-auto leading-relaxed">
            Select preferred month and year to search auspicious wedding Muhurtham dates and timings.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm p-4 md:p-8"
        >
          {/* Preferred Month / Year */}
          <div className="grid grid-cols-2 gap-3.5 md:gap-6">
            <SelectField
              label="Preferred Month"
              value={form.preferredMonth}
              onChange={(v) => handleChange('preferredMonth', v)}
              options={months}
              placeholder="Select month"
            />
            <SelectField
              label="Preferred Year"
              value={form.preferredYear}
              onChange={(v) => handleChange('preferredYear', v)}
              options={years}
              placeholder="Select year"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-5 md:mt-8">
            <button
              type="submit"
              disabled={!isFormValid}
              className="bg-deep-maroon hover:bg-primary disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-[11px] md:text-sm py-2 md:py-2.5 px-6 md:px-8 rounded-lg shadow transition-all active:scale-95 cursor-pointer"
            >
              Find Muhurtham Dates
            </button>
          </div>
        </form>

        {/* Results */}
        {showResults && (
          <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm p-4 md:p-8 mt-5 fade-in">
            <h3 className="font-display-lg text-base md:text-xl text-heritage-gold text-center mb-1.5">
              Auspicious Muhurtham Dates
            </h3>
            <p className="text-soft-gray text-[10px] md:text-xs text-center mb-4 md:mb-6">
              Auspicious dates for {form.preferredMonth} {form.preferredYear}
            </p>

            <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
              <table className="w-full min-w-[620px] md:min-w-0 border-collapse text-left">
                <thead>
                  <tr className="bg-[#1c1c22]">
                    <th className="text-white text-[10px] md:text-xs font-semibold py-2.5 md:py-3 px-3 md:px-4 rounded-tl-lg">
                      Date
                    </th>
                    <th className="text-white text-[10px] md:text-xs font-semibold py-2.5 md:py-3 px-3 md:px-4">
                      Day
                    </th>
                    <th className="text-white text-[10px] md:text-xs font-semibold py-2.5 md:py-3 px-3 md:px-4">
                      Nakshatram
                    </th>
                    <th className="text-white text-[10px] md:text-xs font-semibold py-2.5 md:py-3 px-3 md:px-4">
                      Thithi
                    </th>
                    <th className="text-white text-[10px] md:text-xs font-semibold py-2.5 md:py-3 px-3 md:px-4">
                      Auspicious Time
                    </th>
                    <th className="text-white text-[10px] md:text-xs font-semibold py-2.5 md:py-3 px-3 md:px-4 rounded-tr-lg">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMuhurthams.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-soft-gray text-[11px] md:text-xs font-semibold">
                        No auspicious Muhurtham dates found for {form.preferredMonth} {form.preferredYear}. Please try another month or year.
                      </td>
                    </tr>
                  ) : (
                    filteredMuhurthams.map((row, i) => (
                      <tr
                        key={row.date}
                        className={i !== filteredMuhurthams.length - 1 ? "border-b border-slate-100" : ""}
                      >
                        <td className="text-charcoal-text text-[11px] md:text-sm py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap font-medium">
                          {row.date}
                        </td>
                        <td className="text-charcoal-text text-[11px] md:text-sm py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap">
                          {row.day}
                        </td>
                        <td className="text-charcoal-text text-[11px] md:text-sm py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap">
                          {row.nakshatram}
                        </td>
                        <td className="text-charcoal-text text-[11px] md:text-sm py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap">
                          {row.thithi}
                        </td>
                        <td className="text-charcoal-text text-[11px] md:text-sm py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap">
                          {row.time}
                        </td>
                        <td className="py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap">
                          <span className={`text-[10px] md:text-[11px] font-semibold py-0.5 px-2 rounded-full ${qualityStyles[row.quality]}`}>
                            {row.quality}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-soft-gray text-[10px] md:text-[11px] text-center mt-4 md:mt-5 leading-relaxed">
              Timings shown are based on traditional Panchang calculations. Please consult your family priest for final confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
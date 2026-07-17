import React, { useState } from 'react';

export default function ManagePhotosView() {
  const [photos, setPhotos] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=500', isPrimary: true },
    { id: 2, url: '', isPrimary: false },
    { id: 3, url: '', isPrimary: false },
    { id: 4, url: '', isPrimary: false },
  ]);

  const handleFileUpload = (id, file) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id
          ? { ...photo, url: imageUrl }
          : photo
      )
    );
  };

  const deletePhoto = (id) => {
    setPhotos((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, url: '' } : photo))
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <section className="rounded-none md:rounded-xl border-none md:border md:border-slate-200/60 bg-transparent md:bg-white p-0 md:p-6 shadow-none md:shadow-sm text-left">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-charcoal-text uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-deep-maroon"></span>
            Manage Photos
          </h2>
          <p className="text-[11px] text-soft-gray mt-1">Upload up to 4 photos. Primary photo is shown as search display card.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative rounded-xl border border-dashed border-slate-200 aspect-[3/4] flex flex-col items-center justify-center bg-slate-50/50 overflow-hidden group">
              {photo.url ? (
                <>
                  <img src={photo.url} alt="Profile photo" className="w-full h-full object-cover" />

                  {photo.isPrimary && (
                    <span className="absolute top-2 left-2 bg-deep-maroon text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow border border-white/20 uppercase tracking-wider">
                      Primary
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!photo.isPrimary && (
                      <button
                        onClick={() => {
                          setPhotos((prev) =>
                            prev.map((p) => ({ ...p, isPrimary: p.id === photo.id }))
                          );
                        }}
                        className="bg-white hover:bg-slate-50 text-charcoal-text p-1.5 rounded-full shadow hover:scale-105 transition-all cursor-pointer"
                        title="Make Primary"
                      >
                        <span className="material-symbols-outlined text-base leading-none">star</span>
                      </button>
                    )}
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow hover:scale-105 transition-all cursor-pointer"
                      title="Delete Photo"
                    >
                      <span className="material-symbols-outlined text-base leading-none">delete</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center p-3 text-center">
                  <span className="material-symbols-outlined text-[32px] text-slate-300 mb-1">
                    add_a_photo
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    id={`photo-upload-${photo.id}`}
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(photo.id, e.target.files?.[0])
                    }
                  />

                  <label
                    htmlFor={`photo-upload-${photo.id}`}
                    className="text-[10px] font-bold text-deep-maroon hover:text-primary transition-colors cursor-pointer hover:underline"
                  >
                    Add Photo
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

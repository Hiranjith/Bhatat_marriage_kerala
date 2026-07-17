import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#12020a] border-t-2 border-heritage-gold/30 w-full py-12 md:py-16 text-slate-300">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter pt-2">
        <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
          <div>
            <div className="font-display-lg text-heritage-gold text-xl font-semibold mb-2">Bharath Marriage</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Connecting hearts across cultures since 1998. The most trusted name in Indian matrimony.
            </p>
          </div>
          

          <div className="flex gap-3 pt-1">
            <span className="material-symbols-outlined text-[18px] text-heritage-gold cursor-pointer hover:opacity-75 transition-opacity" title="Facebook">face_nod</span>
            <span className="material-symbols-outlined text-[18px] text-heritage-gold cursor-pointer hover:opacity-75 transition-opacity" title="Website">language</span>
            <span className="material-symbols-outlined text-[18px] text-heritage-gold cursor-pointer hover:opacity-75 transition-opacity" title="Instagram">camera</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-heritage-gold text-[11px] font-bold tracking-wider mb-4 uppercase">Quick Links</h4>
          <ul className="space-y-2">
            <li><a className="text-slate-400 hover:text-heritage-gold text-[11px] transition-colors" href="#">Success Stories</a></li>
            <li><a className="text-slate-400 hover:text-heritage-gold text-[11px] transition-colors" href="#">Safety Tips</a></li>
            <li><a className="text-slate-400 hover:text-heritage-gold text-[11px] transition-colors" href="#">Matrimony Blog</a></li>
            
          </ul>
        </div>
        
        <div>
          <h4 className="text-heritage-gold text-[11px] font-bold tracking-wider mb-4 uppercase">Support</h4>
          <ul className="space-y-2">
            <li><a className="text-slate-400 hover:text-heritage-gold text-[11px] transition-colors" href="#">Contact Support</a></li>
            <li><a className="text-slate-400 hover:text-heritage-gold text-[11px] transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="text-slate-400 hover:text-heritage-gold text-[11px] transition-colors" href="#">Terms of Use</a></li>
            <li><a className="text-slate-400 hover:text-heritage-gold text-[11px] transition-colors" href="#">Cookie Policy</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-heritage-gold text-[11px] font-bold tracking-wider mb-4 uppercase">Support Desk</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
            Our support desk is available to assist you with any questions or inquiries.
          </p>
          <a 
            href="mailto:help@bharathmarriage.com" 
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-heritage-gold text-on-secondary-fixed hover:brightness-110 text-xs font-bold rounded-lg shadow-md transition-all active:scale-[0.98] duration-200"
          >
            <span className="material-symbols-outlined text-[15px] leading-none text-on-secondary-fixed font-bold">mail</span>
            <span className="text-on-secondary-fixed font-bold">help@bharathmarriage.com</span>
          </a>
        </div>
      </div>
      
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12 pt-6 border-t border-white/5 text-center">
        <p className="text-slate-500 text-[10px] tracking-wide">
          © 2026 Bharath Marriage. Premium Matrimony Services. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

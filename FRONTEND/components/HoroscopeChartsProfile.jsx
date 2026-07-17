import React, { useState, useRef, useEffect } from 'react';

// 10 Kerala Jathakam planets/points with short labels
const PLANETS = [
  { value: 'ല', label: 'ല – ലഗ്നം (Lagna)' },
  { value: 'സൂ', label: 'സൂ – സൂര്യൻ (Sun)' },
  { value: 'ച', label: 'ച – ചന്ദ്രൻ (Moon)' },
  { value: 'ചൊ', label: 'ചൊ – ചൊവ്വ (Mars)' },
  { value: 'ബു', label: 'ബു – ബുധൻ (Mercury)' },
  { value: 'ഗു', label: 'ഗു – ഗുരു (Jupiter)' },
  { value: 'ശു', label: 'ശു – ശുക്രൻ (Venus)' },
  { value: 'ശ', label: 'ശ – ശനി (Saturn)' },
  { value: 'രാ', label: 'രാ – രാഹു (Rahu)' },
  { value: 'കെ', label: 'കെ – കേതു (Ketu)' }
];

// South Indian chart: 12 houses in fixed grid positions
// Center (positions 5,6,9,10 in 0-indexed 4×4 = merged label cell)
// House numbers follow South Indian convention:
//  Row0: house 12,1,2,3
//  Row1: house 11, [center], 4
//  Row2: house 10, [center], 5
//  Row3: house 9,8,7,6
const HOUSE_GRID = [
  // [gridRow, gridCol, houseNumber]  (0-indexed)
  [0, 0, 12], [0, 1, 1],  [0, 2, 2],  [0, 3, 3],
  [1, 0, 11],                          [1, 3, 4],
  [2, 0, 10],                          [2, 3, 5],
  [3, 0, 9],  [3, 1, 8],  [3, 2, 7],  [3, 3, 6],
];

// Multi-select dropdown for a single house cell
function HouseCell({ houseNum, selected, onChange, editMode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div
      ref={ref}
      className="relative border border-charcoal-text w-full h-full"
      style={{ minHeight: '100%' }}
    >
      {/* Cell content */}
      <div
        className={`relative w-full h-full flex flex-wrap items-center justify-center gap-[2px] p-[2px] leading-none
          ${editMode ? 'cursor-pointer hover:bg-heritage-gold/10 transition-colors' : ''}`}
        onClick={() => editMode && setOpen(o => !o)}
      >
        <span className="absolute top-0 left-1 text-[8px] text-gray-400 select-none">
          {houseNum}
        </span>
        {selected.length === 0 ? (
          editMode && (
            <span className="text-[8px] text-charcoal-text/30 select-none">+</span>
          )
        ) : (
          selected.map(v => (
            <span key={v} className="text-[9px] font-semibold text-deep-maroon leading-none">
              {v}
            </span>
          ))
        )}
      </div>

      {/* Dropdown */}
      {open && editMode && (
        <div
          className="absolute z-50 bg-white border border-charcoal-text/30 shadow-lg rounded"
          style={{
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: '160px',
            marginTop: '2px',
          }}
        >
          <div className="px-2 py-1 border-b border-charcoal-text/10">
            <span className="text-[9px] font-semibold text-charcoal-text/50 uppercase tracking-wide">
              House {houseNum}
            </span>
          </div>
          {PLANETS.map(p => (
            <div
              key={p.value}
              className={`flex items-center gap-2 px-2 py-[5px] cursor-pointer hover:bg-heritage-gold/10 transition-colors
                ${selected.includes(p.value) ? 'bg-deep-maroon/5' : ''}`}
              onClick={() => toggle(p.value)}
            >
              <div
                className={`w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0
                  ${selected.includes(p.value)
                    ? 'bg-deep-maroon border-deep-maroon'
                    : 'border-charcoal-text/30'}`}
              >
                {selected.includes(p.value) && (
                  <svg className="w-2 h-2 text-white" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-[11px] text-charcoal-text">{p.label}</span>
            </div>
          ))}
          <div
            className="px-2 py-[5px] border-t border-charcoal-text/10 cursor-pointer hover:bg-red-50 transition-colors"
            onClick={() => { onChange([]); setOpen(false); }}
          >
            <span className="text-[10px] text-red-400">Clear</span>
          </div>
        </div>
      )}
    </div>
  );
}

// The 4×4 grid chart
function JathakamChart({ title, data, onChange, editMode }) {
  // Build a 4×4 matrix
  // Center cells (row1-2, col1-2) = label
  const renderCell = (row, col) => {
    // Center merged cell
    if (row === 1 && col === 1) {
      return (
        <div
          key="center"
          className="col-span-2 row-span-2 border border-charcoal-text flex items-center justify-center font-bold text-charcoal-text text-sm"
        >
          {title}
        </div>
      );
    }
    // Skip cells covered by center merge
    if ((row === 1 || row === 2) && (col === 1 || col === 2)) return null;

    // Find house number for this position
    const house = HOUSE_GRID.find(([r, c]) => r === row && c === col);
    if (!house) return null;
    const houseNum = house[2];

    return (
      <HouseCell
        key={`${row}-${col}`}
        houseNum={houseNum}
        selected={data[houseNum] || []}
        onChange={(val) => onChange(houseNum, val)}
        editMode={editMode}
      />
    );
  };

  const cells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = renderCell(r, c);
      if (cell) cells.push(cell);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="grid border-2 border-charcoal-text bg-white select-none"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          width: '240px',
          height: '240px',
        }}
      >
        {/* Row 0 */}
        {renderCell(0,0)}
        {renderCell(0,1)}
        {renderCell(0,2)}
        {renderCell(0,3)}
        {/* Row 1 */}
        {renderCell(1,0)}
        {renderCell(1,1)}{/* center spans 2×2 */}
        {renderCell(1,3)}
        {/* Row 2 */}
        {renderCell(2,0)}
        {renderCell(2,3)}
        {/* Row 3 */}
        {renderCell(3,0)}
        {renderCell(3,1)}
        {renderCell(3,2)}
        {renderCell(3,3)}
      </div>
      {editMode && (
        <p className="text-[9px] text-charcoal-text/40 text-center">
          Tap any box to assign planets
        </p>
      )}
    </div>
  );
}

function findPlanetHouse(chartData, planet) {
  for (const house in chartData) {
    if (chartData[house]?.includes(planet)) {
      return Number(house);
    }
  }
  return null;
}

export default function HoroscopeChartsProfile({ 
  editMode = false,
  grahanila = {},
  setGrahanila,
  navamsakam = {},
  setNavamsakam
}) {

  const updateGrahanila = (house, planets) => {
    setGrahanila(prev => {
      let updated = { ...prev };

      planets.forEach(planet => {
        const existingHouse = findPlanetHouse(updated, planet);

        if (existingHouse && existingHouse !== house) {
          updated[existingHouse] =
            updated[existingHouse].filter(p => p !== planet);
        }
      });

      updated[house] = planets;

      return updated;
    });
  };

  const updateNavamsakam = (house, planets) => {
    setNavamsakam(prev => {
      let updated = { ...prev };

      planets.forEach(planet => {
        const existingHouse = findPlanetHouse(updated, planet);

        if (existingHouse && existingHouse !== house) {
          updated[existingHouse] =
            updated[existingHouse].filter(p => p !== planet);
        }
      });

      updated[house] = planets;

      return updated;
    });
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-8 justify-center items-start">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-semibold text-charcoal-text/60 uppercase tracking-wider mb-1">
            ഗ്രഹനില
          </span>
          <JathakamChart
            title="ഗ്രഹനില"
            data={grahanila}
            onChange={updateGrahanila}
            editMode={editMode}
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-semibold text-charcoal-text/60 uppercase tracking-wider mb-1">
            നവാംശകം
          </span>
          <JathakamChart
            title="നവാംശകം"
            data={navamsakam}
            onChange={updateNavamsakam}
            editMode={editMode}
          />
        </div>
      </div>

      {/* Legend */}
      {editMode && (
        <div className="mx-auto max-w-md">
          <p className="text-[9px] text-charcoal-text/40 text-center mb-2 uppercase tracking-wide">
            Planet Reference
          </p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {PLANETS.map(p => (
              <span key={p.value} className="text-[9px] text-charcoal-text/60">
                <span className="font-semibold text-deep-maroon">{p.value}</span>
                {' '}= {p.label.split('–')[1]?.split('(')[0]?.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
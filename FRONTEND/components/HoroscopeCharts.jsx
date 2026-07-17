import React, { forwardRef } from 'react';

const HOUSE_GRID = [
  [0, 0, 12], [0, 1, 1],  [0, 2, 2],  [0, 3, 3],
  [1, 0, 11],                          [1, 3, 4],
  [2, 0, 10],                          [2, 3, 5],
  [3, 0, 9],  [3, 1, 8],  [3, 2, 7],  [3, 3, 6],
];

function HouseCell({ houseNum, selected = [] }) {
  return (
    <div className="relative border border-charcoal-text w-full h-full" style={{ minHeight: '100%' }}>
      <div className="relative w-full h-full flex flex-wrap items-center justify-center gap-[2px] pt-3 px-[2px] pb-[2px] leading-none">
        <span className="absolute top-0 left-1 text-[8px] text-gray-400 select-none">
          {houseNum}
        </span>
        {selected.map(v => (
          <span key={v} className="text-[9px] font-semibold text-deep-maroon leading-none">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

function JathakamChart({ title, data, symbol }) {
  const renderCell = (row, col) => {
    if (row === 1 && col === 1) {
      return (
        <div
          key="center"
          className="col-span-2 row-span-2 border border-charcoal-text flex flex-col items-center justify-center gap-1"
        >
          <span className="text-deep-maroon text-lg leading-none">{symbol}</span>
          <span className="font-bold text-charcoal-text text-[11px]">{title}</span>
        </div>
      );
    }
    if ((row === 1 || row === 2) && (col === 1 || col === 2)) return null;

    const house = HOUSE_GRID.find(([r, c]) => r === row && c === col);
    if (!house) return null;
    const houseNum = house[2];

    return (
      <HouseCell
        key={`${row}-${col}`}
        houseNum={houseNum}
        selected={data[houseNum] || []}
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="border-2 border-charcoal-text bg-white select-none"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          width: '240px',
          height: '240px',
        }}
      >
        {renderCell(0,0)}{renderCell(0,1)}{renderCell(0,2)}{renderCell(0,3)}
        {renderCell(1,0)}{renderCell(1,1)}{renderCell(1,3)}
        {renderCell(2,0)}{renderCell(2,3)}
        {renderCell(3,0)}{renderCell(3,1)}{renderCell(3,2)}{renderCell(3,3)}
      </div>
    </div>
  );
}

const HoroscopeCharts = forwardRef(function HoroscopeCharts({
  grahanila = {
    12: ['ചൊ'], 11: ['ശ'], 10: ['കെ'], 8: ['രാ'],
    7: ['ശു'], 5: ['ഗു'], 4: ['ബു'], 3: ['സൂ'], 1: ['ല', 'ച'],
  },
  navamsakam = {
    11: ['ശ', 'ചൊ'], 10: ['കെ'], 9: ['രാ'], 7: ['ശു'],
    6: ['ഗു'], 4: ['ബു'], 3: ['സൂ'], 2: ['ച'], 1: ['ല'],
  }
}, ref) {
  return (
    <div ref={ref} className="mt-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-8 justify-center items-center sm:items-start">

        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-semibold text-charcoal-text/60 uppercase tracking-wider mb-1">
            <span className="text-deep-maroon"></span> ഗ്രഹനില
          </span>
          <JathakamChart title="ഗ്രഹനില" symbol="ॐ" data={grahanila} />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-semibold text-charcoal-text/60 uppercase tracking-wider mb-1">
            <span className="text-deep-maroon"></span> നവാംശകം നവാംശകം
          </span>
         <JathakamChart title="നവാംശകം" symbol="卐" data={navamsakam} />
        </div>

      </div>
    </div>
  );
});

export default HoroscopeCharts;
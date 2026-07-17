import * as kollavarshamPkg from 'kollavarsham';
const Kollavarsham = kollavarshamPkg.Kollavarsham || kollavarshamPkg.default;
const kollavarsham = new Kollavarsham();
const date = new Date('1995-05-15');
const result = kollavarsham.fromGregorianDate(date);
console.log(Object.keys(result));
console.log(result.mlMalayalamMasa, result.enMalayalamMasa);

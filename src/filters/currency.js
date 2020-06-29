export default function (num) {
  function replacer(c,i,a){
    const currency = (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c);
    return currency;
  };//c為匹配的字串
  const n = Number(num);
  return `$${n.toFixed(0).replace(/./g, replacer)}`;
}

/*
2000.5
2000

*/

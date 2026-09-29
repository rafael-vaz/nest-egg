function getOrdinalWeekdayOfMonth(date: Date) {
  const dayNumber = date.getDate();
  const ordinalNamesFem = [
    "primeira",
    "segunda",
    "terceira",
    "quarta",
    "quinta",
  ];
  const ordinalNamesMasc = [
    "primeiro",
    "segundo",
    "terceiro",
    "quarto",
    "quinto",
  ];
  const index = Math.ceil(dayNumber / 7);
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  return isWeekend ? ordinalNamesMasc[index - 1] : ordinalNamesFem[index - 1];
}

export default getOrdinalWeekdayOfMonth;

import { format } from "date-fns";

function formatShortDate(input: Date | string) {
  let date: Date;

  if (typeof input === "string") {
    date = new Date(input);
  } else {
    date = input;
  }
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const safeDate = new Date(year, month, day);

  return format(safeDate, "dd/MM/yy");
}

export default formatShortDate;

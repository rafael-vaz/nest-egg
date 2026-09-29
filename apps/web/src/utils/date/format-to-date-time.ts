import { format } from "date-fns";

function formatToDateTime(dateObj: Date) {
  return format(dateObj, "yyyy-MM-dd");
}

export default formatToDateTime;

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

function formatRelativeDate(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR,
  });
}

export default formatRelativeDate;

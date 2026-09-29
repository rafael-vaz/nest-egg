import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function formatDefaultDate(date: Date) {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export default formatDefaultDate;

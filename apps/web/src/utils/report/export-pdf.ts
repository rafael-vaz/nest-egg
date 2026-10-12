import type { jsPDF as JsPDFType } from "jspdf";

import formatShortDate from "../date/format-short-date";
import { IReportData } from "./build-report-data";

// jspdf-autotable attaches `lastAutoTable` to the doc instance at runtime
// but doesn't declare it in jsPDF's public types
type AutoTableDoc = JsPDFType & { lastAutoTable?: { finalY: number } };

const TABLE_STYLE_OPTIONS = {
  styles: { halign: "center" as const },
  headStyles: {
    halign: "center" as const,
    fillColor: [217, 217, 217] as [number, number, number],
    textColor: [33, 33, 33] as [number, number, number],
    fontStyle: "bold" as const,
  },
};

async function exportPdfReport(data: IReportData, fileName: string) {
  // jspdf/jspdf-autotable are heavy and only needed when a report is
  // actually exported, so they're kept out of the main bundle
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const doc = new jsPDF() as AutoTableDoc;

  doc.setFontSize(16);
  doc.text("Relatório Nest Egg", 14, 16);
  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatShortDate(new Date())}`, 14, 22);

  autoTable(doc, {
    ...TABLE_STYLE_OPTIONS,
    startY: 28,
    head: [["Resumo", ""]],
    body: data.summary.map((row) => [row.label, row.value]),
  });

  if (data.transactions) {
    const startY = (doc.lastAutoTable?.finalY ?? 28) + 10;
    doc.setFontSize(12);
    doc.text("Transações", 14, startY);
    autoTable(doc, {
      ...TABLE_STYLE_OPTIONS,
      startY: startY + 4,
      head: [["Data", "Nome", "Categoria", "Tipo", "Valor"]],
      body: data.transactions.map((row) => [
        row.date,
        row.name,
        row.category,
        row.type,
        row.value,
      ]),
    });
  }

  if (data.goals) {
    const startY = (doc.lastAutoTable?.finalY ?? 28) + 10;
    doc.setFontSize(12);
    doc.text("Metas", 14, startY);
    autoTable(doc, {
      ...TABLE_STYLE_OPTIONS,
      startY: startY + 4,
      head: [["Nome", "Valor", "Status", "Viabilidade", "Coleção", "Descrição"]],
      body: data.goals.map((row) => [
        row.name,
        row.value,
        row.status,
        row.viability,
        row.collection,
        row.description,
      ]),
    });
  }

  if (data.collections) {
    const startY = (doc.lastAutoTable?.finalY ?? 28) + 10;
    doc.setFontSize(12);
    doc.text("Coleções", 14, startY);
    autoTable(doc, {
      ...TABLE_STYLE_OPTIONS,
      startY: startY + 4,
      head: [["Nome", "Qtd. de metas", "Descrição"]],
      body: data.collections.map((row) => [
        row.name,
        `${row.goalsCount}`,
        row.description,
      ]),
    });
  }

  doc.save(fileName);
}

export default exportPdfReport;

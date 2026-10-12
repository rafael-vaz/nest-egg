import type ExcelJSType from "exceljs";

import { IReportData } from "./build-report-data";
import triggerFileDownload from "./trigger-file-download";

const HEADER_FILL: ExcelJSType.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD9D9D9" },
};

function styleSheet(sheet: ExcelJSType.Worksheet) {
  sheet.columns.forEach((column) => {
    column.alignment = { horizontal: "center", vertical: "middle" };
  });
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    cell.fill = HEADER_FILL;
  });
}

async function exportExcelReport(data: IReportData, fileName: string) {
  // exceljs is heavy and only needed when a report is actually exported,
  // so it's kept out of the main bundle
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();

  const summarySheet = workbook.addWorksheet("Resumo");
  summarySheet.columns = [
    { header: "Item", key: "label", width: 25 },
    { header: "Valor", key: "value", width: 20 },
  ];
  summarySheet.addRows(data.summary);
  styleSheet(summarySheet);

  if (data.transactions) {
    const sheet = workbook.addWorksheet("Transações");
    sheet.columns = [
      { header: "Data", key: "date", width: 12 },
      { header: "Nome", key: "name", width: 30 },
      { header: "Categoria", key: "category", width: 20 },
      { header: "Tipo", key: "type", width: 12 },
      { header: "Valor", key: "value", width: 16 },
    ];
    sheet.addRows(data.transactions);
    styleSheet(sheet);
  }

  if (data.goals) {
    const sheet = workbook.addWorksheet("Metas");
    sheet.columns = [
      { header: "Nome", key: "name", width: 25 },
      { header: "Valor", key: "value", width: 16 },
      { header: "Status", key: "status", width: 14 },
      { header: "Viabilidade", key: "viability", width: 14 },
      { header: "Coleção", key: "collection", width: 20 },
      { header: "Descrição", key: "description", width: 30 },
    ];
    sheet.addRows(data.goals);
    styleSheet(sheet);
  }

  if (data.collections) {
    const sheet = workbook.addWorksheet("Coleções");
    sheet.columns = [
      { header: "Nome", key: "name", width: 25 },
      { header: "Qtd. de metas", key: "goalsCount", width: 16 },
      { header: "Descrição", key: "description", width: 30 },
    ];
    sheet.addRows(data.collections);
    styleSheet(sheet);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  triggerFileDownload(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );
}

export default exportExcelReport;

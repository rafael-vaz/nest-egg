import {
  Banknote,
  CheckCircle,
  Circle,
  Download,
  FolderCheck,
  ListChecks,
  LucideProps,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "../../store/configure-store";
import {
  buildCollectionReportRows,
  buildGoalReportRows,
  buildTransactionReportRows,
  buildWalletSummary,
  IReportData,
} from "../../utils/report/build-report-data";
import exportExcelReport from "../../utils/report/export-excel";
import exportPdfReport from "../../utils/report/export-pdf";
import Button from "../button/button";
import Label from "../label/label";
import ModalHeader from "../modal/modal-header";
import Select from "../select/select";
import styles from "./export-report.module.css";

type ReportFormat = "xlsx" | "pdf";
type ReportEntity = "transactions" | "goals" | "collections";

const formatOptions = [
  { id: "xlsx", value: "Excel (.xlsx)" },
  { id: "pdf", value: "PDF (.pdf)" },
];

const entityOptions: {
  id: ReportEntity;
  value: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}[] = [
  { id: "transactions", value: "Transações", icon: Banknote },
  { id: "goals", value: "Metas", icon: ListChecks },
  { id: "collections", value: "Coleções", icon: FolderCheck },
];

interface IExportReportProps {
  onClose: () => void;
}

const ExportReport = ({ onClose }: IExportReportProps) => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const { transactions, goals, collections } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const [format, setFormat] = React.useState<ReportFormat>("xlsx");
  const [selectedEntities, setSelectedEntities] = React.useState<
    ReportEntity[]
  >(entityOptions.map((option) => option.id));
  const [loading, setLoading] = React.useState(false);

  function toggleEntity(entity: ReportEntity) {
    setSelectedEntities((current) =>
      current.includes(entity)
        ? current.filter((item) => item !== entity)
        : [...current, entity],
    );
  }

  function selectAllEntities() {
    setSelectedEntities(entityOptions.map((option) => option.id));
  }

  async function handleExport() {
    if (selectedEntities.length === 0) {
      toast.error("Selecione ao menos uma entidade para incluir no relatório.");
      return;
    }

    const walletValue = authUser?.wallet ?? 0;
    const data: IReportData = {
      summary: buildWalletSummary(walletValue),
      transactions: selectedEntities.includes("transactions")
        ? buildTransactionReportRows(transactions)
        : undefined,
      goals: selectedEntities.includes("goals")
        ? buildGoalReportRows(goals, collections, walletValue)
        : undefined,
      collections: selectedEntities.includes("collections")
        ? buildCollectionReportRows(collections)
        : undefined,
    };

    const today = new Date().toISOString().slice(0, 10);
    const fileName = `relatorio-nest-egg-${today}`;

    try {
      setLoading(true);
      if (format === "xlsx") {
        await exportExcelReport(data, `${fileName}.xlsx`);
      } else {
        await exportPdfReport(data, `${fileName}.pdf`);
      }
      toast.success("Relatório gerado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Não foi possível gerar o relatório.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ModalHeader title="Exportar relatório" onClose={onClose} />
      <div className={styles.exportReport}>
        <Select
          id="report-format"
          label="Formato"
          groups={[{ children: formatOptions }]}
          value={format}
          onChange={(value) => setFormat(value as ReportFormat)}
        />

        <div className={styles.entitySection}>
          <div className={styles.entityHeader}>
            <Label
              id="report-entities-label"
              htmlFor="report-entities"
              text="Escolher itens"
              hasMargin={false}
            />
            <button
              type="button"
              className={styles.selectAllLink}
              onClick={selectAllEntities}
            >
              Selecionar tudo
            </button>
          </div>
          <ul id="report-entities" className={styles.entityList}>
            {entityOptions.map((option) => {
              const isSelected = selectedEntities.includes(option.id);
              const EntityIcon = option.icon;
              return (
                <li
                  key={option.id}
                  role="option"
                  aria-selected={isSelected}
                  data-selected={isSelected}
                  className={styles.entityOption}
                  onClick={() => toggleEntity(option.id)}
                  tabIndex={0}
                >
                  <span className={styles.entityOptionLabel}>
                    <EntityIcon size={16} className={styles.entityIcon} />
                    {option.value}
                  </span>
                  {isSelected ? (
                    <CheckCircle size={16} className={styles.checkSelected} />
                  ) : (
                    <Circle size={16} className={styles.checkUnselected} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <Button
          text={loading ? "Gerando relatório..." : "Baixar relatório"}
          icon={Download}
          size="fill"
          disabled={loading}
          onClick={handleExport}
        />
      </div>
    </>
  );
};

export default ExportReport;

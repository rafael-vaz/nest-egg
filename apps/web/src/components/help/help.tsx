import ModalHeader from "../modal/modal-header";
import styles from "./help.module.css";
import HelpFaq from "./help-faq";
import HelpTopics from "./help-topics";

interface IHelpProps {
  onClose: () => void;
}

const Help = ({ onClose }: IHelpProps) => {
  return (
    <>
      <ModalHeader title="Ajuda" onClose={onClose} />
      <p className={styles.helpIntro}>
        O Nest Egg te ajuda a acompanhar sua vida financeira em um só lugar:
        registre transações, defina metas e organize tudo em coleções.
      </p>
      <HelpTopics />
      <HelpFaq onClose={onClose} />
    </>
  );
};

export default Help;

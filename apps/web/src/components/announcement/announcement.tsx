import { ReactNode } from "react";

interface IAnnouncementProps {
  children: ReactNode;
}

const Announcement = ({ children }: IAnnouncementProps) => {
  return (
    <div className="visuallyHidden" role="status" aria-live="polite">
      {children}
    </div>
  );
};

export default Announcement;

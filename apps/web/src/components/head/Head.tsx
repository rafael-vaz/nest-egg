import React from "react";

interface IHeadProps {
  pageTitle: string;
}

const Head = ({ pageTitle = "" }: IHeadProps) => {
  React.useEffect(() => {
    document.title = `Nest Egg | ${pageTitle}`;
  }, [pageTitle]);
  return null;
};

export default Head;

import React from "react";

import { ModalId } from "../../@types/modal";
import {
  useFiltersQueryParams,
  useModalQueryParam,
} from "../../hooks/search/use-query-params";
import { useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";

const SearchParamsRouter = () => {
  const dispatch = useAppDispatch();

  const { modal, closeModal } = useModalQueryParam();
  const { filters } = useFiltersQueryParams();

  React.useEffect(() => {
    if (modal) {
      if (filters.id && modal.includes("update")) {
        dispatch(openModalState({ id: modal as ModalId, entity: filters.id }));
      } else {
        dispatch(openModalState({ id: modal as ModalId }));
      }
    } else {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default SearchParamsRouter;

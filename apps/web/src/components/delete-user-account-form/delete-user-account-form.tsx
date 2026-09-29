import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

import deleteUserAccountFormSchema, {
  DeleteUserAccountFormData,
} from "../../schemas/delete-user-account-form-schem";
import Button from "../button/button";
import GridContainer from "../grid-container/grid-container";
import Input from "../input/input";
import Subtitle from "../subtitle/subtitle";
import styles from "./delete-user-account-form.module.css";
import DeleteUserAccountSubmitButton from "./delete-user-account-submit-button";

interface IDeleteUserAccountFormProps {
  onClose: () => void;
}

const DeleteUserAccountForm = ({ onClose }: IDeleteUserAccountFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteUserAccountFormData>({
    resolver: zodResolver(deleteUserAccountFormSchema),
  });
  const [loading, setLoading] = React.useState(false);

  return (
    <form action="#" className={`${styles.deleteUserAccountForm}`}>
      <>
        <Subtitle text="Deletar conta" />
        <p>Digite sua senha para confirmar a exclusão.</p>
        <Input
          type="password"
          id="confirmation-password"
          label="Confirme sua senha"
          placeholder="Sua senha"
          hasNoMargin={true}
          hasVisibilityToggle={true}
          register={register("password", { required: true })}
          error={errors.password?.message}
        />
        <GridContainer
          columns={2}
          className={styles.deleteUserAccountFormButtons}
        >
          <DeleteUserAccountSubmitButton
            loading={loading}
            setLoading={setLoading}
            handleSubmit={handleSubmit}
          />
          <Button
            text="Cancelar"
            aria-label="Cancelar exclusão de conta"
            icon={X}
            color="light-gray"
            size="fill"
            disabled={loading}
            onClick={onClose}
          />
        </GridContainer>
      </>
    </form>
  );
};

export default DeleteUserAccountForm;

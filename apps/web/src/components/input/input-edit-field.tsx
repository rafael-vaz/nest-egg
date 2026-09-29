import { Check, Pencil, X } from "lucide-react";
import React from "react";

import Button from "../button/button";
import styles from "./input-edit-field.module.css";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  initSize?: "auto" | "fill";
  callback?: (value: string) => void | Promise<void>;
}

const InputEditField = ({
  id,
  initSize = "auto",
  className = "",
  value = "",
  callback,
  ...props
}: IInputProps) => {
  const [activeEdit, setActiveEdit] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [editValue, setEditValue] = React.useState(String(value));

  const inputEditFieldRef = React.useRef<HTMLInputElement>(null);

  function handleEditToggle(event: React.MouseEvent) {
    event.preventDefault();

    if (!activeEdit) {
      setEditValue(String(value));
      setActiveEdit(true);
      return;
    }

    // cancel
    setEditValue(String(value));
    setActiveEdit(false);
  }

  async function handleConfirmEdit(event: React.MouseEvent) {
    event.preventDefault();

    if (!callback) {
      setActiveEdit(false);
      return;
    }

    try {
      setSaving(true);

      await callback(editValue);

      setActiveEdit(false);
    } finally {
      setSaving(false);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditValue(event.target.value);
  }

  React.useEffect(() => {
    if (activeEdit) {
      inputEditFieldRef.current?.focus();
    }
  }, [activeEdit]);

  React.useEffect(() => {
    if (!activeEdit) {
      setEditValue(String(value));
    }
  }, [value, activeEdit]);

  const currentEditToggleIcon = activeEdit ? X : Pencil;
  const currentEditToggleTitle = activeEdit ? "Cancelar" : "Editar";

  return (
    <div
      className={styles.inputEditFieldContainer}
      data-size={initSize}
      data-active-edit={activeEdit}
      data-saving={saving}
    >
      <input
        {...props}
        id={id}
        type="text"
        className={`${styles.inputEditField} ${className}`}
        onChange={handleChange}
        autoComplete="off"
        ref={inputEditFieldRef}
        disabled={!activeEdit || saving}
        value={activeEdit ? editValue : value}
      />

      <div className={styles.inputEditFieldControlContainer}>
        <Button
          id={`${id}-edit-toggle`}
          size="x-small"
          color="transparent"
          icon={currentEditToggleIcon}
          title={currentEditToggleTitle}
          aria-label={currentEditToggleTitle}
          onClick={handleEditToggle}
          disabled={saving}
          className={styles.inputEditFieldEditButton}
        />

        {activeEdit && (
          <Button
            id={`${id}-edit-confirm`}
            size="x-small"
            color="transparent"
            icon={Check}
            title="Confirmar"
            aria-label="Confirmar"
            onClick={handleConfirmEdit}
            disabled={saving}
            className={styles.inputEditFieldConfirmButton}
          />
        )}
      </div>
    </div>
  );
};

export default InputEditField;

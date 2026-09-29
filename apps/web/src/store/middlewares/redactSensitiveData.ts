/* eslint-disable @typescript-eslint/no-explicit-any */
const redactSensitiveDataMiddleware =
  (fieldsToRedact = ["password"]) =>
  () =>
  (next: any) =>
  (action: any) => {
    if (action.meta?.arg) {
      const redactedArg = { ...action.meta.arg };

      fieldsToRedact.forEach((field) => {
        if (redactedArg[field]) {
          redactedArg[field] = "***";
        }
      });

      const redactedAction = {
        ...action,
        meta: {
          ...action.meta,
          arg: redactedArg,
        },
      };

      return next(redactedAction);
    }

    return next(action);
  };

export default redactSensitiveDataMiddleware;

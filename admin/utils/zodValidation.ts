import { z } from "zod";

export const zodValidate =
  <T = any>(schema: z.Schema<T>) =>
  (values: T) => {
    try {
      schema.parse(values);
      return {};
    } catch (e) {
      const err = e as z.ZodError;
      return err.errors.reduce(
        (prev, e) => ({ ...prev, [e.path[0]]: e.message }),
        {}
      );
    }
  };

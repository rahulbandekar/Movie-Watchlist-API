
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = result.error.format();
      const errorMessages = Object.values(formatted)
        .filter((field) => typeof field === "object" && field._errors)
        .map((field) => field._errors)
        .flat();

      return res.status(400).json({
        message: errorMessages.join(", "),
      });
    }
    next();
  };
};

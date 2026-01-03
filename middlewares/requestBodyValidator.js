export const validateRequestBody = (schema) => (req, res, next) => {
  const validationResult = schema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).send({
      message: "Invalid request body",
      violations: JSON.parse(validationResult.error),
    });
  } else {
    next();
  }
};
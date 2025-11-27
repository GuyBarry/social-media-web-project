export const errorHandler = (error, _req, res, _next) => {
  console.error({
    message: error.message,
    stack: error.stack,
  });

  res.status(500).send({
    message: "Oops, something went wrong!",
  });
};
export const noRouteHandler = (req, res, next) => {
  res.status(404).send({ message: "Route does not exist" });
};

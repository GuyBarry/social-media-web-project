import { StatusCodes } from "http-status-codes";
import { CustomException } from "./customException";

const MONGODB_DUPLICATE_KEY_ERROR = 11000;

interface MongoError extends Error {
  message: string;
  code?: number | string;
  keyValue?: Record<string, unknown>;
}

const formatModelName = (name: string): string => {
  if (!name) return "Entity";

  const singular = name.endsWith("s") ? name.slice(0, -1) : name;

  return singular.charAt(0).toUpperCase() + singular.slice(1);
};

const extractErrorMetadata = (error: MongoError) => {
  const collectionMatch = error.message.match(
    /collection: [\w-]+\.(?<collection>[\w-]+)/
  );
  const rawCollection = collectionMatch?.groups?.collection ?? "";
  const formattedModel = formatModelName(rawCollection);

  if (error.keyValue) {
    const field = Object.keys(error.keyValue)[0];
    const value = String(error.keyValue[field]);
    return { model: formattedModel, field, value };
  }

  const fieldMatch = error.message.match(
    /dup key: \{ (?<field>\w+): "(?<value>.*)" \}/
  );

  return {
    model: formattedModel,
    field: fieldMatch?.groups?.field ?? "field",
    value: fieldMatch?.groups?.value ?? "unknown",
  };
};

export const handleDuplicateKeyException = (error: unknown): never => {
  const mongoError = error as MongoError;

  const isDuplicate =
    mongoError.code === MONGODB_DUPLICATE_KEY_ERROR ||
    mongoError.message.includes("E11000");

  if (isDuplicate) {
    const { model, field, value } = extractErrorMetadata(mongoError);

    throw new CustomException(
      `${model} already exists`,
      StatusCodes.CONFLICT,
      { field, value },
    );
  }

  throw error;
};

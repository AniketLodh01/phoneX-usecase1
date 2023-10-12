import { CustomError } from "../utils/custom_error_handler.mjs";
import { executeQuery } from "../utils/db_con.mjs";
import {
  createItemQuery,
  deleteItemQuery,
  getAllItemQuery,
  updateItemQuery,
} from "../utils/db_query.mjs";
import joiValidator, {
  createItemSchema,
  updateItemSchema,
} from "../utils/validator.mjs";

export const createItem = async (event) => {
  const { body } = event;
  const eventBody = JSON.parse(body);

  if (!eventBody) throw new CustomError(400, "Invalid request body");

  const { errors, isValid, values } = await joiValidator(
    eventBody,
    createItemSchema
  );
  if (!isValid && errors) throw new CustomError(400, errors);

  const queryParams = Object.values(values);
  const executedQuery = await executeQuery(createItemQuery(), [queryParams]);

  return {
    statusCode: 200,
    message: "Item created successfully",
  };
};

export const deleteItem = async (event) => {
  const {
    pathParameters: { id: itemID },
  } = event;

  const deletedItem = await executeQuery(deleteItemQuery(), [itemID]);

  if (!deletedItem.affectedRows)
    throw new CustomError(
      404,
      "Item doesnot exist or it might have been deleted already."
    );
  return {
    statusCode: 200,
    message: "Successfully deleted the item.",
  };
};

export const updateItem = async (event) => {
  const {
    pathParameters: { id: itemID },
    body,
  } = event;
  const eventBody = JSON.parse(body);

  if (!eventBody) throw new CustomError(400, "Invalid request body");

  const { errors, isValid, values } = await joiValidator(
    eventBody,
    updateItemSchema
  );
  if (!isValid && errors) throw new CustomError(400, errors);

  const queryParams = Object.values(values).concat(itemID);

  const fieldsToUpdate = Object.keys(values)
    .map((field) => `${field} = ?`)
    .join(", ");

  const executedQuery = await executeQuery(
    updateItemQuery(fieldsToUpdate),
    queryParams
  );

  if (!executedQuery.affectedRows)
    throw new CustomError(
      404,
      "Item doesnot exist or it might have been deleted already."
    );
  return {
    statusCode: 200,
    message: "Item updated successfully",
  };
};

export const getAllItems = async () => {
  const allitems = await executeQuery(getAllItemQuery());

  return {
    statusCode: 200,
    message: "Retrieved items.",
    data: allitems,
  };
};

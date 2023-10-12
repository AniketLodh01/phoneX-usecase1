import { CustomError } from "../utils/custom_error_handler.mjs";
import { executeQuery } from "../utils/db_con.mjs";
import {
  createOrderQuery,
  deleteOrderQuery,
  getAllOrderQuery,
  updateOrderQuery,
} from "../utils/db_query.mjs";
import joiValidator, {
  createOrderSchema,
  updateOrderSchema,
} from "../utils/validator.mjs";

export const createOrder = async (event) => {
  const {
    body,
    headers: {
      authorizedUser: { email },
    },
  } = event;
  const eventBody = JSON.parse(body);

  if (!eventBody) throw new CustomError(400, "Invalid request body");

  const { errors, isValid, values } = await joiValidator(
    eventBody,
    createOrderSchema
  );
  if (!isValid && errors) throw new CustomError(400, errors);
  const queryParams = Object.values(values).concat(email);
  const executedQuery = await executeQuery(createOrderQuery(), [queryParams]);

  return {
    statusCode: 200,
    message: "Order created successfully",
  };
};

export const deleteOrder = async (event) => {
  const {
    pathParameters: { id: orderID },
  } = event;

  const deletedItem = await executeQuery(deleteOrderQuery(), [orderID]);

  if (!deletedItem.affectedRows)
    throw new CustomError(
      404,
      "Order doesnot exist or it might have been deleted already."
    );
  return {
    statusCode: 200,
    message: "Successfully deleted the order.",
  };
};

export const updateOrder = async (event) => {
  const {
    body,
    pathParameters: { id: orderID },
  } = event;
  const eventBody = JSON.parse(body);

  if (!eventBody) throw new CustomError(400, "Invalid request body");

  const { errors, isValid, values } = await joiValidator(
    eventBody,
    updateOrderSchema
  );
  if (!isValid && errors) throw new CustomError(400, errors);

  const queryParams = Object.values(values).concat(orderID);

  const fieldsToUpdate = Object.keys(values)
    .map((field) => `${field} = ?`)
    .join(", ");

  const executedQuery = await executeQuery(
    updateOrderQuery(fieldsToUpdate),
    queryParams
  );

  if (!executedQuery.affectedRows)
    throw new CustomError(
      404,
      "Order doesnot exist or it might have been deleted already."
    );
  return {
    statusCode: 200,
    message: "Order updated successfully",
  };
};

export const getAllOrders = async () => {
  const allitems = await executeQuery(getAllOrderQuery());

  return {
    statusCode: 200,
    message: "Retrieved orders.",
    data: allitems,
  };
};

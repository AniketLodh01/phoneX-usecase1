import { checkAuhorization } from "./controllers/authController.mjs";
import { signIn, signUp } from "./controllers/userController.mjs";
import { CustomError } from "./utils/custom_error_handler.mjs";
import {
  createItem,
  deleteItem,
  updateItem,
  getAllItems,
} from "./controllers/itemController.mjs";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
} from "./controllers/orderController.mjs";

const routes = {
  GET: {
    "/items": getAllItems,
    "/orders": getAllOrders,
  },
  POST: {
    "/signin": signIn,
    "/signup": signUp,
    "/items/create": createItem,
    "/orders/create": createOrder,
  },
  PATCH: {
    "/items/edit/{id}": updateItem,
    "/orders/edit/{id}": updateOrder,
  },
  DELETE: {
    "/items/delete/{id}": deleteItem,
    "/orders/delete/{id}": deleteOrder,
  },
};

const checkRoutesVisibility = {
  GET: {
    PUBLIC: ["/"],
    PRIVATE: ["/items", "/orders"],
  },
  POST: {
    PUBLIC: ["/signin", "/signup"],
    PRIVATE: ["/items/create", "/orders/create"],
  },
  PATCH: {
    PRIVATE: ["/items/edit/{id}", "/orders/edit/{id}"],
  },
  DELETE: {
    PRIVATE: ["/items/delete/{id}", "/orders/delete/{id}"],
  },
};

export const router = async (event) => {
  const { resource, httpMethod } = event;

  if (!routes[httpMethod].hasOwnProperty(resource)) {
    throw new CustomError(404, "No path found");
  }

  if (checkRoutesVisibility[httpMethod].PRIVATE.includes(resource)) {
    //check auhtority of the jwt token here
    const { user: authorizedUser, isTokenValid } = await checkAuhorization(
      event
    );
    if (!isTokenValid && !authorizedUser)
      throw new CustomError(
        401,
        "Following user doesnot have access to the route"
      );
    event.headers["authorizedUser"] = authorizedUser;
  }

  return await callBackFunction(event, routes[httpMethod][resource]);
};

const callBackFunction = async (event, cb) => {
  let response = cb(event);
  return response;
};

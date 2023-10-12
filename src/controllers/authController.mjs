import jwt from "jsonwebtoken";
import { CustomError } from "../utils/custom_error_handler.mjs";
import { executeQuery } from "../utils/db_con.mjs";
import { checkAuthorizedUserQuery } from "../utils/db_query.mjs";

const signJwtToken = (payload) => {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
  return token;
};

export const createJwtToken = (payload) => {
  const token = signJwtToken(payload);
  return token;
};

const verifyJwtToken = async (payload) => {
  let decodedToken;
  const jwtTokenValidationError = {
    JsonWebTokenError: "Jwt token is invalid",
    TokenExpiredError: "Jwt token expired",
  };
  try {
    decodedToken = jwt.verify(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
    });
  } catch (err) {
    err = jwtTokenValidationError[err.name]
      ? jwtTokenValidationError[err.name]
      : "Malformed jwt token";
    throw new CustomError(401, err);
  }
  const [rows] = await executeQuery(checkAuthorizedUserQuery(), [
    decodedToken.email,
  ]);
  if (!rows) throw new CustomError(404, "Invalid jwt token.");
  return rows;
};

export const checkAuhorization = async (event) => {
  let token;
  let isTokenValid = false;
  if (
    event.headers.Authorization &&
    event.headers.Authorization.startsWith("Bearer")
  ) {
    token = event.headers.Authorization.split(" ")[1];
  }

  if (!token)
    throw new CustomError(401, "Session expired! Please log in again");

  const user = await verifyJwtToken(token);
  if (user) isTokenValid = true;

  return { user, isTokenValid };
};

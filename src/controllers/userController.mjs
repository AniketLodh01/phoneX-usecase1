import { CustomError } from "../utils/custom_error_handler.mjs";
import { executeQuery } from "../utils/db_con.mjs";
import { userSigninQuery, userSignupQuery } from "../utils/db_query.mjs";
import joiValidator, {
  signupSchema,
  signinSchema,
} from "../utils/validator.mjs";
import { createJwtToken } from "./authController.mjs";

export const signIn = async (event) => {
  const eventBody = JSON.parse(event.body);
  if (!eventBody) throw new CustomError(400, "Invalid request body");

  const { errors, isValid, values } = await joiValidator(
    eventBody,
    signinSchema
  );
  if (!isValid && errors) throw new CustomError(400, errors);

  const queryParams = Object.values(values);

  const [rows] = await executeQuery(userSigninQuery(), queryParams);
  if (!rows) throw new CustomError(404, "Invalid email or Password");

  const payload = {
    email: values.email,
  };
  return {
    statusCode: 200,
    message: "Signed in successfully",
    data: createJwtToken(payload),
  };
};

export const signUp = async (event) => {
  const eventBody = JSON.parse(event.body);
  if (!eventBody) throw new CustomError(400, "Invalid request body");

  const { errors, isValid, values } = await joiValidator(
    eventBody,
    signupSchema
  );
  if (errors && !isValid) throw new CustomError(400, errors);

  const queryParams = Object.values(values);

  const queryResponse = await executeQuery(userSignupQuery(), [queryParams]);

  const payload = {
    email: values.email,
  };
  return {
    statusCode: 200,
    message: "Signed up successfully",
    data: createJwtToken(payload),
  };
};

import { router } from "./router.mjs";

export const lambdaHandler = async (event, context) => {
  let apiResponse;
  try {
    const response = await router(event);

    apiResponse = {
      statusCode: 200,
      body: JSON.stringify({
        ...response,
      }),
    };
  } catch (err) {
    // TODO://
    console.log(`ERROR:: ${err}`);
    apiResponse = {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        statusCode: err.statusCode || 500,
        message: err.message,
      }),
    };
  } finally {
    return apiResponse;
  }
};

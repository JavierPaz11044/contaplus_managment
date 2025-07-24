import { getAuth } from "firebase-admin/auth";

export default defineEventHandler(async (event) => {
  // Allow registration without auth
  if (event.node.req.url?.startsWith("/api/auth/register")) {
    return;
  }

  if (
    !event.node.req.url?.startsWith("/api/user/") &&
    !event.node.req.url?.startsWith("/api/auth/") &&
    !event.node.req.url?.startsWith("/api/products/")
  ) {
    console.log("event.node.req.url", event.node.req.url);
    return;
  }
  const auth = getAuth();

  try {
    const authHeader = getHeader(event, "authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        statusMessage: "Authorization token is required",
      });
    }

    const token = authHeader.substring(7);

    const decodedToken = await auth.verifyIdToken(token);
    if (!decodedToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token",
      });
    }
    console.log("decodedToken", decodedToken);
    event.context.user = decodedToken;
    event.context.userId = decodedToken.uid;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };

    if (firebaseError.code === "auth/id-token-expired") {
      throw createError({
        statusCode: 401,
        statusMessage: "Token expired",
      });
    }

    if (firebaseError.code === "auth/invalid-id-token") {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token format",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: firebaseError.message || "Authentication error",
    });
  }
});

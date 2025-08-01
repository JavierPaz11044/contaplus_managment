import { getAuth } from "firebase-admin/auth";

export default defineEventHandler(async (event) => {
  // Allow public endpoints without auth
  if (
    event.node.req.url?.startsWith("/api/public/") ||
    event.node.req.url?.startsWith("/api/auth/register")
  ) {
    console.log("🔓 [AUTH] Public endpoint accessed:", event.node.req.url);
    return;
  }

  // Only protect specific API routes
  if (
    !event.node.req.url?.startsWith("/api/user/") &&
    !event.node.req.url?.startsWith("/api/auth/") &&
    !event.node.req.url?.startsWith("/api/products/") &&
    !event.node.req.url?.startsWith("/api/locations/") &&
    !event.node.req.url?.startsWith("/api/promotions/")
  ) {
    console.log("🔓 [AUTH] Non-protected endpoint:", event.node.req.url);
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

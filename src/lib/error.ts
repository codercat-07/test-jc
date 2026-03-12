import { z } from "zod";

export class AppError extends Error {
  public code: string;
  public status: number;

  constructor(message: string, code: string = "INTERNAL_ERROR", status: number = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export const ErrorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string(),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const handleApiError = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
    };
  }

  if (error instanceof z.ZodError) {
    return {
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      status: 400,
      details: error.issues,
    };
  }

  console.error("[GLOBAL_ERROR]", error);
  return {
    message: "Something went wrong",
    code: "INTERNAL_ERROR",
    status: 500,
  };
};

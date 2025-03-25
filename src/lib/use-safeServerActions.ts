/*
# usage

@description -> server actions don't allow throw error directly, so we need to wrap it with ServerActionError

@usage ->

"use server";
 
import { ServerActionError, createServerAction } from "~/lib/action-utils";
 
export const returnValue = createServerAction(async () => {
  return 1;
});
 
export const throwErrorSafe = createServerAction(async () => {
  throw new ServerActionError("Wrong password"); // ! modify to throw your error here
});
 
export const throwErrorUnsafe = createServerAction(async () => {
  throw new Error("Wrong password");
});

*/

export type ServerActionResult<T> =
  | { success: true; value: T }
  | { success: false; error: string };
 
export class ServerActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerActionError";
  }
}
 
export function createServerAction<Return, Args extends unknown[] = []>(
  callback: (...args: Args) => Promise<Return>,
): (...args: Args) => Promise<ServerActionResult<Return>> {
  return async (...args: Args) => {
    try {
      const value = await callback(...args);
      return { success: true, value };
    } catch (error) {
      if (error instanceof ServerActionError)
        return { success: false, error: error.message };
      throw error;
    }
  };
}

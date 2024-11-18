/**
 * A decorator to enhance error handling in asynchronous methods.
 * - Logs errors with context (class and method name).
 * - Optionally preserves the method's original return type or wraps the result as `[null, result]`.
 * - On error, either throws the original error or returns `[error, null]` based on the configuration.
 *
 * @param preserveOriginalReturn - If true, preserves the original return type and rethrows errors;
 *                                 otherwise, returns structured `[null, result]` or `[error, null]`.
 * @returns A property descriptor with enhanced error handling logic.
 *
 * @example
 * // Usage without preserving original return type (default):
 * @HandleErrors()
 * async exampleMethod(): Promise<string> {
 *   return "Hello, world!";
 * }
 *
 * const [error, result] = await this.exampleMethod();
 * if (error) {
 *   console.error("Error occurred:", error);
 * } else {
 *   console.log("Success:", result);
 * }
 *
 * @example
 * // Usage with preserved original return type:
 * @HandleErrors(true)
 * async exampleMethodWithBoolean(): Promise<boolean> {
 *   return true;
 * }
 *
 * try {
 *   const result = await this.exampleMethodWithBoolean();
 *   console.log("Success:", result);
 * } catch (error) {
 *   console.error("Error occurred:", error);
 * }
 */

export function HandleErrors(preserveOriginalReturn = false) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);
        if (preserveOriginalReturn) {
          // Return the original result directly
          return result;
        }
        // Return as [null, result] if not preserving original return
        return [null, result];
      } catch (error: unknown) {
        const className = target.constructor.name;
        const methodName = propertyKey;
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        console.error(`Error in ${className}.${methodName}:`, errorMessage);

        const enhancedError = {
          method: methodName,
          arguments: args,
          error: errorMessage,
          timestamp: new Date().toISOString(),
        };

        console.error('Enhanced Error Details:', enhancedError);

        if (preserveOriginalReturn) {
          throw error; // Re-throw if preserving original return type
        }
        return [error, null];
      }
    };

    return descriptor;
  };
}

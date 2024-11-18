/**
 * A decorator function that wraps a method to handle errors by logging them
 * with additional context such as the class and method name. It enhances the
 * error with metadata and optionally throws a new error with a standardized
 * message.
 *
 * @param target - The prototype of the class.
 * @param propertyKey - The name of the method being decorated.
 * @param descriptor - The property descriptor of the method.
 * @returns The modified property descriptor with error handling.
 */

export function HandleErrors(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      // Return [null, result] if successful
      const result = await originalMethod.apply(this, args);
      return [null, result];
    } catch (error: unknown) {
      // Log the error with additional context
      const className = target.constructor.name;
      const methodName = propertyKey;
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      console.error(`Error in ${className}.${methodName}:`, errorMessage);

      // Optionally enhance the error with additional metadata
      const enhancedError = {
        method: methodName,
        arguments: args,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      };

      console.error('Enhanced Error Details:', enhancedError);

      // Return [error, null] instead of throwing
      return [error, null];
    }
  };

  return descriptor;
}

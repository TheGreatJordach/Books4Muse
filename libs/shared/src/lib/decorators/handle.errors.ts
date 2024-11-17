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
  const originalMethode = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethode.apply(this, args);
    } catch (error: unknown) {
      // Log the error and add some context (method name, class name)
      const className = target.constructor.name;
      const methodName = propertyKey;

      // Safely handle the error object to get the error message
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Log the error with the class and method name for context
      console.error(`Error in ${className}.${methodName}:`, errorMessage);

      // Optionally, enhance the error with additional metadata
      const enhancedError = {
        method: methodName,
        arguments: args,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      };

      // Log the enhanced error details
      console.error('Enhanced Error:', enhancedError);

      // Optionally throw a new error or return a standardized error structure
      throw new Error(`Failed in method ${methodName}: ${errorMessage}`);
    }
  };
  return descriptor;
}

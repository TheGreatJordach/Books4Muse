import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export function handleTransactionError(
  error: unknown,
  location: string,
): never {
  console.error(
    `Transaction Error in ${location}: ${
      error instanceof Error ? error.message : JSON.stringify(error)
    }`,
  );

  if (error instanceof QueryFailedError) {
    throw new HttpException(
      {
        errorType: 'Database Query Failed',
        location,
        timestamp: new Date().toISOString(),
        details: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  } else if (error instanceof HttpException) {
    // Re-throw HttpException to avoid overwriting original details
    throw error;
  } else {
    // Fallback for unexpected errors
    throw new HttpException(
      {
        errorType: 'Unexpected Transaction Error',
        location,
        timestamp: new Date().toISOString(),
        details:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { HandleErrors } from './handle.errors';

// Mocking console.error to check logs in the test
const mockConsoleError = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {});

@Injectable()
class TestService {
  @HandleErrors
  async successfulMethod() {
    return 'Success';
  }

  @HandleErrors
  async failingMethod() {
    throw new Error('Something went wrong');
  }
}

describe('HandleErrors Decorator', () => {
  let testService: TestService;

  beforeEach(() => {
    testService = new TestService();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to reset the state
  });

  it('should handle errors and rethrow with a custom message', async () => {
    try {
      // Using the correct service for testing
      await testService.failingMethod();
    } catch (error: unknown) {
      const e = error as Error; // Type assertion
      expect(e.message).toBe(
        'Failed in method failingMethod: Something went wrong',
      );
    }

    // Check that console.error was called to log the error
    expect(mockConsoleError).toHaveBeenCalled();
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error in TestService.failingMethod:',
      'Something went wrong',
    );
  });

  it('should not log error and return result when the method succeeds', async () => {
    const result = await testService.successfulMethod();

    // No error should be logged
    expect(mockConsoleError).not.toHaveBeenCalled();

    // Ensure the successful method returns the expected result
    expect(result).toBe('Success');
  });
});

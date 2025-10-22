
import { NextFunction, Request, Response } from "express";
import { constants } from "../../constants";
const { errorHandler } = require("../../src/middlewares/errorHandler")


describe('errorHandler() errorHandler method', () => {
  // Helper to create a mock response object
  const createMockRes = (statusCode?: number) => {
    const json = jest.fn();
    return {
      statusCode,
      json,
    } as unknown as Response;
  };

  // Helper to create a mock error
  const createMockError = (message = 'Test error', stack = 'stacktrace') => {
    const err = new Error(message);
    err.stack = stack;
    return err;
  };

  // Happy Paths
  describe('Happy paths', () => {
    test('should handle VALIDATION_ERROR and respond with correct payload', () => {
      // This test ensures that when statusCode is VALIDATION_ERROR, the correct response is sent.
      const err = createMockError('Validation failed', 'stack1');
      const req = {} as Request;
      const res = createMockRes(constants.VALIDATION_ERROR);
      const next = jest.fn() as NextFunction;

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'Validation Failed',
        message: 'Validation failed',
        stackTrace: 'stack1',
      });
    });

    test('should handle NOT_FOUND and respond with correct payload', () => {
      // This test ensures that when statusCode is NOT_FOUND, the correct response is sent.
      const err = createMockError('Not found', 'stack2');
      const req = {} as Request;
      const res = createMockRes(constants.NOT_FOUND);
      const next = jest.fn() as NextFunction;

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'Not Found',
        message: 'Not found',
        stackTrace: 'stack2',
      });
    });

    test('should handle UNAUTHORIZED and respond with correct payload', () => {
      // This test ensures that when statusCode is UNAUTHORIZED, the correct response is sent.
      const err = createMockError('Unauthorized', 'stack3');
      const req = {} as Request;
      const res = createMockRes(constants.UNAUTHORIZED);
      const next = jest.fn() as NextFunction;

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'Unauthorized',
        message: 'Unauthorized',
        stackTrace: 'stack3',
      });
    });

    test('should handle FORBIDDEN and respond with correct payload', () => {
      // This test ensures that when statusCode is FORBIDDEN, the correct response is sent.
      const err = createMockError('Forbidden', 'stack4');
      const req = {} as Request;
      const res = createMockRes(constants.FORBIDDEN);
      const next = jest.fn() as NextFunction;

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'Forbidden',
        message: 'Forbidden',
        stackTrace: 'stack4',
      });
    });

    test('should handle SERVER_ERROR and respond with correct payload', () => {
      // This test ensures that when statusCode is SERVER_ERROR, the correct response is sent.
      const err = createMockError('Server error', 'stack5');
      const req = {} as Request;
      const res = createMockRes(constants.SERVER_ERROR);
      const next = jest.fn() as NextFunction;

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'Server Error',
        message: 'Server error',
        stackTrace: 'stack5',
      });
    });

    test('should handle CONFLICT and respond with correct payload', () => {
      // This test ensures that when statusCode is CONFLICT, the correct response is sent.
      const err = createMockError('Conflict', 'stack6');
      const req = {} as Request;
      const res = createMockRes(constants.CONFLICT);
      const next = jest.fn() as NextFunction;

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'Conflict',
        message: 'Conflict',
        stackTrace: 'stack6',
      });
    });

    test('should handle LOCKED_ACCOUNT and respond with correct payload', () => {
      // This test ensures that when statusCode is LOCKED_ACCOUNT, the correct response is sent.
      const err = createMockError('Locked', 'stack7');
      const req = {} as Request;
      const res = createMockRes(constants.LOCKED_ACCOUNT);
      const next = jest.fn() as NextFunction;

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'Locked account',
        message: 'Locked',
        stackTrace: 'stack7',
      });
    });


  });

  // Edge Cases
  describe('Edge cases', () => {
    test('should default to 500 and handle SERVER_ERROR when res.statusCode is undefined', () => {
      // This test ensures that if res.statusCode is undefined, it defaults to 500 and responds as SERVER_ERROR.
      const err = createMockError('Default server error', 'stack9');
      const req = {} as Request;
      const res = createMockRes(undefined);
      const next = jest.fn() as NextFunction;

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'Server Error',
        message: 'Default server error',
        stackTrace: 'stack9',
      });
    });

    test('should do nothing and not call res.json for an unrecognized status code', () => {
      // This test ensures that if statusCode is not handled in the switch, res.json is not called.
      const err = createMockError('Unknown error', 'stack10');
      const req = {} as Request;
      const res = createMockRes(999); // 999 is not a handled status code
      const next = jest.fn() as NextFunction;

      errorHandler(err, req, res, next);

      expect(res.json).not.toHaveBeenCalled();
    });

    test('should handle error with empty message and stack', () => {
      // This test ensures that if the error has empty message and stack, the response still includes them.
      const err = createMockError('', '');
      const req = {} as Request;
      const res = createMockRes(constants.SERVER_ERROR);
      const next = jest.fn() as NextFunction;

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'Server Error',
        message: '',
        stackTrace: '',
      });
    });

    test('should handle error with long message and stack', () => {
      // This test ensures that long error messages and stack traces are handled correctly.
      const longMessage = 'A'.repeat(1000);
      const longStack = 'B'.repeat(2000);
      const err = createMockError(longMessage, longStack);
      const req = {} as Request;
      const res = createMockRes(constants.CONFLICT);
      const next = jest.fn() as NextFunction;

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'Conflict',
        message: longMessage,
        stackTrace: longStack,
      });
    });
  });
});
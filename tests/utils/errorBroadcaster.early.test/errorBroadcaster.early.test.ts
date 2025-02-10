
// Unit tests for: errorBroadcaster


import { Response } from "express";
import { errorBroadcaster } from '../../../src/utils/errorBroadcaster';




describe('errorBroadcaster() errorBroadcaster method', () => {
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockResponse = {
            status: jest.fn(),
        };
    });

    describe('Happy Paths', () => {
        it('should set the response status code and throw an error with the provided message', () => {
            // Arrange
            const code = 400;
            const message = 'Bad Request';

            // Act & Assert
            expect(() => errorBroadcaster(mockResponse as Response, code, message)).toThrowError(message);
            expect(mockResponse.status).toHaveBeenCalledWith(code);
        });

        it('should set the response status code to 200 and throw an error with a generic message', () => {
            // Arrange
            const code = 200;
            const message = 'OK';

            // Act & Assert
            expect(() => errorBroadcaster(mockResponse as Response, code, message)).toThrowError(message);
            expect(mockResponse.status).toHaveBeenCalledWith(code);
        });
    });

    describe('Edge Cases', () => {
        it('should handle negative status codes by setting the response status and throwing an error', () => {
            // Arrange
            const code = -1;
            const message = 'Negative Status Code';

            // Act & Assert
            expect(() => errorBroadcaster(mockResponse as Response, code, message)).toThrowError(message);
            expect(mockResponse.status).toHaveBeenCalledWith(code);
        });

        it('should handle very large status codes by setting the response status and throwing an error', () => {
            // Arrange
            const code = 9999;
            const message = 'Large Status Code';

            // Act & Assert
            expect(() => errorBroadcaster(mockResponse as Response, code, message)).toThrowError(message);
            expect(mockResponse.status).toHaveBeenCalledWith(code);
        });

        it('should handle empty message by setting the response status and throwing an error with an empty message', () => {
            // Arrange
            const code = 500;
            const message = '';

            // Act & Assert
            expect(() => errorBroadcaster(mockResponse as Response, code, message)).toThrowError(message);
            expect(mockResponse.status).toHaveBeenCalledWith(code);
        });

        it('should handle null message by setting the response status and throwing an error with "null" as message', () => {
            // Arrange
            const code = 500;
            const message = null as unknown as string;

            // Act & Assert
            expect(() => errorBroadcaster(mockResponse as Response, code, message)).toThrowError('null');
            expect(mockResponse.status).toHaveBeenCalledWith(code);
        });

        it('should handle undefined message by setting the response status and throwing an error with "undefined" as message', () => {
            // Arrange
            const code = 500;
            const message = undefined as unknown as string;

            // Act & Assert
            expect(() => errorBroadcaster(mockResponse as Response, code, message)).toThrowError('undefined');
            expect(mockResponse.status).toHaveBeenCalledWith(code);
        });
    });
});

// End of unit tests for: errorBroadcaster

const mockingoose = require('mockingoose');
const UserModel = require("../../../src/models/userModel");
import * as userService from "../../../src/services/userService"


// books.test.js

const BooksModel = require('../models/books');
const {
  fetchBooks,
  fetchBook,
  createBook,
} = require('./books');

describe('Books service', () => {
  describe('fetchBooks', () => {
    it ('should return the list of books', async () => {
      mockingoose(BooksModel).toReturn([
        {
          title: 'Book 1',
          author: {
            firstname: 'John',
            lastname: 'Doe'
          },
          year: 2021,
        },
        {
          title: 'Book 2',
          author: {
            firstname: 'Jane',
            lastname: 'Doe'
          },
          year: 2022,
        }
      ], 'find');
      const results = await fetchBooks();
      expect(results[0].title).toBe('Book 1');
    });
  });
});


describe('fetchBook', () => {
    it ('should return a book', async () => {
      mockingoose(BooksModel).toReturn(
        {
          _id: 1,
          title: 'Book 1',
          author: {
            firstname: 'John',
            lastname: 'Doe'
          },
          year: 2021,
        }, 'findOne');
      const results = await fetchBook(1);
      expect(results.title).toBe('test');
    });
  });
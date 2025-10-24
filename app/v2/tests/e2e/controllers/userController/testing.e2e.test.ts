const request = require('supertest');
const app = require("../../../../index");
//const { connectDB, disconnectDB, dropCollections } = require('../db');
import { MongoDatabase } from "../../../../src/entities/MongoDatabase";
const mongoDatabase = new MongoDatabase();
describe('E2E CRUD operations', () => {
  beforeAll(async () => {
    await mongoDatabase.connectDB();
  });

  beforeEach(async () => {
    await mongoDatabase.dropCollections();
  });

  afterAll(async () => {
    await mongoDatabase.disconnectDB();
  });

  it('should create a new user', async () => {
    const newItem = { name: 'Test Item', description: 'This is a test.' };
    const res = await request(app).post('/items').send(newItem);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Item');
  });

  it('should get all items', async () => {
    await request(app).post('/items').send({ name: 'Item 1' });
    await request(app).post('/items').send({ name: 'Item 2' });
    const res = await request(app).get('/items');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
  });

  it('should get a single item by id', async () => {
    const createRes = await request(app).post('/items').send({ name: 'Find Me' });
    const itemId = createRes.body._id;

    const getRes = await request(app).get(`/items/${itemId}`);
    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body).toHaveProperty('name', 'Find Me');
  });

  it('should update an item', async () => {
    const createRes = await request(app).post('/items').send({ name: 'Old Name' });
    const itemId = createRes.body._id;

    const updateRes = await request(app).put(`/items/${itemId}`).send({ name: 'New Name' });
    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body).toHaveProperty('name', 'New Name');
  });

  it('should delete an item', async () => {
    const createRes = await request(app).post('/items').send({ name: 'Delete Me' });
    const itemId = createRes.body._id;

    const deleteRes = await request(app).delete(`/items/${itemId}`);
    expect(deleteRes.statusCode).toEqual(200);
  });
});

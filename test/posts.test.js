import request from "supertest";
import { initApp } from "../app.js";

let app;

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
  });
});

afterAll((done) => {
  done();
});

describe("GET / ", () => {
  test("It should respond with a 200 status code", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toEqual(200);
  });
});

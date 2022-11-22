const request = require('supertest');
const app = require("./app");

describe("GET /", () => {
    test("should respond with a 200", async () => {
        const response = await request(app).get("/").send();
        expect(response.statusCode).toBe(200);
    })
})


describe("GET /planets", () => {
    test("should respond with a 200", async () => {
        const response = await request(app).get("/planets").send();
        expect(response.statusCode).toBe(200);
    })
})

describe("GET /launches", () => {
    test("should respond with a 200", async () => {
        const response = await request(app).get("/launches").send();
        expect(response.statusCode).toBe(200);
    })
})

describe("POST /launches", () => {
    test("should respond with a 200", async () => {
        const response = await request(app).post("/launches").send({
            customer:["Zero to Mastery", "NASA"],
            flightNumber: 102,
            launchDate: "2022-11-09T00:00:00.000Z",
            mission: "Hello New Earth",
            rocket: "Explorer IS1",
            success: true,
            target: "Kepler-1652 b",
            upcoming: true,
        });
        expect(response.statusCode).toBe(201);
    })
})
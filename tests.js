const request = require("supertest");
const app = require("./app");

describe("Test the root path", () => {
    test("It should response the GET method", done => {
        request(app)
            .post("/api/login")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

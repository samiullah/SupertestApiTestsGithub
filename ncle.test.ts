import request from "supertest";
import * as configurations from "./config/configurations";
import * as userData from "./data/userData";
//import "dotenv/config";

describe("GitHub API Tests", () => {
  const baseURL = "https://api.github.com";
  const validToken = "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";
  const invalidToken = "abc";

  const headers = {
    Accept: "application/vnd.github+json",
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'QA Automation Test'
  };

  const getAuthenticatedUser = async (token) => {
    const authHeaders = { ...headers, Authorization: `Bearer ${token}` };
    return request(baseURL)
      .get("/user")
      .set(authHeaders);
  };

  it("No Token Provided", async () => {
    const response = await getAuthenticatedUser("");
    expect(response.status).toBe(401);
    expect(response.body.message).toContain("Bad credentials");
  });

  it("Invalid Token Provided", async () => {
    const response = await getAuthenticatedUser(invalidToken);
    expect(response.status).toBe(401);
    expect(response.body.message).toContain("Bad credentials");
  });

  it("Get User With Valid Token", async () => {
    const response = await getAuthenticatedUser(validToken);
    expect(response.status).toBe(200);
  });

  it("Forbidden Access (Token Without Necessary Permissions)", async () => {
    const authHeaders = { ...headers, Authorization: `Bearer ${validToken}` };
    const response = await request(baseURL)
      .patch("/user")
      .send({ "bio": "Your new bio content here." });

    expect(response.status).toBe(403);
  });

  it("Update User Bio With Valid Token", async () => {
    const authHeaders = { ...headers, Authorization: `Bearer ${validToken}` };
    const response = await request(baseURL)
      .patch("/user")
      .set(authHeaders)
      .send({ "bio": "Your new bio content here." });

    expect(response.status).toBe(200);
    expect(response.body.bio).toEqual("Your new bio content here.");
  });
});


import User from "../models/user.model";

describe("User Model", () => {
  it("should hash the password before saving", async () => {
    const user = new User({
      name: "Krish",
      email: "krish@test.com",
      password: "plainpass",
      role: "user",
    });
    await user.save();
    expect(user.password).not.toBe("plainpass");
  });
});
import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

const makeSut = () => {
  const salt = 12;
  const bcryptAdapterStub = new BcryptAdapter(salt);

  return { bcryptAdapterStub };
};

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return "hashed_password";
  },
}));

describe("Bcrypt Adapter", () => {
  it("should call bcrypt if correct value", async () => {
    const { bcryptAdapterStub } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await bcryptAdapterStub.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", 12);
  });
  it("should return a hash on sucess", async () => {
    const { bcryptAdapterStub } = makeSut();
    const hash = await bcryptAdapterStub.encrypt("any_value");
    expect(hash).toBe("hashed_password");
  });
});

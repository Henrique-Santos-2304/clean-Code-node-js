import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

const makeSut = () => {
  const salt = 12;
  const bcryptAdapterStub = new BcryptAdapter(salt);

  return { bcryptAdapterStub };
};

describe("Bcrypt Adapter", () => {
  it("should call bcrypt if correct value", async () => {
    const { bcryptAdapterStub } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await bcryptAdapterStub.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", 12);
  });
});

import bcrypt from "bcrypt";
import { IEncrypter } from "src/data/protocols";
import { BcryptAdapter } from "./bcrypt-adapter";

type SutType = {
  bcryptAdapterStub: IEncrypter;
  salt: number;
};
const makeSut = (): SutType => {
  const salt = 12;
  const bcryptAdapterStub = new BcryptAdapter(salt);

  return { bcryptAdapterStub, salt };
};

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return "hashed_password";
  },
}));

describe("Bcrypt Adapter", () => {
  it("should call bcrypt if correct value", async () => {
    const { bcryptAdapterStub, salt } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await bcryptAdapterStub.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });
  it("should return a hash on sucess", async () => {
    const { bcryptAdapterStub } = makeSut();
    const hash = await bcryptAdapterStub.encrypt("any_value");
    expect(hash).toBe("hashed_password");
  });
  it("should throw if bcrypt throws", async () => {
    const { bcryptAdapterStub } = makeSut();
    jest.spyOn(bcrypt, "hash").mockRejectedValueOnce(new Error() as never);
    const hash = bcryptAdapterStub.encrypt("any_value");
    await expect(hash).rejects.toThrow();
  });
});

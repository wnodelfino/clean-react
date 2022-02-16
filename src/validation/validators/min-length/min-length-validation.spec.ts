import { MinLenghtValidation } from "./min-length-validation";
import { InvalidFieldError } from "@/validation/errors";
import faker from "faker";

const makeSut = (field: string): MinLenghtValidation =>
  new MinLenghtValidation(field, 5);

describe("MinLengthValidation", () => {
  test("Should return error of value is invalid", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.datatype.string(3) });
    expect(error).toEqual(new InvalidFieldError());
  });

  test("Should return falsy if value is valid", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.datatype.string(5) });
    expect(error).toBeFalsy();
  });

  test.only("Should return falsy if field does not exists in schema", () => {
    const sut = makeSut(faker.database.column());
    const error = sut.validate({
      [faker.database.column()]: faker.datatype.string(5),
    });
    expect(error).toBeFalsy();
  });
});

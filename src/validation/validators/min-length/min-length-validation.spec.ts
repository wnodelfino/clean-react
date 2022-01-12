import { MinLenghtValidation } from "./min-length-validation";
import { InvalidFieldError } from "@/validation/errors";
import faker from "faker";

const makeSut = (): MinLenghtValidation =>
  new MinLenghtValidation(faker.database.column(), 5);

describe("MinLengthValidation", () => {
  test("Should return error of value is invalid", () => {
    const sut = makeSut();
    const error = sut.validate(faker.datatype.string(3));
    expect(error).toEqual(new InvalidFieldError());
  });

  test("Should return falsy of value is valid", () => {
    const sut = makeSut();
    const error = sut.validate(faker.datatype.string(5));
    expect(error).toBeFalsy();
  });
});

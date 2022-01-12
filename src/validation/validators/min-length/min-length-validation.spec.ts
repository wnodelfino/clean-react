import { MinLenghtValidation } from "./min-length-validation";
import { InvalidFieldError } from "@/validation/errors";

describe("MinLengthValidation", () => {
  test("Should return error of value is invalid", () => {
    const sut = new MinLenghtValidation("field", 5);
    const error = sut.validate("123");
    expect(error).toEqual(new InvalidFieldError());
  });

  test("Should return falsy of value is valid", () => {
    const sut = new MinLenghtValidation("field", 5);
    const error = sut.validate("12345");
    expect(error).toBeFalsy();
  });
});

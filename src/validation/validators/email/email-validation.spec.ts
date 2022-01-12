import { InvalidFieldError } from "@/validation/errors";
import { EmailValidation } from "./email-validation";
import faker from "faker";

const makeSut = (): EmailValidation =>
  new EmailValidation(faker.database.column());

describe("EmailValidation", () => {
  test("Should Return error if email is invalid", () => {
    const sut = makeSut();
    const error = sut.validate(faker.random.word());
    expect(error).toEqual(new InvalidFieldError());
  });

  test("Should Return falsy if email is vailid", () => {
    const sut = makeSut();
    const error = sut.validate(faker.internet.email());
    expect(error).toBeFalsy();
  });

  test("Should Return falsy if email is empty", () => {
    const sut = makeSut();
    const error = sut.validate("");
    expect(error).toBeFalsy();
  });
});

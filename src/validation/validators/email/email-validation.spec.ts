import { InvalidFieldError } from "@/validation/errors";
import { EmailValidation } from "./email-validation";
import faker from "faker";

const makeSut = (field: string): EmailValidation => new EmailValidation(field);

describe("EmailValidation", () => {
  test("Should Return error if email is invalid", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.random.word() });
    expect(error).toEqual(new InvalidFieldError());
  });

  test("Should Return falsy if email is vailid", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.internet.email() });
    expect(error).toBeFalsy();
  });

  test("Should Return falsy if email is empty", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: "" });
    expect(error).toBeFalsy();
  });
});

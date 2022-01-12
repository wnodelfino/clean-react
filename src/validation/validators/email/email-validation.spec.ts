import { InvalidFieldError } from "@/validation/errors";
import { EmailValidation } from "./email-validation";
import faker from "faker";

describe("EmailValidation", () => {
  test("Should Return error if email is invalid", () => {
    const sut = new EmailValidation(faker.random.word());
    const error = sut.validate(faker.random.word());
    expect(error).toEqual(new InvalidFieldError());
  });

  test("Should Return falsy if email is vailid", () => {
    const sut = new EmailValidation(faker.random.word());
    const error = sut.validate(faker.internet.email());
    expect(error).toBeFalsy();
  });
});

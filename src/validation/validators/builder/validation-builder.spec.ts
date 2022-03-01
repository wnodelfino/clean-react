import {
  RequiredFieldValidation,
  EmailValidation,
  MinLenghtValidation,
} from "@/validation/validators";
import { ValidationBuilder as sut } from "./validation-builder";
import faker from "faker";
import { CompareFieldsValidation } from "../compare-fields/compare-fields-validation";

const field = faker.database.column();
const length = faker.datatype.number();

describe("ValidationBuilder", () => {
  test("Should return RequiredFieldValidation", () => {
    const validations = sut.field(field).required().build();
    expect(validations).toEqual([new RequiredFieldValidation(field)]);
  });

  test("Should return EmailValidation", () => {
    const validations = sut.field(field).email().build();
    expect(validations).toEqual([new EmailValidation(field)]);
  });

  test("Should return MinLenghtValidation", () => {
    const validations = sut.field(field).min(length).build();
    expect(validations).toEqual([new MinLenghtValidation(field, length)]);
  });

  test("Should return CompareFieldsValidation", () => {
    const fieldToCompare = faker.database.column();
    const validations = sut.field(field).sameAs(fieldToCompare).build();
    expect(validations).toEqual([
      new CompareFieldsValidation(field, fieldToCompare),
    ]);
  });

  test("Should return a list of validation", () => {
    const validations = sut.field(field).required().min(length).email().build();
    expect(validations).toEqual([
      new RequiredFieldValidation(field),
      new MinLenghtValidation(field, length),
      new EmailValidation(field),
    ]);
  });
});

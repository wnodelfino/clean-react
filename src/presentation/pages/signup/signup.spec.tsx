import React from "react";
import SignUp from "./signup";
import faker from "faker";
import {
  RenderResult,
  render,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import { Helper, ValidationStub } from "@/presentation/test";

type SutTypes = {
  sut: RenderResult;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const sut = render(<SignUp validation={validationStub} />);
  return {
    sut,
  };
};

const pupulateField = (
  sut: RenderResult,
  fildName: string,
  value = faker.random.word()
): void => {
  const input = sut.getByTestId(fildName);
  fireEvent.input(input, { target: { value } });
};

describe("Signup Component", () => {
  afterEach(cleanup);

  test("Should start with initial state", () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    Helper.testChildCount(sut, "error-wrap", 0);
    Helper.testButtonIsDisabled(sut, "submit", true);
    Helper.testStatusForField(sut, "name", validationError);
    Helper.testStatusForField(sut, "email", "Campo obrigatório");
    Helper.testStatusForField(sut, "password", "Campo obrigatório");
    Helper.testStatusForField(sut, "passwordConfirmation", "Campo obrigatório");
  });

  test("Should show name error if Validation fails", () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    pupulateField(sut, "name");
    Helper.testStatusForField(sut, "name", validationError);
  });
});
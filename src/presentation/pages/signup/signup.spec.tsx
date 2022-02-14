import React from "react";
import SignUp from "./signup";
import { RenderResult, render } from "@testing-library/react";

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<SignUp />);
  return {
    sut,
  };
};

const testChildCount = (
  sut: RenderResult,
  fildName: string,
  count: number
): void => {
  const el = sut.getByTestId(fildName);
  expect(el.childElementCount).toBe(count);
};

const testButtonIsDisabled = (
  sut: RenderResult,
  fildName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fildName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

const testStatusForField = (
  sut: RenderResult,
  fildName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fildName}-status`);
  expect(fieldStatus.title).toBe(validationError || "Tudo certo!");
  expect(fieldStatus.textContent).toBe(validationError ? "🔴" : "🟢");
};

describe("Signup Component", () => {
  test("Should start with initial state", () => {
    const validationError = "Campo obrigatório";
    const { sut } = makeSut();
    testChildCount(sut, "error-wrap", 0);
    testButtonIsDisabled(sut, "submit", true);
    testStatusForField(sut, "name", validationError);
    testStatusForField(sut, "email", validationError);
    testStatusForField(sut, "password", validationError);
    testStatusForField(sut, "passwordConfirmation", validationError);
  });
});

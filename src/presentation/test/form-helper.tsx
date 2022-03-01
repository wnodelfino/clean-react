import faker from "faker";
import { fireEvent, RenderResult } from "@testing-library/react";

export const testChildCount = (
  sut: RenderResult,
  fildName: string,
  count: number
): void => {
  const el = sut.getByTestId(fildName);
  expect(el.childElementCount).toBe(count);
};

export const testButtonIsDisabled = (
  sut: RenderResult,
  fildName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fildName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

export const testStatusForField = (
  sut: RenderResult,
  fildName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fildName}-status`);
  expect(fieldStatus.title).toBe(validationError || "Tudo certo!");
  expect(fieldStatus.textContent).toBe(validationError ? "🔴" : "🟢");
};

export const populateField = (
  sut: RenderResult,
  fildName: string,
  value = faker.random.word()
): void => {
  const input = sut.getByTestId(fildName);
  fireEvent.input(input, { target: { value } });
};

export const testElementExists = (
  sut: RenderResult,
  fildName: string
): void => {
  const el = sut.getByTestId(fildName);
  expect(el).toBeTruthy();
};

export const testElementText = (
  sut: RenderResult,
  fildName: string,
  text: string
): void => {
  const el = sut.getByTestId(fildName);
  expect(el.textContent).toBe(text);
};

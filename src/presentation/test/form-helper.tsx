import { RenderResult } from "@testing-library/react";

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

import React from "react";
import faker from "faker";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import { Input } from "..";
import Context from "@/presentation/contexts/form/form-context";

const makeSut = (fieldName: string): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name={fieldName} />
    </Context.Provider>
  );
};

describe("Input Component", () => {
  test("Should begin with reandOnly", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const input = sut.getByTestId(field) as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  test("Should remove reandOnly on focus", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const input = sut.getByTestId(field) as HTMLInputElement;
    fireEvent.focus(input);
    expect(input.readOnly).toBe(false);
  });
});

import React from "react";
import faker from "faker";
import "jest-localstorage-mock";
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import Login from "./login";
import { ValidationStub, AuthenticationSpy } from "@/presentation/test";
import { InvalidCredentialsError } from "@/domain/errors";

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  validationStub.errorMessage = params?.validationError;
  const sut = render(
    <Login validation={validationStub} authentication={authenticationSpy} />
  );
  return {
    sut,
    authenticationSpy,
  };
};

const simulateValidSubmit = (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  pupulateEmailField(sut, email);
  pupulatePasswordField(sut, password);
  const submitButton = sut.getByTestId("submit");
  fireEvent.click(submitButton);
};

const pupulateEmailField = (
  sut: RenderResult,
  email = faker.internet.email()
): void => {
  const emailInput = sut.getByTestId("email");
  fireEvent.input(emailInput, { target: { value: email } });
};

const pupulatePasswordField = (
  sut: RenderResult,
  password = faker.internet.password()
): void => {
  const passwordInput = sut.getByTestId("password");
  fireEvent.input(passwordInput, { target: { value: password } });
};

const simulateStatusForField = (
  sut: RenderResult,
  fildName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fildName}-status`);
  expect(fieldStatus.title).toBe(validationError || "Tudo certo!");
  expect(fieldStatus.textContent).toBe(validationError ? "🔴" : "🟢");
};

describe("Login Component", () => {
  afterEach(cleanup);

  beforeEach(() => {
    localStorage.clear();
  });

  test("Should start with initial state", () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    const errorWrap = sut.getByTestId("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = sut.getByTestId("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    simulateStatusForField(sut, "email", validationError);
    simulateStatusForField(sut, "password", validationError);
  });

  test("Should show email error if Validation fails", () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    pupulateEmailField(sut);
    simulateStatusForField(sut, "email", validationError);
  });

  test("Should show password error if Validation fails", () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    pupulatePasswordField(sut);
    simulateStatusForField(sut, "password", validationError);
  });

  test("Should show valid email state if Validation succeeds", () => {
    const { sut } = makeSut();
    pupulateEmailField(sut);
    simulateStatusForField(sut, "email");
  });

  test("Should show valid password state if Validation succeeds", () => {
    const { sut } = makeSut();
    pupulatePasswordField(sut);
    simulateStatusForField(sut, "password");
  });

  test("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();
    pupulateEmailField(sut);
    pupulatePasswordField(sut);
    const submitButton = sut.getByTestId("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  test("Should show spinner on submit", () => {
    const { sut } = makeSut();
    simulateValidSubmit(sut);
    const spinner = sut.getByTestId("spinner");
    expect(spinner).toBeTruthy();
  });

  test("Should call Authetication with correct values", () => {
    const { sut, authenticationSpy } = makeSut();
    const email = faker.internet.email();
    const password = faker.internet.password();
    simulateValidSubmit(sut, email, password);
    expect(authenticationSpy.params).toEqual({ email, password });
  });

  test("Should call Authetication only once", () => {
    const { sut, authenticationSpy } = makeSut();
    simulateValidSubmit(sut);
    simulateValidSubmit(sut);
    expect(authenticationSpy.callsCount).toBe(1);
  });

  test("Should not call Authetication if form is valid", () => {
    const validationError = faker.random.words();
    const { sut, authenticationSpy } = makeSut({ validationError });
    pupulateEmailField(sut);
    fireEvent.submit(sut.getByTestId("form"));
    expect(authenticationSpy.callsCount).toBe(0);
  });

  test("Should present error if Authetication fails", async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest
      .spyOn(authenticationSpy, "auth")
      .mockReturnValueOnce(Promise.reject(error));
    simulateValidSubmit(sut);
    const errorWrap = sut.getByTestId("error-wrap");
    await waitFor(() => errorWrap);
    const mainError = sut.getByTestId("main-error");
    expect(mainError.textContent).toBe(error.message);
    expect(errorWrap.childElementCount).toBe(1);
  });

  test("Should add accessToken to localstorage on success", async () => {
    const { sut, authenticationSpy } = makeSut();
    simulateValidSubmit(sut);
    await waitFor(() => sut.getByTestId("form"));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      authenticationSpy.account.accessToken
    );
  });
});

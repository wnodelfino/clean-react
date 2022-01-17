import React from "react";
import faker from "faker";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import "jest-localstorage-mock";
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { Login } from "@/presentation/pages";
import { ValidationStub, AuthenticationSpy } from "@/presentation/test";
import { InvalidCredentialsError } from "@/domain/errors";

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ["/login"] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  validationStub.errorMessage = params?.validationError;
  const sut = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  );
  return {
    sut,
    authenticationSpy,
  };
};

const simulateValidSubmit = async (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  pupulateEmailField(sut, email);
  pupulatePasswordField(sut, password);
  const form = sut.getByTestId("form");
  fireEvent.submit(form);
  await waitFor(() => form);
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

const testStatusForField = (
  sut: RenderResult,
  fildName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fildName}-status`);
  expect(fieldStatus.title).toBe(validationError || "Tudo certo!");
  expect(fieldStatus.textContent).toBe(validationError ? "🔴" : "🟢");
};

const testErrorWrapCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId("error-wrap");
  expect(errorWrap.childElementCount).toBe(count);
};

const testElementExits = (sut: RenderResult, fildName: string): void => {
  const el = sut.getByTestId(fildName);
  expect(el).toBeTruthy();
};

const testElementText = (
  sut: RenderResult,
  fildName: string,
  text: string
): void => {
  const el = sut.getByTestId(fildName);
  expect(el.textContent).toBe(text);
};

const testButtonIsDisabled = (
  sut: RenderResult,
  fildName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fildName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

describe("Login Component", () => {
  afterEach(cleanup);

  beforeEach(() => {
    localStorage.clear();
  });

  test("Should start with initial state", () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    testErrorWrapCount(sut, 0);
    testButtonIsDisabled(sut, "submit", true);
    testStatusForField(sut, "email", validationError);
    testStatusForField(sut, "password", validationError);
  });

  test("Should show email error if Validation fails", () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    pupulateEmailField(sut);
    testStatusForField(sut, "email", validationError);
  });

  test("Should show password error if Validation fails", () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    pupulatePasswordField(sut);
    testStatusForField(sut, "password", validationError);
  });

  test("Should show valid email state if Validation succeeds", () => {
    const { sut } = makeSut();
    pupulateEmailField(sut);
    testStatusForField(sut, "email");
  });

  test("Should show valid password state if Validation succeeds", () => {
    const { sut } = makeSut();
    pupulatePasswordField(sut);
    testStatusForField(sut, "password");
  });

  test("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();
    pupulateEmailField(sut);
    pupulatePasswordField(sut);
    testButtonIsDisabled(sut, "submit", false);
  });

  test("Should show spinner on submit", async () => {
    const { sut } = makeSut();
    await simulateValidSubmit(sut);
    testElementExits(sut, "spinner");
  });

  test("Should call Authetication with correct values", async () => {
    const { sut, authenticationSpy } = makeSut();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await simulateValidSubmit(sut, email, password);
    expect(authenticationSpy.params).toEqual({ email, password });
  });

  test("Should call Authetication only once", async () => {
    const { sut, authenticationSpy } = makeSut();
    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);
    expect(authenticationSpy.callsCount).toBe(1);
  });

  test("Should not call Authetication if form is valid", async () => {
    const validationError = faker.random.words();
    const { sut, authenticationSpy } = makeSut({ validationError });
    await simulateValidSubmit(sut);
    expect(authenticationSpy.callsCount).toBe(0);
  });

  test("Should present error if Authetication fails", async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest
      .spyOn(authenticationSpy, "auth")
      .mockReturnValueOnce(Promise.reject(error));
    await simulateValidSubmit(sut);
    testElementText(sut, "main-error", error.message);
    testErrorWrapCount(sut, 1);
  });

  test("Should add accessToken to localstorage on success", async () => {
    const { sut, authenticationSpy } = makeSut();
    await simulateValidSubmit(sut);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      authenticationSpy.account.accessToken
    );
    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe("/");
  });

  test("Should go to signup page", async () => {
    const { sut } = makeSut();
    const register = sut.getByTestId("signup");
    fireEvent.click(register);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe("/signup");
  });
});

import React from "react";
import { render } from "@testing-library/react";
import Login from "./login";

describe("Login Component", () => {
<<<<<<< HEAD
  test("Should not render spinner and error on start", () => {
    const { getByTestId } = render(<Login />);
    const errorWrap = getByTestId("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
=======
  test("", () => {
    render(<Login />);
>>>>>>> 48c6199cee71f09cd423aad58789c4b021a46059
  });
});

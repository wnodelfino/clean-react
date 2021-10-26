import { RemoteAuthetication } from "./remote-authentication";
import { HttpPostClientSpy } from "@/data/test/mock-http-client";
import { mockAuthetincation } from "@/domain/test/mock-authentication";
import { InvalidCredentialsError } from "@/domain/errors/invalid-credentials-error";
import { HttpStatusCode } from "@/data/protocols/http/http-response";
import faker from "faker";

type SutTypes = {
  sut: RemoteAuthetication;
  httpPostClientSpy: HttpPostClientSpy;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy();
  const sut = new RemoteAuthetication(url, httpPostClientSpy);
  return {
    sut,
    httpPostClientSpy,
  };
};

describe("RemoteAuthentication", () => {
  test("Should call HttpPostClient with correct URL", async () => {
    const url = faker.internet.url();
    const { sut, httpPostClientSpy } = makeSut(url);
    await sut.auth(mockAuthetincation());
    expect(httpPostClientSpy.url).toBe(url);
  });

  test("Should call HttpPostClient with correct body", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    const authenticationParams = mockAuthetincation();
    await sut.auth(authenticationParams);
    expect(httpPostClientSpy.body).toEqual(authenticationParams);
  });

  test("Should throw IvalidCredentialsError if HttpPostClient returns 401", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unathorized,
    };
    const promise = sut.auth(mockAuthetincation());
    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });
});

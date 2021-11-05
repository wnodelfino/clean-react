import { AuthenticationParams } from "@/domain/usecases";
import { AccountModel } from "../models";
import faker from "faker";

export const mockAuthetincation = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.datatype.string(),
});

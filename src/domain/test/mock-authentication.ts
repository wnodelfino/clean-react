import { AuthenticationParams } from "domain/usecases/authentication";
import faker from "faker";

export const mockAuthetincation = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

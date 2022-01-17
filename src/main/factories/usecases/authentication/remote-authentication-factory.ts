import { makeAxiosHttpClient, makeApiUrl } from "@/main/factories/http";
import { RemoteAuthentication } from "@/data/usecases/authetication/remote-authentication";
import { Authentication } from "@/domain/usecases";

export const makeRemoteAuthentication = (): Authentication => {
  return new RemoteAuthentication(makeApiUrl("/login"), makeAxiosHttpClient());
};

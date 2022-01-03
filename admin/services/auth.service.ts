import { createTRPCClient } from "@trpc/client";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { AppRouter } from "trpc/server";

export interface Token {
  aud: string;
  email: string;
  exp: number;
  iat: number;
  uid: string;
}

const url = "/api/trpc";

const client = createTRPCClient<AppRouter>({
  url: url,
});

class Auth {
  constructor() {
    if (process.browser) {
      this.refresh();
    }
  }

  private accessTokenSub = new BehaviorSubject<string | undefined | null>(
    undefined
  );

  currentUser$ = this.accessTokenSub.pipe(
    map((token) => getUserFromToken(token))
  );

  get currentUser() {
    return getUserFromToken(this.accessTokenSub.value);
  }

  private get refreshToken() {
    return localStorage?.getItem("refreshToken");
  }

  private set refreshToken(token: string | null) {
    if (token === null || token === undefined) {
      localStorage.removeItem("refreshToken");
      return;
    }
    localStorage.setItem("refreshToken", token);
  }

  signOut() {
    this.refreshToken = null;
    this.accessTokenSub.next(null);
  }

  async login(email: string, password: string) {
    const res = await client.mutation("auth.login", {
      email,
      password,
    });
    this.accessTokenSub.next(res.accessToken);
    this.refreshToken = res.refreshToken;
  }

  async refresh() {
    const refreshToken = this.refreshToken;
    if (!refreshToken) {
      return;
    }
    let user: Token;
    try {
      const headerStr = Buffer.from(
        refreshToken.split(".")[1],
        "base64"
      ).toString();
      user = JSON.parse(headerStr) as Token;
    } catch {
      this.accessTokenSub.next(null);
      this.refreshToken = null;
      return;
    }
    const now = new Date().getTime() / 1000;
    if (user.exp < now || user.iat > now) {
      this.accessTokenSub.next(null);
      this.refreshToken = null;
      return;
    }

    if (user.exp > now + 60 && !!this.accessTokenSub.value) {
      setTimeout(this.refresh, (user.exp - now - 60) * 1000);
      return;
    }

    const data = await client.mutation("auth.refresh", { refreshToken });
    if (data) {
      this.accessTokenSub.next(data.accessToken);
      setTimeout(this.refresh, (user.exp - now - 60) * 1000);
      return;
    }
    this.accessTokenSub.next(null);
    this.refreshToken = null;
  }
}

export const authCli = new Auth();

const getUserFromToken = (token: string | null | undefined) => {
  if (token === null) {
    return { token: null, user: null };
  }
  if (token === undefined) {
    return { token: undefined, user: undefined };
  }
  const headerStr = Buffer.from(token.split(".")[1], "base64").toString();
  const user = JSON.parse(headerStr) as Token;
  const now = new Date().getTime() / 1000;
  if (user.iat < now && user.exp > now) {
    return { user, token };
  }
  return { token: null, user: null };
};

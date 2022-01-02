import { apolloClient } from '../../utils/apollo';
import { LoginDocument, RefreshDocument } from '../../utils/graphql';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Token {
  aud: string;
  email: string;
  exp: number;
  iat: number;
  uid: string;
}

class Auth {
  constructor() {}

  private accessTokenSub = new BehaviorSubject<string | undefined | null>(undefined);

  currentUser$ = this.accessTokenSub.pipe(map((token) => getUserFromToken(token)));

  get currentUser() {
    return getUserFromToken(this.accessTokenSub.value);
  }

  private get refreshToken() {
    return localStorage.getItem('refreshToken');
  }

  private set refreshToken(token: string | null) {
    if (token === null || token === undefined) {
      localStorage.removeItem('refreshToken');
      return;
    }
    localStorage.setItem('refreshToken', token);
  }

  signOut() {
    console.log('sing out');
    this.refreshToken = null;
    this.accessTokenSub.next(null);
  }

  async login(email: string, password: string) {
    const { data } = await apolloClient.mutate({
      mutation: LoginDocument,
      variables: { email, password },
    });
    if (data) {
      this.accessTokenSub.next(data.login.accessToken);
      this.refreshToken = data.login.refreshToken;
    }
  }

  async refresh() {
    const refreshToken = this.refreshToken;
    if (!refreshToken) {
      return;
    }
    let user: Token;
    try {
      const headerStr = Buffer.from(refreshToken.split('.')[1], 'base64').toString();
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

    const { data } = await apolloClient.mutate({
      mutation: RefreshDocument,
      variables: { refreshToken },
    });
    if (data) {
      this.accessTokenSub.next(data.refresh);
      setTimeout(this.refresh, (user.exp - now - 60) * 1000);
    }
  }
}

export const auth = new Auth();

const getUserFromToken = (token: string | null | undefined) => {
  if (token === null) {
    return { token: null, user: null };
  }
  if (token === undefined) {
    return { token: undefined, user: undefined };
  }
  const headerStr = Buffer.from(token.split('.')[1], 'base64').toString();
  const user = JSON.parse(headerStr) as Token;
  const now = new Date().getTime() / 1000;
  if (user.iat < now && user.exp > now) {
    return { user, token };
  }
  return { token: null, user: null };
};

import { WebStorageStateStore, UserManagerSettings } from 'oidc-client';
import { environment } from '../../environments/environment';

export const AuthSettings: UserManagerSettings = {
    authority: environment.authority,
    client_id: 'chess',
    redirect_uri: environment.siteUrl + 'account/login',
    post_logout_redirect_uri: environment.siteUrl,
    popup_post_logout_redirect_uri: environment.siteUrl + 'account/logout/',
    response_type: 'id_token token',
    scope: 'openid roles profile chess',
    silent_redirect_uri: environment.siteUrl + 'account/silent-renew',
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    filterProtocolClaims: true,
    loadUserInfo: true
  };

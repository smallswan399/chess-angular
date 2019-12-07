import * as _ from 'lodash';
import { User } from 'oidc-client';
export class Identity {
    userName: string;
    id: number;
    isAuthenticated = false;
    claims: any[] = [];
    constructor(user?: User) {
        if (!user) {
            return;
        }
        const decodedToken = user;
        const roles = user.profile.role;
        const userId = user.profile.sub;
        const userName = user.profile.preferred_username;
        const name = user.profile.name;
        const picture = user.profile.picture;
        const mobile = user.profile.mobile;

        this.id = +userId;
        this.userName = userName;
        this.isAuthenticated = true;
        this.claims = [
            { type: 'access_token', value: user.access_token },
            { type: 'expires', value: user.expired },
            { type: 'expires_in', value: user.expires_in },
            { type: 'expires_at', value: user.expires_at },
            { type: 'name', value: name },
            { type: 'picture', value: picture },
            { type: 'mobile', value: mobile },
        ];
        _.forEach(roles, role => {
            this.claims.push({
                type: 'role',
                value: role
            });
        });
    }

    getMobile(): string {
        const claims = this.getClaims('mobile');
        const claim = _.first(claims);
        if (claim) {
            return claim.value;
        }
        return '';
    }
    getName(): string {
        const claims = this.getClaims('name');
        const claim = _.first(claims);
        if (claim) {
            return claim.value;
        }
        return '';
    }

    getPicture(): string {
        const claims = this.getClaims('picture');
        const claim = _.first(claims);
        if (claim) {
            return claim.value;
        }
        return '';
    }

    getAccessToken() {
        const claims = this.getClaims('access_token');
        const claim = _.first(claims);
        if (claim) {
            return claim.value;
        }
        return '';
    }

    getRefreshToken() {
        const claims = this.getClaims('refreshToken');
        const claim = _.first(claims);
        if (claim) {
            return claim.value;
        } else {
            return '';
        }
    }

    getClaims(claimType: string): any[] {
        const claims = _.filter(this.claims, c => {
            return c.type === claimType;
        });
        return claims;
    }

    getTokenExpires() {
        const claims = this.getClaims('expires');
        const claim = _.first(claims);
        if (claim) {
            return claim.value;
        } else {
            return '';
        }
    }

    getTokenExpiresIn() {
        const claims = this.getClaims('expires_in');
        const claim = _.first(claims);
        if (claim) {
            return claim.value;
        } else {
            return '';
        }
    }

    getRoles() {
        return this.getClaims('role').map(s => s.value);
    }
}

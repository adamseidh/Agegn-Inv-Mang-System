import { jwtDecode } from 'jwt-decode';

export const TokenExpired = (token) => {
    const decodedToken = jwtDecode(token); // decode token to gt time

    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) { //compare token to check expiration
        return true;
    }
    else {
        return false
    }


}
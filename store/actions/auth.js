import { AsyncStorage } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';

export const authenticate = (userId, token) => {
    return {
        type: AUTHENTICATE,
        userId: userId,
        token: token
    }
};

export const signup = (email, password) => {
    return async dispatch => {

        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDs-YjrEUbrtpLiYlw9cHcxQfewDJMWTpM',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();

            const errorId = errorResData.error.message;

            let message = 'Something went wrong';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already!';
            } /*else if (errorId === 'OPERATION_NOT_ALLOWED') {
            } else if (errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
            }*/

            throw new Error(message);
        }

        const resData = await response.json();

        dispatch(authenticate(resData.localId, resData.idToken));

        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

export const login = (email, password) => {
    return async dispatch => {

        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDs-YjrEUbrtpLiYlw9cHcxQfewDJMWTpM',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();

            const errorId = errorResData.error.message;

            let message = 'Something went wrong';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid!';
            } /*else if (errorId === 'USER_DISABLED') {

            }*/

            throw new Error(message);
        }

        const resData = await response.json();

        console.log(resData);

        dispatch(authenticate(resData.localId, resData.idToken));

        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
        'userData', JSON.stringify({
            token: token,
            userId: userId,
            expiryDate: expirationDate.toISOString()
        })
    );
} 

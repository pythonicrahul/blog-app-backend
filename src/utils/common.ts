import jwt from 'jsonwebtoken';
import { ITokenCreationRequest } from '../interfaces/common';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const validatePassword = (password: string) => {
	/*eslint-disable*/
	return password.match(
		/(?=[A-Za-z0-9@#$%^&+!=.]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,}).*$/,
	);
	/*eslint-disable*/
};

export const validateEmail = (email: string) => {
	/*eslint-disable*/
	return email.match(
	  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/,
	);
	/*eslint-disable*/
};

export const validateEmailLength = (email: string) => {
	var id_list = email.split("@");
	if (id_list[0].length > 64) {
		return "Please enter the correct email length, the local address email should be 64 characters."
	}
	if (id_list[1].length > 255) {
		return "Please enter the valid length of domain address for email, Domain address cannot be more than 255 characters."
	}
	return true
}

export const generate_token = (payload: ITokenCreationRequest, exp: number) => {
    let token;
    token = jwt.sign(
        {
            ...payload,
            exp,
            iat: Math.floor(Date.now() / 1000),
        }, 
        JWT_SECRET,
    ); 
    return token
}

export const generate_epoch_time = (increment = 0): number => {
	const now = new Date();
	return (Math.round(now.getTime() / 1000)) + increment;
};

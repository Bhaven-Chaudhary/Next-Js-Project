// File is used to customize or redefine the default types in next-auth

import "next-auth";

//customizing 'user' module present in next-auth to our custom 'user' module to solve warning in option.ts callback methods
declare module 'next-auth' {
 interface User{
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean,
    username?: boolean
 }
}
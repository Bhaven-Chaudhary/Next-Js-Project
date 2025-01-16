import { Resend } from 'resend';
//Create resend object to use email service
export const resend = new Resend(process.env.RESEND_API_KEY);
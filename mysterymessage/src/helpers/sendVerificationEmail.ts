//Helper file to send verification email

import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponseTypes";

//Function to send email
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Verification Code mystery message",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) {
      // return Response.json({ error }, { status: 500 });
      return {
        success: false,
        message: "Unable to send email to given email id",
      };
    }
    return { success: true, message: "Verification email send successfully" };
  } catch (emailError) {
    console.log("Error sending verification email", emailError);
    return { success: false, message: "Error sending verification email" };
  }
}

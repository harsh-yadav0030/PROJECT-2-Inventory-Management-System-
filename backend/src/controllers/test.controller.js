import sendEmail from "../utils/sendEmail.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const sendTestEmail = asyncHandler(async (req, res) => {
  await sendEmail({
    to: "devilgaming78600@gmail.com",
    subject: "Test Email",
    text: "Congratulations! Your Nodemailer configuration is working successfully.",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Test email sent successfully."));
});

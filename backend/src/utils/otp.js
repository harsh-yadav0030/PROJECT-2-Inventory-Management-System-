import crypto from "crypto";
const generateOTP = ()=>{
  const otp = crypto.randomInt(
    100000,
    1000000
).toString();

  const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
   return {
        otp,
        hashedOTP,
    };

}

export {generateOTP};
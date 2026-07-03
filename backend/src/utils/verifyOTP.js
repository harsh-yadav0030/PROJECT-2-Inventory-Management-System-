import crypto from "crypto";

const verifyOTP = (enteredOTP, storedHashedOTP) => {
  const hashedOTP = crypto
        .createHash("sha256")
        .update(enteredOTP)
        .digest("hex");
  
        return hashedOTP==storedHashedOTP;
};

export {verifyOTP};
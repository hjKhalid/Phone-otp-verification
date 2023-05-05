import React, { useState, useEffect, useRef } from "react";
import './phoneVerificationPopup.css';

export default function PhoneVerificationPopup() {
    const [showPopup, setShowPopup] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpInputsRef = useRef([]);

    useEffect(() => {
        if (showPopup) {
            // Focus the first OTP input when the popup is shown
            otpInputsRef.current[0].focus();
        }
    }, [showPopup]);

    function handleButtonClick() {
        setShowPopup(true);
    }

    function handleInput(event, index) {
        const value = event.target.value;
        if (isNaN(value) || value.length > 1) {
            return;
        }

        // Update the OTP array with the new value
        setOtp((prevOtp) => {
            const newOtp = [...prevOtp];
            newOtp[index] = value;
            return newOtp;
        });

        // Move focus to the next input when a digit is entered
        if (value) {
            if (index < otpInputsRef.current.length - 1) {
                otpInputsRef.current[index + 1].focus();
            }
        }

        // Delete input and move focus to previous input on backspace
        if (event.nativeEvent.inputType === "deleteContentBackward" && !value) {
            if (index > 0) {
                otpInputsRef.current[index - 1].focus();
            }
        }
    }

    function handlePaste(event) {
        const pasteData = event.clipboardData.getData("text");
        if (/^\d{6}$/.test(pasteData)) {
            setOtp(pasteData.split(""));
        }
    }

    return (
        <>
            <h1 style={{textAlign:"center"}}>Phone Verification</h1>

            {showPopup && (
                <div className="popup">
                    <h2>Enter OTP you received on 89206-xxxxx</h2>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(input) => {
                                otpInputsRef.current[index] = input;
                            }}
                            type="text"
                            value={digit}
                            maxLength="1"
                            onChange={(event) => handleInput(event, index)}
                            onPaste={handlePaste}
                        />
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.5rem",color:'green'}}>
                        <div>Change Number</div>
                        <div> Re-send OTP</div>
                    </div>
                </div>
            )}
            <button className="btn" onClick={handleButtonClick}>Verify Phone</button>
        </>
    );
}
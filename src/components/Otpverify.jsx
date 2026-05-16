import { useRef, useState } from "react";
import './Otpverify.css';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Otpverify() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const inputRef = useRef([])
    function changeHandler(val, index) {

        if (!/^\d?$/.test(val)) return;
        const updated = [...otp]
        updated[index] = val;
        setOtp(updated);
        if (val.length && index < 5) {
            inputRef.current[index + 1]?.focus()
        }
    }

    function handleKeyDown(e, index) {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRef.current[index - 1]?.focus();
        }
    }

    async function handleVerify() {
        const finalOtp = otp.join("");
        // api call
        try {
            const verification = await fetch("http://localhost:4000/user/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ otp: finalOtp }),
                credentials: "include"
            })
            console.log(verification);

            if (verification.status === 200) {
                toast.success("successfully Registered!")
                navigate("/register");
            }
            else {
                toast.error("Failed to register!")
            }

        } catch (error) {
            console.log("Error: ", error.message);
            toast.error(error.message);
        }

    }


    return (
        <section className="otp-section">
            <div className="otp-div">
                {
                    otp.map((digit, index) => (
                        <input className="input-ele" ref={(ele) => inputRef.current[index] = ele} key={index} type="text" inputMode="numeric" value={digit} onChange={(e) => changeHandler(e.target.value, index)} onKeyDown={(e) => handleKeyDown(e, index)} />
                    ))
                }
                <button className="verify-btn" onClick={handleVerify}>Verify</button>
            </div>

        </section>
    )
}

export default Otpverify
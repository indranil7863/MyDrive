import { useEffect, useRef, useState } from "react";
import './Otpverify.css';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Otpverify() {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isloading, setIsLoading] = useState(false);
    const [iserror, setIsError] = useState(false);
    const [timer, setTimer] = useState(60);

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

    useEffect(() => {
        let intervalid;
        if (timer > 0) {
            intervalid = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(intervalid);
    }, [timer])

    function handleKeyDown(e, index) {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRef.current[index - 1]?.focus();
        }
    }

    async function handleVerify() {
        const finalOtp = otp.join("");
        if (finalOtp.length !== 6) {
            setIsError(true);
            return;
        }
        // api call
        try {
            setIsLoading(true);
            const verification = await fetch(`${backend_url}/user/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ otp: finalOtp }),
                credentials: "include"
            })


            if (verification.status === 200) {
                toast.success("successfully Registered!")
                navigate("/register");
            }
            else {
                toast.error("Invalid OTP !")
                setOtp(["", "", "", "", "", ""]);
            }

        } catch (error) {
            console.log("Error: ", error.message);
            toast.error("Network Error!");
        }
        finally {
            setIsLoading(false);
            setIsError(false);
            setOtp(["", "", "", "", "", ""]);
        }

    }


    return (
        <section className="otp-section">

            <div className="otp-div">
                <div>
                    {
                        otp.map((digit, index) => (
                            <input className="input-ele" ref={(ele) => inputRef.current[index] = ele} key={index} type="text" inputMode="numeric" value={digit} onChange={(e) => changeHandler(e.target.value, index)} onKeyDown={(e) => handleKeyDown(e, index)} />
                        ))
                    }
                    <button className="verify-btn" onClick={handleVerify}>{isloading ? <div className=" h-[25px] w-[25px] border-2 border-l-0 rounded-full animate-spin"></div> : "Verify"}</button>

                </div>
                <div>
                    {
                        iserror && <div className="text-red-500 text-start">please fill in all blanks!</div>
                    }
                </div>
                {
                    timer ? `${timer} sec` : (<button className="resend-btn">Resend OTP</button>)
                }



            </div>




        </section>
    )
}

export default Otpverify
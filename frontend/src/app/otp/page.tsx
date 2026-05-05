import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import OtpComponent from "@/components/shared/OtpComponent";
import { div } from "framer-motion/client";

export default function otp(){
    return(
        <div>
            <Navbar/>
            <OtpComponent/>
            <Footer/>
        </div>
    )
}
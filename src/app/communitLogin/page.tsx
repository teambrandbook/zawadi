import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import LoginComponent from "@/components/shared/LoginComponent";
import { div } from "framer-motion/client";

export default function communitLogin(){
    return(
        <div>
            <Navbar/>
            <LoginComponent/>
            <Footer/>
        </div>
    )
}
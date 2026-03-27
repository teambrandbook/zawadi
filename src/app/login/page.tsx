import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import LoginComponent from "@/components/shared/LoginComponent";
import { div } from "framer-motion/client";

export default function Login(){
    return(
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar/>
            <div className="pt-40 pb-6">
                <LoginComponent />
            </div>
            <Footer/>
        </div>
    )
}
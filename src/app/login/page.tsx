import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import LoginComponent from "@/components/shared/LoginComponent";

export default function Login(){
    return(
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar/>
            <div className=" pb-6">
                <LoginComponent />
            </div>
            <Footer/>
        </div>
    )
}
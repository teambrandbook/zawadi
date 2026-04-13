import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import LoginComponent from "@/components/shared/LoginComponent";

export default function communitLogin(){
    return(
        <div className="flex flex-col min-h-screen">
            <Navbar/>

            <div className="flex-grow">
                <LoginComponent/>
            </div>

            <Footer/>
        </div>
    )
}
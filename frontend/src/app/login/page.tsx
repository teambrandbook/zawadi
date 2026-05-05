import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import LoginComponent from "@/components/shared/LoginComponent";

export default function communitLogin(){
    return(
        <div className="flex flex-col min-h-screen">
           

            <div className="flex-grow lg:pt-14">
                <Navbar/>
                <LoginComponent/>
                <Footer/>
            </div>

            
        </div>
    )
}
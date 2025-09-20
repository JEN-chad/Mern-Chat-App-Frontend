import Chat from "../../assets/chat.png";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import { LOGINROUTE, SIGNUPROUTE } from "@/utils/constants.js";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const verifySignUpData = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Both password and confirmPassword should be same");
      return false;
    }
    return true;
  };

  const verifyLoginData = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (verifyLoginData()) {
      const res = await apiClient.post(
        LOGINROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.user.id) {
        setUserInfo(res.data.user);
        if (res.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
    }
  };

  const handleSignup = async () => {
    if (verifySignUpData()) {
      const res = await apiClient.post(
        SIGNUPROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 201) {
        setUserInfo(res.data.user);
        navigate("/profile");
      }
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-[#2a2b33]">
      <div className="h-[80vh] bg-[#2a2b33] border-2 border-cyan-400 w-[80vw] text-white shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        
        {/* Left side: Auth form */}
        <div className="flex items-center justify-center flex-col gap-10 p-6">
          <div className="flex items-center justify-center flex-col gap-2">
            <div className="flex items-center justify-center gap-5">
              <h1 className="text-5xl font-bold md:text-6xl text-white">
                Welcome
              </h1>
              <img className="h-[70px]" src={Chat} alt="Chat logo" />
            </div>
            <p className="text-center font-medium text-gray-300">
              Fill in the blanks to get started with chat app
            </p>
          </div>

          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="flex gap-2.5 bg-transparent w-full rounded-none">
                <TabsTrigger
                  className="data-[state=active]:text-cyan-400 text-gray-300 border-b-2 rounded-none w-full data-[state=active]:border-b-cyan-400 data-[state=active]:font-semibold p-3 transition-all"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:text-cyan-400 text-gray-300 border-b-2 rounded-none w-full data-[state=active]:border-b-cyan-400 data-[state=active]:font-semibold p-3 transition-all"
                  value="signup"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>

              {/* Login form */}
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6 bg-[#2a2b33] border border-gray-600 text-white focus:border-cyan-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6 bg-[#2a2b33] border border-gray-600 text-white focus:border-cyan-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-6 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>

              {/* Signup form */}
              <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6 bg-[#2a2b33] border border-gray-600 text-white focus:border-cyan-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6 bg-[#2a2b33] border border-gray-600 text-white focus:border-cyan-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6 bg-[#2a2b33] border border-gray-600 text-white focus:border-cyan-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-6 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                  onClick={handleSignup}
                >
                  SignUp
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right side: Lottie + Welcome Text */}
        <div className="hidden xl:flex flex-col justify-center items-center">
          <Lottie
            isClickToPauseDisabled={true}
            height={200}
            width={200}
            options={animationDefaultOptions}
          />
          <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
            <h3 className="poppins-medium">
              Hi <span className="text-cyan-500">!</span> Welcome to
              <span className="text-cyan-500"> Pesalam </span>
              Chat App<span className="text-cyan-500">.</span>
            </h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;

import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ContactsContainer from "./components/contacts-container";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile ..");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 left-0 bg-black/80 flex items-center justify-center flex-col gap-6 backdrop-blur-lg z-50 px-10">
          <h5 className="text-4xl font-semibold text-cyan-400 animate-pulse">
            Uploading...
          </h5>
          <div className="w-full max-w-lg bg-cyan-900/40 rounded-full h-4 overflow-hidden shadow-md">
            <div
              className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${fileUploadProgress}%` }}
            ></div>
          </div>
          <p className="text-cyan-300 text-xl">{fileUploadProgress}%</p>
        </div>
      )}

      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 left-0 bg-black/80 flex items-center justify-center flex-col gap-6 backdrop-blur-lg z-50 px-10">
          <h5 className="text-4xl font-semibold text-cyan-400 animate-pulse">
            Downloading...
          </h5>
          <div className="w-full max-w-lg bg-cyan-900/40 rounded-full h-4 overflow-hidden shadow-md">
            <div
              className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${fileDownloadProgress}%` }}
            ></div>
          </div>
          <p className="text-cyan-300 text-xl">{fileDownloadProgress}%</p>
        </div>
      )}

      <ContactsContainer />
      {selectedChatType == undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;

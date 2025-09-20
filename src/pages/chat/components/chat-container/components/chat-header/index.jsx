import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { RiCloseFill } from "react-icons/ri";
const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-4 items-center justify-center ">
          <div className="w-12 h-12 relative">
              {selectedChatType === "contact" && (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.charAt(0)
                      : selectedChatData.email.charAt(0)}
                  </div>
                )}
              </Avatar>
            )}

            {selectedChatType === "channel" && (
              <div
                className="uppercase h-12 w-12 text-lg flex items-center justify-center
                           rounded-full border border-cyan-500 text-cyan-400 bg-[#1e2f31]"
              >
                {selectedChatData.name?.charAt(0) || "C"}
              </div>
            )}
          </div>
          <div>
            {selectedChatType == "channel" && selectedChatData.name}
            {selectedChatType == "contact" && selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </div>
        </div>
        <div className="flex gap-5 items-center justify-center ">
          <button
            className="focus:outline-none 
             text-neutral-500 hover:text-white focus:text-white
             transition-all duration-300 p-1"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

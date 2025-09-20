import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTES } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { toast } from "sonner";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [message, setMessage] = useState("");
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = () => {
    if (selectedChatType == "contact") {
      if (!message.trim()) return;
      const newMessage = {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        // adapt for channel if needed
        messageType: "text",
        fileUrl: undefined,
      };

      socket.emit("sendMessage", newMessage);
      setMessage(""); // Clear input after send
    } else if (selectedChatType == "channel") {
      if (!message.trim()) return;
      const newMessage = {
        sender: userInfo.id,
        content: message,
        channelId: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      };

      socket.emit("send-channel-message", newMessage);
      setMessage(""); // Clear input after send
    }
    // Prevent empty messages
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
 


  //! New version
  // const handleAttachmentChange = async (event) => {
  //   try {
  //     const file = event.target.files[0];
  //     if (!file) return;

  //     setIsUploading(true);

  //     const formData = new FormData();
  //     formData.append("file", file);

  //     // add sender info
  //     formData.append("sender", userInfo.id);

  //     // add recipient or channel id
  //     if (selectedChatType === "contact") {
  //       formData.append("recipient", selectedChatData._id);
  //     } else if (selectedChatType === "channel") {
  //       formData.append("channelId", selectedChatData._id);
  //     }

  //     const res = await apiClient.post(UPLOAD_FILE_ROUTES, formData, {
  //       withCredentials: true,
  //       onUploadProgress: (data) => {
  //         setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
  //       },
  //     });

  //     if (res.status === 200 && res.data?.success) {
  //       const fileUrl = res.data.data.fileUrl;

  //       // send socket event depending on chat type
  //       if (selectedChatType === "contact") {
  //         socket.emit("sendMessage", {
  //           sender: userInfo.id,
  //           recipient: selectedChatData._id,
  //           messageType: "file",
  //           fileUrl,
  //         });
  //       } else if (selectedChatType === "channel") {
  //         socket.emit("send-channel-message", {
  //           sender: userInfo.id,
  //           channelId: selectedChatData._id,
  //           messageType: "file",
  //           fileUrl,
  //         });
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const handleAttachmentChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an image
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    if (!imageRegex.test(file.name)) {
      toast.error("Only image files are allowed!");
      return;
    }

    // Check file size (5MB limit)
    const maxSizeMB = 5;
    if (file.size / 1024 / 1024 > maxSizeMB) {
      toast.error("Image size should not exceed 5MB!");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sender", userInfo.id);

      if (selectedChatType === "contact") {
        formData.append("recipient", selectedChatData._id);
      } else if (selectedChatType === "channel") {
        formData.append("channelId", selectedChatData._id);
      }

      const res = await apiClient.post(UPLOAD_FILE_ROUTES, formData, {
        withCredentials: true,
        onUploadProgress: (data) => {
          setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
        },
      });

      // Only show success if the response confirms success
      if (res.status === 200 && res.data?.success) {
        const fileUrl = res.data.data.fileUrl;

        if (selectedChatType === "contact") {
          socket.emit("sendMessage", {
            sender: userInfo.id,
            recipient: selectedChatData._id,
            messageType: "file",
            fileUrl,
          });
        } else if (selectedChatType === "channel") {
          socket.emit("send-channel-message", {
            sender: userInfo.id,
            channelId: selectedChatData._id,
            messageType: "file",
            fileUrl,
          });
        }
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      {/* Input & Emoji Section */}
      <div className="flex-1 bg-[#2a2b33] flex rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-5 bg-transparent rounded-md focus:outline-none"
        />

        {/* Attachment Button */}
        {selectedChatType === "contact" && (
          <button
            className="text-neutral-500 hover:text-white transition-all duration-300 p-1"
            onClick={handleAttachmentClick}
          >
            <GrAttachment className="text-2xl cursor-pointer" />
          </button>
        )}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />

        {/* Emoji Button */}
        <div className="relative" ref={emojiRef}>
          <button
            className="text-neutral-500 hover:text-white transition-all duration-300 p-1"
            onClick={() => setEmojiOpen(!emojiOpen)}
          >
            <RiEmojiStickerLine className="text-2xl cursor-pointer" />
          </button>
          {emojiOpen && (
            <div className="absolute bottom-16 right-0 z-10">
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Send Button */}
      <button
        className="bg-cyan-400 flex items-center justify-center p-5 rounded-md hover:bg-cyan-500 transition-all duration-300"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl cursor-pointer text-white" />
      </button>
    </div>
  );
};

export default MessageBar;

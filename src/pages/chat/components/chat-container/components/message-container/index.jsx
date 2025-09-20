import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import {
  GET_CHANNEL_MESSAGES,
  GET_MESSAGES_ROUTES,
  HOST,
} from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const scrollRef = useRef();
  const [previewImage, setPreviewImage] = useState(null);
  const { userInfo } = useAppStore();

  const {
    selectedChatData,
    selectedChatType,
    setIsDownloading,
    setFileDownloadProgress,
    selectedChatMessages,
    setSelectedChatMessages,
    messagesFetched,
    setMessagesFetched,
  } = useAppStore();

  // ===========================
  // Fetch messages
  // ===========================
  useEffect(() => {
    const chatId = selectedChatData?._id;
    if (!chatId) return;
    if (messagesFetched[chatId]) return;

    let didCancel = false;

    const getChannelMessages = async () => {
      try {
        const res = await apiClient.get(`${GET_CHANNEL_MESSAGES}/${chatId}`, {
          withCredentials: true,
        });
        if (!didCancel && res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
        setMessagesFetched(chatId);
      } catch (err) {
        console.error(err);
        setMessagesFetched(chatId);
      }
    };
    const getMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_MESSAGES_ROUTES,
          { id: chatId },
          { withCredentials: true }
        );
        if (!didCancel && res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
        setMessagesFetched(chatId);
      } catch (err) {
        console.error(err);
        setMessagesFetched(chatId);
      }
    };

    if (selectedChatType === "contact") {
      getMessages();
    } else {
      getChannelMessages();
    }

    return () => {
      didCancel = true;
    };
  }, [
    selectedChatData?._id,
    selectedChatType,
    setSelectedChatMessages,
    messagesFetched,
    setMessagesFetched,
  ]);

  // Scroll to last message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  // ===========================
  // Download file function
  // ===========================
  const downloadFile = async (url) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);

      const downloadUrl = url.includes("res.cloudinary.com")
        ? `${url}?fl_attachment=true`
        : url;

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const filename = url.split("/").pop() || "file";

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      setFileDownloadProgress(100);
      setTimeout(() => setFileDownloadProgress(0), 500);
      setIsDownloading(false);
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
      setFileDownloadProgress(0);
    }
  };




  // ===========================
  // Check if file is an image
  // ===========================
  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  // ===========================
  // Render each message
  // ===========================
  const renderDmMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {/* Text Message */}
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#06b6d4]/5 text-[#06b6d4]/90 border-[#06b6d4]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words mt-1`}
        >
          {message.content}
        </div>
      )}

      {/* File Message */}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#06b6d4]/5 text-[#06b6d4]/90 border-[#06b6d4]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words mt-1`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="cursor-pointer"
                onClick={() => setPreviewImage(message.fileUrl)}
              >
                <img
                  src={message.fileUrl}
                  className="max-w-[300px] max-h-[300px] object-contain"
                  alt="preview"
                />
              </div>
              <button
                onClick={() => downloadFile(message.fileUrl)}
                className="bg-black/20 p-2 text-xl rounded-full hover:bg-black/50 cursor-pointer"
              >
                <IoMdArrowRoundDown />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span className="text-white/90">
                {message.fileUrl.split("/").pop()}
              </span>
              <button
                onClick={() => downloadFile(message.fileUrl)}
                className="bg-black/20 p-2 text-2xl rounded-full hover:bg-black/50 cursor-pointer"
              >
                <IoMdArrowRoundDown />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  // ===========================
  // Render all messages with date
  // ===========================
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      const isLast = index === selectedChatMessages.length - 1;

      return (
        <div key={index} ref={isLast ? scrollRef : null}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDmMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

const renderChannelMessages = (message) => {
  const isSender = message.sender._id === userInfo.id;
  return (
    <div
      className={`mt-5 ${isSender ? "text-right" : "text-left"}`}
      key={message._id}
    >
      {/* Message Bubble */}
      <div
        className={`border inline-block p-4 rounded my-1 max-w-[50%] break-words mt-1 ${
          isSender
            ? "bg-[#06b6d4]/5 text-[#06b6d4]/90 border-[#06b6d4]/50"
            : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
        }`}
      >
        {/* Text Message */}
        {message.messageType === "text" && <div>{message.content}</div>}

        {/* File Message */}
        {message.messageType === "file" && (
          <>
            {checkIfImage(message.fileUrl) ? (
              <div className="flex flex-col items-center gap-2">
                <div
                  className="cursor-pointer"
                  onClick={() => setPreviewImage(message.fileUrl)}
                >
                  <img
                    src={message.fileUrl}
                    className="max-w-[300px] max-h-[300px] object-contain"
                    alt="preview"
                  />
                </div>
                <button
                  onClick={() => downloadFile(message.fileUrl)}
                  className="bg-black/20 p-2 text-xl rounded-full hover:bg-black/50 cursor-pointer"
                >
                  <IoMdArrowRoundDown />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span className="text-white/90">
                  {message.fileUrl.split("/").pop()}
                </span>
                <button
                  onClick={() => downloadFile(message.fileUrl)}
                  className="bg-black/20 p-2 text-2xl rounded-full hover:bg-black/50 cursor-pointer"
                >
                  <IoMdArrowRoundDown />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sender Info */}
      {!isSender && (
        <div className="flex items-center gap-3 mt-1 ml-2">
          <Avatar className="h-8 w-8 rounded-full overflow-hidden">
            {message.sender.image ? (
              <AvatarImage
                src={`${HOST}/${message.sender.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName[0]
                  : message.sender.email[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName || ""}`}</span>
            <span className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        </div>
      )}

      {/* Timestamp for sender */}
      {isSender && (
        <div className="text-xs text-white/60 mt-1">
          {moment(message.timestamp).format("LT")}
        </div>
      )}
    </div>
  );
};


  // ===========================
  // Main return
  // ===========================
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={previewImage}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              alt="enlarged"
            />
            <button
              className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black"
              onClick={() => setPreviewImage(null)}
            >
              <IoClose size={24} />
            </button>
            <button
              className="absolute bottom-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black"
              onClick={() => downloadFile(previewImage)}
            >
              <IoMdArrowRoundDown size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;

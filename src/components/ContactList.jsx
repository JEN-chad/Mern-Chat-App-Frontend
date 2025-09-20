import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");

    // Clear old messages if switching chats
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }

    setSelectedChatData(contact);
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        const displayName =
          contact.name || contact.channelName || "Unnamed Channel";

        return (
          <div
            key={contact._id}
            className={`pl-10 py-2 cursor-pointer transition-all duration-300 rounded-md ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-cyan-300 hover:bg-cyan-400 text-black"
                : "hover:bg-[#f1f1f111] text-neutral-200"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center">
              {/* Avatar or Channel Icon */}
              {isChannel ? (
                contact.image ? (
                  <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="channel"
                      className="object-cover w-full h-full bg-black"
                    />
                  </Avatar>
                ) : (
                  <div
                    className="uppercase h-10 w-10 text-lg flex items-center justify-center 
             rounded-full border border-cyan-500 text-cyan-400 bg-[#1a2d2f]"
                  >
                    {displayName.charAt(0)}
                  </div>
                )
              ) : (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`${
                        selectedChatData && selectedChatData._id === contact._id
                          ? "bg-white border border-white/0"
                          : getColor(contact.color)
                      } uppercase h-10 w-10 text-lg border flex items-center justify-center rounded-full`}
                    >
                      {contact.firstName
                        ? contact.firstName.charAt(0)
                        : contact.email?.charAt(0)}
                    </div>
                  )}
                </Avatar>
              )}

              {/* Display name / email */}
              <div>
                <p className="font-semibold">
                  {isChannel
                    ? displayName
                    : `${contact.firstName || ""} ${
                        contact.lastName || ""
                      }`.trim() || contact.email}
                </p>

                {!isChannel && contact.email && (
                  <p
                    className={`${
                      selectedChatData && selectedChatData._id === contact._id
                        ? "text-neutral-950"
                        : "hover:bg-[#f1f1f111] text-neutral-400"
                    } text-sm`}
                  >
                    {contact.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;

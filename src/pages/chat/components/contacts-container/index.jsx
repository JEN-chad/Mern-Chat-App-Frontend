import { useEffect, useRef } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_CHANNEL_ROUTES, GET_DM_CONTACTS_ROUTES } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/create-channel";

const ContactsContainer = () => {
  const { setDirectMessagesContacts, directMessagesContacts,  contactsFetched, channels, setChannels} = useAppStore();
   const fetchedRef = useRef(false);

  // ! My way
  // useEffect(() => {
  //   const getContacts = async () => {
  //     try {
  //       const res = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
  //         withCredentials: true,
  //       });
  //       if (res.data.contacts) {
  //         console.log(res.data.contacts);
  //         setDirectMessagesContacts(res.data.contacts);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getContacts();
  // }, []);

  // ! sol 1
  //  useEffect(() => {
  //     const getContacts = async () => {
  //       try {
  //         // only fetch if not already loaded
  //         if (directMessagesContacts.length > 0) return;

  //         const res = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
  //           withCredentials: true,
  //         });

  //         if (res.data.contacts) {
  //           console.log("Contacts fetched:", res.data.contacts);

  //           // avoid setting same array repeatedly
  //           if (JSON.stringify(directMessagesContacts) !== JSON.stringify(res.data.contacts)) {
  //             setDirectMessagesContacts(res.data.contacts);
  //           }
  //         }
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };
  //     getContacts();
  //   }, [directMessagesContacts, setDirectMessagesContacts]);

  // ! Working one
  // useEffect(() => {
  //   const getContacts = async () => {
  //     try {
  //       const res = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
  //         withCredentials: true,
  //       });

  //       if (res.data.contacts) {
  //         console.log("Contacts fetched:", res.data.contacts);
  //         setDirectMessagesContacts(res.data.contacts);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   // fetch only if not already fetched
  //   if (directMessagesContacts.length === 0) {
  //     getContacts();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // empty dependency array → runs only once

useEffect(() => {
  if (contactsFetched) return; // skip if already fetched

  const getContacts = async () => {
    try {
      const res = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      if (res.data.contacts) {
        console.log("Contacts fetched:", res.data.contacts);
        setDirectMessagesContacts(res.data.contacts); // sets contactsFetched too
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getChannels = async () => {
    try {
      const res = await apiClient.get(GET_ALL_CHANNEL_ROUTES, {
        withCredentials: true,
      });
      if (res.data.channels) {
        console.log("Channels fetched:", res.data.channels);
        // sets channels fetched
        setChannels(res.data.channels);
      }
    } catch (err) {
      console.log(err);
    }
  };

  getContacts();
  getChannels();
}, [contactsFetched, setDirectMessagesContacts]);

// useEffect(() => {
//   const fetchChannels = async () => {
//     try {
//       const res = await apiClient.get(GET_ALL_CHANNEL_ROUTES, { withCredentials: true });
//       if (res.data.channels) setChannels(res.data.channels);
//     } catch (e) { console.error(e); }
//   };

//   fetchChannels();
// }, [setChannels]);  // or even [] if you only want once on mount



  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 w-full border-[#2f203b]">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
         <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>  
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          fill="#06b6d4" // cyan-500
        />
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          fill="#22d3ee" // cyan-400
        />
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          fill="#67e8f9" // cyan-300
        />
      </svg>

      {/* Gradient Text */}
      <span className="text-3xl font-semibold bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
        Pesalam
      </span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};

import { colors, getColor } from "@/lib/utils.js";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE,
  HOST,
  REMOVE_PROFILE_IMAGE,
  UPDATE_PROFILE_INFO,
} from "@/utils/constants";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [slectedColor, setSelectedColor] = useState(0);
  const [hovered, setHovered] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      const res = await apiClient.post(
        UPDATE_PROFILE_INFO,
        { firstName, lastName, color: slectedColor },
        { withCredentials: true }
      );
      if (res.status == 200 && res.data) {
        setUserInfo({ ...res.data, color: slectedColor });
        toast.success("Profile updated successfully");
        navigate("/chat");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Profile setup should be done.");
    }
  };

  const handleInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const res = await apiClient.post(ADD_PROFILE_IMAGE, formData, {
        withCredentials: true,
      });
      if (res.status == 200 && res.data.image) {
        setUserInfo({ ...userInfo, image: res.data.image });
        toast.success("Image updated successfully.");
      }
    } else {
      console.log("❌ No file selected");
    }
  };

  const handleRemoveImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE, {
        withCredentials: true,
      });
      if (res.status == 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully");
        setImage(null);
      }
    } catch (err) {
      console.error(err);
      console.log("Error in removing profile image.");
    }
  };
  return (
    <div className="h-[100vh] flex items-center justify-center flex-col gap-10 bg-[#1b1c24]">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    slectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer ring-fuchsia-50 "
                onClick={image ? handleRemoveImage : handleInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer " />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer " />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png,.jpg,.jpeg,.svg,.webp"
            />
          </div>
          <div className="flex items-center justify-center text-white flex-col gap-5 min-w-32 md:min-w-64">
            <div className="w-full">
              <input
                placeholder={userInfo.email}
                type="email"
                disabled
                className="border-none rounded-lg p-4 bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                type="text"
                className="border-none rounded-lg p-4 bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full">
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                type="text"
                className="border-none rounded-lg p-4 bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={`${color} h-8 w-8 rounded-full transition-all duration-300 cursor-pointer ${
                    slectedColor === index
                      ? "outline outline-white/80 outline-2"
                      : ""
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full rounded-lg bg-cyan-700 hover:bg-cyan-900 transition-all duration-300 text-white"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

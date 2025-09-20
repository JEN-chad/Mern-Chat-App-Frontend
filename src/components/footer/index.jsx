import { FaGithub, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="fixed  bottom-0 w-full flex justify-center items-center gap-4 p-4 h-28 text-3xl bg-transparent">
      
      {/* GitHub */}
      <a
        href="https://github.com/JEN-chad/Mern-Chat-App-Frontend"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-gray-300 text-2xl"
      >
        <FaGithub />
      </a>

      {/* LinkedIn */}
      <a
        href="https://linkedin.com/in/jenishj-dev"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-400 text-2xl"
      >
        <FaLinkedin />
      </a>

      <span className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
        By <span className="text-red-400">🔥</span> Jenish
      </span>
    </div>
  );
};

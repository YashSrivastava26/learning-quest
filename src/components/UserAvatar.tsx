import { FC } from "react";
import { Avatar } from "./ui/avatar";
import { User } from "next-auth";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";

interface UserAvatarProps {
  user: User;
}

const UserAvatar: FC<UserAvatarProps> = ({ user }) => {
  return (
    <Avatar>
      {user?.image ? (
        <div className="relative w-full h-full aspect-square">
          <Image
            src={user.image}
            alt="user profile"
            referrerPolicy="no-referrer"
            fill
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className=" sr-only"> {user?.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;

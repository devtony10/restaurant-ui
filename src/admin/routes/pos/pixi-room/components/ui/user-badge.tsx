import { Avatar, Label } from "@medusajs/ui";

const UserBadge = ({ avatarUrl, username }) => {
 return (
    <div className="inline-flex items-center pr-2 pt-1 pb-1 pl-1 gap-2 rounded-full bg-ui-bg-component border-ui-border-base shadow-borders-base">
        <Avatar src={avatarUrl} size="2xsmall" fallback={username.slice(0, 1).toUpperCase()} />
        <Label>{username}</Label>
    </div>
 );
};

export default UserBadge;
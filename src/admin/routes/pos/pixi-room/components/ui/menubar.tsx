import { Medusa } from "@medusajs/icons";
import Menu from "./menu";
import UserBadge from "./user-badge";

const Menubar = () => {
    return(
        <div className="flex justify-between items-center p-4 w-full min-h-5 bg-ui-bg-subtle">
            <Medusa />
            <div className="flex items-center gap-4">
                <UserBadge avatarUrl="./user.png" username="Hannibal" />
                <Menu />
            </div>
        </div>
    );
}

export default Menubar;

// change to navbar
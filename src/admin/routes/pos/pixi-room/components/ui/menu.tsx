import { DropdownMenu, IconButton, Text } from "@medusajs/ui";
import { EllipsisHorizontal } from '@medusajs/icons';

// note: change to @radix-ui/menu, use styles from dropdwon menu class

const Menu = () => {
  return (
    <div className="inline-flex bg-ui-bg-subtle p-[3px] gap-x-2">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton size="small">
            <EllipsisHorizontal className="text-ui-fg-subtle"/>
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>
            <Text>Edit</Text>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      {/* isEditMode show dropdown else menubar */}
    </div>    
  );
};

export default Menu;

// navbar -> logo, menu (isEditMode show dropdown else menubar/toolbar)
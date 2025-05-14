import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="font-semibold">Profile</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <nav className="space-y-2 px-4">
          <a
            href="#"
            className="block py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded"
          >
            All Notes
          </a>
          <a
            href="#"
            className="block py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded"
          >
            Favorites
          </a>
          <a
            href="#"
            className="block py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded"
          >
            Categories
          </a>
          <Sheet>
            <SheetTrigger className="block w-full text-left py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded">
              About Us
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>About Pa-Note</SheetTitle>
                <SheetDescription>
                  Pa-Note is a modern note-taking application that helps you organize your thoughts and ideas efficiently. With features like voice recording, rich text formatting, and an intuitive interface, Pa-Note makes it easy to capture and manage your notes.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </nav>
      </SidebarContent>
      <SidebarFooter>{/* Add footer content if needed */}</SidebarFooter>
    </Sidebar>
  );
}

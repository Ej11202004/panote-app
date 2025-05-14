"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Trash2, CheckCircle2, XCircle, Mic } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<{
    id: number | null;
    title: string;
    content: string;
    formatting: {
      bold: boolean;
      italic: boolean;
      underline: boolean;
      align: "left" | "center" | "right";
    };
  }>({
    id: null,
    title: "",
    content: "",
    formatting: {
      bold: false,
      italic: false,
      underline: false,
      align: "left",
    },
  });

  // Add this state for recording
  const [isRecording, setIsRecording] = useState(false);

  // Add the handler here
  const handleStartRecording = async () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setEditingNote((prev) => ({
          ...prev,
          content: prev.content + (prev.content ? " " : "") + transcript,
        }));
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        showNotification("Failed to record audio", "error");
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      console.error("Speech recognition not supported");
      showNotification(
        "Speech recognition is not supported in your browser",
        "error"
      );
    }
  };
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Note Title",
      content:
        "This is a preview of the note content. It will show the first few lines of the note...",
      createdAt: new Date().toISOString(), // Add creation date
    },
  ]);

  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleDelete = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    showNotification("Note deleted successfully", "success");
  };

  const handleSaveNote = () => {
    if (!editingNote.title.trim() || !editingNote.content.trim()) {
      showNotification("Note title and content cannot be empty", "error");
      return;
    }

    if (editingNote.id === null) {
      // Add new note
      const newNote = {
        id: notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1,
        title: editingNote.title.trim(),
        content: editingNote.content.trim(),
        createdAt: new Date().toISOString(), // Add creation date for new notes
      };
      setNotes((prevNotes) => [...prevNotes, newNote]);
      showNotification("Note added successfully", "success");
    } else {
      // Update existing note
      setNotes((prevNotes) => {
        const updatedNotes = prevNotes.map((note) => {
          if (note.id === editingNote.id) {
            return {
              id: editingNote.id,
              title: editingNote.title.trim(),
              content: editingNote.content.trim(),
              createdAt: note.createdAt, // Preserve the original creation date
            };
          }
          return note;
        });
        return updatedNotes;
      });
      showNotification("Note updated successfully", "success");
    }
    setIsEditing(false);
  };

  const handleEditNote = (note: (typeof notes)[0]) => {
    setEditingNote({
      id: note.id,
      title: note.title,
      content: note.content,
      formatting: {
        bold: false,
        italic: false,
        underline: false,
        align: "left",
      },
    });
    setIsEditing(true);
  };

  const handleFormatting = (value: string[]) => {
    const newFormatting = { ...editingNote.formatting };

    // Handle alignment separately (only one alignment can be active at a time)
    const alignmentValue = value.find((v) =>
      ["left", "center", "right"].includes(v)
    );
    newFormatting.align =
      (alignmentValue as "left" | "center" | "right") || "left";

    // Handle other formatting options
    newFormatting.bold = value.includes("bold");
    newFormatting.italic = value.includes("italic");
    newFormatting.underline = value.includes("underline");

    setEditingNote((prev) => ({
      ...prev,
      formatting: newFormatting,
    }));
  };

  const handleDeleteAllNotes = () => {
    setNotes([]);
    showNotification("All notes deleted successfully", "success");
  };

  return (
    <div className="min-h-screen flex">
      {/* Notification Alert */}
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in zoom-in duration-300 slide-in-from-bottom-5">
          <Alert
            className={cn(
              "w-80",
              notification.type === "success"
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            )}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription
                className={cn(
                  "text-sm font-medium",
                  notification.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                )}
              >
                {notification.message}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}
      {/* Sidebar */}
      {/* Sidebar */}
      <div className="w-16 hover:w-80 transition-all duration-300 ease-in-out bg-background text-foreground min-h-screen flex-shrink-0 group">
        <div className="p-4 relative h-full">
          {/* Add theme toggle to the top of the sidebar */}
          <div className="mb-4 flex justify-end">
            <ThemeToggle />
          </div>
          {/* Hover Me text - visible when sidebar is collapsed */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform group-hover:opacity-0 transition-opacity duration-200 rotate-[-90deg] origin-center whitespace-nowrap">
            <span className="text-sm font-medium">Hover Me</span>
          </div>

          {/* Menu content - visible when sidebar expands */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
            <div className="flex items-center gap-3 mb-8">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="font-semibold">Profile</span>
            </div>

            <nav className="space-y-2">
              <a
                href="#"
                className="block py-2 px-4 hover:bg-gray-800 rounded whitespace-nowrap"
              >
                All Notes
              </a>
              <Drawer>
                <DrawerTrigger className="block w-full text-left py-2 px-4 hover:bg-gray-800 rounded whitespace-nowrap">
                  About Us
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>About Pa-Note</DrawerTitle>
                    <DrawerDescription>
                      Pa-Note is a modern note-taking application that helps you
                      capture and organize your thoughts efficiently. With
                      features like voice recording, rich text formatting, and
                      an intuitive interface, Pa-Note makes it easy to keep
                      track of your ideas.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Key Features: - Voice recording - Rich text formatting -
                      Dark mode support - Responsive design - Easy organization
                    </p>
                  </div>
                </DrawerContent>
              </Drawer>
              <div className="mt-4 px-4">
                <img
                  src="/Pa-note_white.svg"
                  alt="Pa-note"
                  className="w-full h-auto opacity-70"
                />
              </div>
              <Button onClick={() => router.replace("/login")}>Logout</Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content - Notes Grid */}
      <div className="flex-1 bg-[#1a1a1a] p-8">
        <div className="container mx-auto">
          {/* Header with Logo */}
          <div className="mb-8">
            <div className="w-32"></div>
          </div>

          {/* Action Buttons - Centered and Smaller */}
          <div className="flex justify-center gap-4 mb-8">
            <AlertDialog>
              <AlertDialogTrigger>
                <button className="relative cursor-pointer p-3 text-center font-barlow inline-flex justify-center text-base uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden">
                  <span className="relative z-20">
                    <Trash2 className="h-4 w-4" />
                  </span>
                  <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out" />
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0" />
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0" />
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0" />
                  <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sure na sure ka ba?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    all your notes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAllNotes}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <button
              onClick={() => {
                setEditingNote({
                  id: null,
                  title: "",
                  content: "",
                  formatting: {
                    bold: false,
                    italic: false,
                    underline: false,
                    align: "left",
                  },
                });
                setIsEditing(true);
              }}
              className="relative cursor-pointer p-3 text-center font-barlow inline-flex justify-center text-base uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden"
            >
              <span className="relative z-20">
                <svg
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out" />
              <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0" />
              <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0" />
              <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0" />
              <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0" />
            </button>
          </div>

          {/* Notes Grid or Edit View */}
          {!isEditing ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-sm mx-auto"
            >
              <CarouselContent>
                {notes.map((note) => (
                  <CarouselItem key={note.id}>
                    <div className="p-1">
                      <div
                        className="relative bg-[#212121] rounded-xl overflow-hidden p-6 h-full flex flex-col"
                        style={{
                          background:
                            "linear-gradient(#212121, #212121) padding-box, linear-gradient(145deg, transparent 35%,#e81cff, #40c9ff) border-box",
                          border: "2px solid transparent",
                        }}
                      >
                        <h2 className="text-xl font-medium mb-4 truncate text-white">
                          {note.title}
                        </h2>
                        {note.content.length > 150 ? (
                          <p className="text-sm text-gray-400 italic mb-4">
                            Content is too long, cannot be previewed.
                          </p>
                        ) : (
                          <p className="text-sm text-gray-300 mb-4 line-clamp-3 flex-1">
                            {note.content}
                          </p>
                        )}
                        <div className="flex justify-end gap-2 mt-auto">
                          <span className="text-sm text-gray-400 mr-auto">
                            Note {note.id} •{" "}
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleEditNote(note)}
                            className="text-gray-300 hover:text-[#e81cff]"
                            title="Edit note"
                          >
                            <Pencil size={16} />
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Trash2 className="h-4 w-4 text-red-400 hover:text-red-500" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Note</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this note?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(note.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div className="max-w-4xl mx-auto transform transition-all duration-500 animate-fade-scale-up">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <input
                    title="Note title"
                    placeholder="Enter note title"
                    type="text"
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, title: e.target.value })
                    }
                    className="text-2xl font-bold bg-transparent border-none outline-none text-gray-800 dark:text-white w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleStartRecording}
                  className={cn(
                    "w-full mb-4 px-4 py-2 flex items-center justify-center gap-2 rounded-lg transition-colors",
                    isRecording
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  <Mic
                    className={cn("h-5 w-5", isRecording && "animate-pulse")}
                  />
                  {isRecording ? "Recording..." : "Start Recording"}
                </button>

                {/* Formatting Toolbar */}
                <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                  <ToggleGroup
                    type="multiple"
                    className="justify-start"
                    value={[
                      editingNote.formatting.bold ? "bold" : "",
                      editingNote.formatting.italic ? "italic" : "",
                      editingNote.formatting.underline ? "underline" : "",
                      editingNote.formatting.align,
                    ].filter(Boolean)}
                    onValueChange={handleFormatting}
                  >
                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                      <Bold className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                      <Italic className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="underline"
                      aria-label="Toggle underline"
                    >
                      <Underline className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="left" aria-label="Align left">
                      <AlignLeft className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Align center">
                      <AlignCenter className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Align right">
                      <AlignRight className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <textarea
                  title="Note content"
                  placeholder="Enter your note content here..."
                  value={editingNote.content}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, content: e.target.value })
                  }
                  className={cn(
                    "w-full min-h-[400px] bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-200",
                    editingNote.formatting.bold && "font-bold",
                    editingNote.formatting.italic && "italic",
                    editingNote.formatting.underline && "underline",
                    editingNote.formatting.align === "center" && "text-center",
                    editingNote.formatting.align === "right" && "text-right"
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Keep this type declaration at the top of the file
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

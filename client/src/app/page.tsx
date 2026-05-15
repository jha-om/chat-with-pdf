import Chat from "@/components/chat";
import FileUpload from "@/components/file-upload";

export default function Home() {
  return (
    <main className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 pt-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="min-h-0 w-full">
        <FileUpload />
      </div>
      <div className="relative min-h-0 w-full">
        <Chat />
      </div>
    </main>
  )
}

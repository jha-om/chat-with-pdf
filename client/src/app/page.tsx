import FileUpload from "@/components/file-upload";

export default function Home() {
  return (
    <div className="grid flex-1 w-full grid-cols-1 gap-4 lg:grid-cols-[40%_60%]">
      <div className="w-full">
        <FileUpload />
      </div>
      <div className="w-full relative">
        <div className="absolute border-t border-slate-300 inset-0 -top-3 lg:border-l lg:border-t-0 lg:border-slate-300 lg:inset-0 lg:-left-3" />
        2
      </div>
    </div>
  )
}

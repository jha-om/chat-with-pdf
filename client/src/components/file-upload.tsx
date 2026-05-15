"use client"

import { Upload } from "lucide-react";

export default function FileUpload() {
    function handleFileUpload() {
        const element = document.createElement('input');
        element.setAttribute('type', 'file');
        element.setAttribute('accept', 'application/pdf');

        element.addEventListener('change', async () => {
            if (element.files && element.files.length > 0) {
                const file = element.files.item(0);
                if (file) {
                    const formData = new FormData();
                    formData.append('pdf', file);

                    await fetch('http://localhost:8000/upload/pdf', {
                        method: "POST",
                        body: formData,
                    })
                }
            }
        })

        element.click();
    }

    return (
        <div className="flex h-full min-h-80 w-full items-center justify-center bg-slate-700/20 p-4">
            <div onClick={handleFileUpload} className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-zinc-600/80 p-8 text-center">
                <Upload width={72} height={72} color="oklch(44.2% 0.017 285.786)" />
                <div>
                    <h3>Upload any PDF to chat with it</h3>
                </div>
            </div>
        </div>
    )
}

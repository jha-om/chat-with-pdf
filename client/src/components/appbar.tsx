import { Show, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Appbar() {
    return (
        <div className="w-full flex justify-center px-4 py-3">
            <div className="w-full max-w-4xl h-fit bg-slate-700/20 px-4 py-3 flex justify-between items-center">
                <div>
                    Chat with pdf
                </div>
                <div>
                    <Show when={"signed-in"}>
                        <UserButton />
                    </Show>
                    <Show when={"signed-out"}>
                        <SignUpButton />
                    </Show>
                </div>
            </div>

        </div>
    )
}

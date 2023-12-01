"use client";

import Button from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Selector";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";

export default function Home() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();

    async function logIn(e: React.SyntheticEvent) {
        setError("");
        setLoading(true);
        e.preventDefault();
        if (email && password) {
            setTimeout(() => {
                router.push("/objectives");
            }, 2000);
        }
    }

    useEffect(() => {
        console.log(error);
    }, [error]);
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-16">
            <div className="p-8 bg-white border rounded-md shadow-sm w-[320px] border-zinc-200 flex flex-col gap-1 text-center items-center">
                <h1 className="text-2xl font-semibold leading-none w-fit">
                    Sign in
                </h1>
                <h2 className="mt-1 text-sm text-zinc-500">
                    Sign into your staff account to get access to our platform.
                </h2>
                <form
                    onSubmit={logIn}
                    className="w-full gap-2 mt-4 flex flex-col items-center"
                >
                    <div className="w-full flex flex-col items-start">
                        <Label className="">E-mail</Label>
                        <Input
                            type="email"
                            required
                            className=""
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="w-full flex flex-col items-start">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            required
                            className=""
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                        <p className="mt-1 text-sm text-red-400">{error}</p>
                    )}
                    <div className="flex justify-center gap-2 items-center">
                        <Button
                            type="submit"
                            className="mt-4"
                            loading={loading}
                            variant="primary"
                        >
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}

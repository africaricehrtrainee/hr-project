"use client";

import Image from "next/image";
import AfricaRice from "@/public/africarice.webp";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "./Button";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import LoadingBar from "react-top-loading-bar";
import { useLoaderRef } from "@/hooks/useLoading";
import axios from "axios";

export default function Navigation() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const loaderRef = useLoaderRef();
    const pathName = usePathname();

    axios.interceptors.request.use(
        function (config) {
            // Do something before request is sent
            loaderRef.current.continuousStart();
            return config;
        },
        function (error) {
            // Do something with request error
            return Promise.reject(error);
        }
    );

    // Add a response interceptor
    axios.interceptors.response.use(
        function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            loaderRef.current.complete();
            return response;
        },
        function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            loaderRef.current.complete();
            return Promise.reject(error);
        }
    );

    axios.defaults.withCredentials = true;

    return (
        <nav className="flex h-12 w-full items-center justify-start gap-8 bg-white px-8 shadow-sm">
            <LoadingBar color="lightgreen" height={5} ref={loaderRef} />
            <Link href="/">
                <Image
                    src={AfricaRice}
                    className="h-auto w-24"
                    alt="Africa Rice"
                />
            </Link>

            {user && (
                <div className="flex items-center justify-center gap-2">
                    <Link
                        className={
                            "rounded-full p-2 px-4 text-xs font-bold transition-all hover:bg-zinc-100 text-zinc-500 active:scale-90 flex items-center justify-center gap-1 group" +
                            ` ${pathName == "/" && "bg-zinc-100 text-zinc-800"}`
                        }
                        href="/"
                    >
                        Home
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            className="transition-all group-hover:translate-x-1"
                        >
                            <path
                                fill="currentColor"
                                d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01L5.99 16.596Z"
                            />
                        </svg>
                    </Link>
                    <Link
                        className={
                            "rounded-full p-2 px-4 text-xs font-bold transition-all hover:bg-zinc-100 text-zinc-500 active:scale-90 flex items-center justify-center gap-1 group" +
                            ` ${
                                pathName == `/objectives/${user.employeeId}` &&
                                "bg-zinc-100 text-zinc-800"
                            }`
                        }
                        href={`/objectives/${user.employeeId}`}
                    >
                        My performance
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            className="transition-all group-hover:translate-x-1"
                        >
                            <path
                                fill="currentColor"
                                d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01L5.99 16.596Z"
                            />
                        </svg>
                    </Link>
                    {user.role == "admin" ||
                        (user.role == "hr" && (
                            <Link
                                className={
                                    "rounded-full p-2 px-4 text-xs font-bold transition-all hover:bg-zinc-100 text-zinc-500 active:scale-90 flex items-center justify-center gap-1 group" +
                                    ` ${
                                        pathName == "/admin" &&
                                        "bg-zinc-100 text-zinc-800"
                                    }`
                                }
                                href="/admin"
                            >
                                Accounts
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    className="transition-all group-hover:translate-x-1"
                                >
                                    <path
                                        fill="currentColor"
                                        d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01L5.99 16.596Z"
                                    />
                                </svg>
                            </Link>
                        ))}
                    <Link
                        href="/management"
                        className={
                            "rounded-full p-2 px-4 text-xs font-bold transition-all hover:bg-zinc-100 text-zinc-500 active:scale-90 flex items-center justify-center gap-1 group" +
                            ` ${
                                pathName == "/management" &&
                                "bg-zinc-100 text-zinc-800"
                            }`
                        }
                    >
                        Organogram
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            className="transition-all group-hover:translate-x-1"
                        >
                            <path
                                fill="currentColor"
                                d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01L5.99 16.596Z"
                            />
                        </svg>
                    </Link>
                </div>
            )}

            {user && (
                <div className="ml-auto flex items-center justify-center gap-4">
                    {/* <Button onClick={() => {}} variant="outline">
                        Inbox
                        <Icon
                            icon="mingcute:inbox-fill"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button> */}
                    <Button
                        onClick={() => {
                            logout();
                            router.push("/auth");
                        }}
                        variant="outline"
                    >
                        Log out
                        <Icon
                            icon="dashicons:exit"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                </div>
            )}
        </nav>
    );
}

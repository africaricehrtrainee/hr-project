"use client";

import Image from "next/image";
import AfricaRice from "@/public/africarice.webp";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "./Button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import LoadingBar from "react-top-loading-bar";
import { useLoaderRef } from "@/hooks/useLoading";
import axios from "axios";

export default function Navigation() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const loaderRef = useLoaderRef();

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

    return (
        <nav className="flex h-12 w-full items-center justify-between bg-white px-8 shadow-sm">
            <LoadingBar color="lightgreen" height={5} ref={loaderRef} />
            <Link href="/">
                <Image
                    src={AfricaRice}
                    className="h-auto w-24"
                    alt="Africa Rice"
                />
            </Link>
            {!user && (
                <div className="flex items-center justify-center gap-4">
                    <Button
                        onClick={() => {
                            logout();
                            router.push("/auth");
                        }}
                        variant="outline"
                    >
                        Inbox
                        <Icon
                            icon="mingcute:inbox-fill"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
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

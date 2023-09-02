"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const UserInformation = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("getDataSession");
    // PROTECT IF USER UNAUTHENTICATED
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/" });
    router.push(data.url);
    console.log("SIGN OUT", data);
  };

  if (status === "loading") {
    return (
      <h1 className="text-base font-semibold text-neutral-200">
        Harap Tunggu...
      </h1>
    );
  }

  if (status === "authenticated") {
    return (
      <>
        <h1 className="text-base font-semibold text-neutral-200">
          Hello, {session?.user?.email}
        </h1>
        <button onClick={handleSignOut} className="mt-8">
          Logout
        </button>
      </>
    );
  }

  return <div></div>;
};

export default UserInformation;

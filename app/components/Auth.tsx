"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

const signInSchema = yup
  .object({
    email: yup.string().required().email(),
    password: yup.string().required(),
  })
  .required();

const Auth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = (data: any) => {
    console.log("ON SUBMIT DATA", data);
    handleSignIn(data);
  };

  const handleSignIn = (data: any) => {
    setIsLoading(true);
    signIn("credentials", {
      redirect: false,
      password: data.password,
      email: data.email,
      username: data.email,
    })
      .then((resp) => {
        console.log("Response", resp?.error);
        if (resp?.error == null) {
          router.push("/home");
        } else {
          toast.error(resp.error);
        }
      })
      .catch((e) => {
        console.log("ERROR", e);
        toast.error("Sorry, something went wrong!");
      })
      .finally(() => setIsLoading(false));
  };

  const handleGithubSingIn = () => {
    // setIsLoading(true);
    signIn("github");
    // .then((_) => {
    //   toast.success("Login Success!");
    //   router.push("/home");
    // })
    // .catch((e) => {
    //   console.log("ERROR SIGN IN GITHUB", e);
    //   toast.error("Sorry, something went wrong!");
    // })
    // .finally(() => setIsLoading(false));
  };

  return (
    <div className="container mx-auto h-screen w-full justify-center items-center flex flex-col">
      <div className="flex flex-col">
        Sign In First
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 mt-4 w-48"
        >
          <input
            placeholder="Email"
            className="text-black p-1"
            {...register("email", { required: true })}
          />
          {errors.email?.type === "required" && (
            <p className="font-light text-rose-500">Field email is required</p>
          )}
          <input
            placeholder="Password"
            className="text-black p-1"
            {...register("password", { required: true, minLength: 6 })}
          />
          {errors.password?.type === "required" ? (
            <p className="font-light text-rose-500">
              Field password is required
            </p>
          ) : errors.password?.type === "minLength" ? (
            <p className="font-light text-rose-500">
              Password must be more than 6 characters
            </p>
          ) : (
            <></>
          )}
          <button
            disabled={isLoading}
            onClick={() => {
              console.log("SUBMITTED");
              handleSubmit(onSubmit);
            }}
            className={`p-2 ${
              !isLoading
                ? "border-blue-400 border rounded-md hover:bg-blue-200 hover:text-black"
                : "border rounded-md border-gray-400 bg-gray-300 text-neutral-600"
            }`}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
      <div className="mt-8">
        <button
          onClick={handleGithubSingIn}
          className="p-2 bg-white border rounded-md hover:bg-blue-200 text-black"
        >
          Sign In With Github
        </button>
      </div>
    </div>
  );
};

export default Auth;

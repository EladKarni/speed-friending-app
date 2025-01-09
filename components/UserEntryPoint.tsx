import { AnonSignInAction } from "@/app/actions";
import { Button } from "flowbite-react";
import { SubmitButton } from "./submit-button";
import { Input } from "./ui/input";
import Link from "next/link";

const UserEntryPoint = () => {
  return (
    <div className="w-64 text-center mx-auto">
      <Link href="/sign-in">
        <Button className="mx-auto w-44">Signup / Login</Button>
      </Link>
      <hr className="h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" />
      <form className="w-44 text-center mx-auto flex gap-4 flex-col">
        <Input type="text" name="name" placeholder="Your Name" required />
        <SubmitButton pendingText="Signing In..." formAction={AnonSignInAction}>
          Continue Without User
        </SubmitButton>
      </form>
    </div>
  );
};

export default UserEntryPoint;

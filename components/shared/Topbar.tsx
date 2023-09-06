import Link from "next/link";
import Image from "next/image";
import { SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Topbar(){
  return(
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={30} height={30}/>
        <p className="text-heading3-bold text-light-1 max-xs:hidden">
          Twitter Clone
        </p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden mr-2">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image 
                  src="/assets/logout.svg"
                  alt="logout"
                  width={22}
                  height={22}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <SignedOut>
          <Link href="/sign-in" className='mr-2 bg-primary-500 min-w-[74px] cursor-pointer rounded-md px-5 py-2 text-light-1 text-small-regular'>
            Login
          </Link>
          <Link href="/sign-up" className='mr-4 max-md:hidden bg-primary-500 min-w-[74px] cursor-pointer rounded-md px-5 py-2 text-light-1 text-small-regular'>
            Create Account
          </Link>
        </SignedOut>
      </div>
    </nav>
  )
}
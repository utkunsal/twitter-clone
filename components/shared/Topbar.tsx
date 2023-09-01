import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";

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
        <div className="block md:hidden">
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

        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: "px-4 py-2"
            }
          }}
        />
      </div>
    </nav>
  )
}
"use client"

import { sidebarLinks } from "@/constants"
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Bottombar(){
  const pathname = usePathname()

  return(
    <section className="bottombar">
      <div className="bottombar_container">
      {sidebarLinks.map(link => {
          const isActive = (link.route !== "/" && pathname.includes(link.route)) || pathname === link.route

          return(
            <Link 
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={22}
                height={22}
              />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(" ")[0]}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
import { Music, Users } from 'lucide-react'
import Link from 'next/link'

const TabNav = () => {
  return (
            <div className="flex items-center justify-between px-4 py-2 md:py-2 text-xs text-neutral-400 lg:border-b ">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1 font-medium text-neutral-300">
                <Music size={14} className="text-primary" />
                <span>Synq</span>
              </div>
              <span>#403360</span>
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>1 user</span>
              </div>
            </div>

          <Link href="/" aria-label="GitHub repository">
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="12" />
              
              <path
                fill="white"
                d="M12 5.5c-3.59 0-6.5 2.91-6.5 6.5
                0 2.87 1.86 5.31 4.44 6.17
                .33.06.45-.14.45-.32v-1.13
                c-1.81.39-2.19-.87-2.19-.87
                -.3-.76-.73-.96-.73-.96
                -.6-.41.05-.4.05-.4
                .66.05 1 .68 1 .68
                .59 1 .41 1.25 1.64.88
                .06-.43.23-.72.42-.88
                -1.45-.17-2.98-.72-2.98-3.22
                0-.71.25-1.29.67-1.75
                -.07-.17-.29-.86.06-1.8
                0 0 .55-.18 1.8.67
                .52-.14 1.08-.21 1.64-.21
                .56 0 1.12.07 1.64.21
                1.25-.85 1.8-.67 1.8-.67
                .35.94.13 1.63.06 1.8
                .42.46.67 1.04.67 1.75
                0 2.51-1.53 3.05-2.99 3.22
                .24.21.45.61.45 1.23v1.83
                c0 .18.12.39.46.32
                2.58-.86 4.43-3.3 4.43-6.17
                0-3.59-2.91-6.5-6.5-6.5z"
              />
            </svg>
          </Link>

        </div>
  )
}

export default TabNav

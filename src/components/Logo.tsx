import Image from 'next/image'

interface LogoProps {
  size?: number
  className?: string
}

export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <Image
      src="/vivair-logo.svg"
      alt="VivAir Travel Design"
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}
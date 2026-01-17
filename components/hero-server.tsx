import { HeroClient } from './hero-client'

export function Hero() {
  // We'll get the user on the client side instead of server side to avoid RSC issues
  return <HeroClient initialUser={null} />
}

export { HeroClient }

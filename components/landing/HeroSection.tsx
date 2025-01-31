import Link from 'next/link'
import { Button } from '../ui/button'
import CreativeCollage from './Collage'

const HeroSection = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-9xl w-full rounded-3xl relative overflow-hidden p-8">
        {/* Background Circles */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <article className="text-center lg:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Input, Analyze, Verify!</h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl pb-8">Fact-check health claims in a few easy steps.</h2>
            <div className="relative inline-block group hover:scale-105 transition-transform duration-300">
              <div 
                className="
                  absolute 
                  -inset-2 
                  bg-gradient-to-r 
                  from-pink-500 
                  via-lime-500 
                  to-orange-500 
                  rounded-full 
                  animate-border
                  bg-[length:400%_400%]
                "
              ></div>
              <Button 
                asChild 
                className="
                  relative
                  px-8 
                  py-4 
                  text-xl 
                  font-semibold 
                  rounded-full 
                  border-4
                  border-transparent
                  bg-white
                  hover:bg-gray-50
                  text-gray-800
                  transition-all 
                  duration-300
                  shadow-xl
                "
                variant="outline"
              >
                <Link href="/dashboard/claims">No Sign Up, no Hassle. Analyze Now!</Link>
              </Button>
            </div>
          </article>

          {/* App Screenshots */}
          <CreativeCollage />
        </div>
      </div>
    </div>
  )
}



export default HeroSection
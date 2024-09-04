'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import BgGradientSection from "@/components/BgGradientSection"
import { MacbookScroll } from "@/components/ui/macbook-scroll"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { SignInButton, SignedOut } from "@clerk/nextjs"
import { FileStack, Bot, PenTool, CheckCircle, Facebook, Twitter, Instagram, Github } from "lucide-react"
import Navbar from "@/components/Navbar"
import { useUser } from '@clerk/clerk-react'
import PricingCard from "@/components/PricingCard"
import { InfiniteMovingCardsDemo } from "@/components/InfiniteMovingCards"
export default function LandingPage() {
  const { isSignedIn, user, isLoaded } = useUser()
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <main className="flex-1">
        <section className="w-full md:pt-20">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <div className="overflow-hidden w-full">
                <MacbookScroll
                  title={
                    <>
                      <div className="-mt-24 text-3xl sm:text-4xl md:mt-0 md:text-5xl lg:text-6xl/none text-black dark:text-white">
                        A powerful platform for <span className="text-primary">PDF annotation, collaboration, and AI-driven insights</span>
                      </div>
                    </>
                  }
                  src={`/pdf.png`}
                  showGradient={false}
                  cta={
                    <>
                      <Link href={"/dashboard"}>
                        <Button className="font-bold mb-10">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="flex-col md:flex-row flex justify-center items-center py-5 gap-5">
            <div className="md:self-start flex-col flex gap-10 px-5">
              <div className="p-5 rounded-full w-min bg-primary">
                <FileStack size={48} className="text-accent"/>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-5"> Organize with 'Books'</h1>
                <p className="max-w-[500px]">Start by creating a ‘Book’. Enter a title and description, and let the AI recommend articles from Google Scholar and blogs to jumpstart your collection.</p>
              </div>
            </div>
            <div className="rounded bg-[#5C5C5C] shadow-lg md:self-start border-full border-8" style={{
              background:
                "linear-gradient(180deg, var(--neutral-800), var(--neutral-900)",
            }}>
              <Image src="/multiplePdfs.png" width={500} height={300} alt={"GnoVistar PDF"} className="rounded"/>
            </div>
          </div>
          <div className="flex-col md:flex-row flex justify-center items-center py-5 gap-5 md:flex-row-reverse">
            <div className="md:self-start flex-col flex gap-10 px-5">
              <div className="p-5 rounded-full w-min bg-primary">
                <PenTool size={48} className="text-accent"/>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-5">Engage with PDFs</h1>
                <p className="max-w-[500px]">Upload PDFs based on AI suggestions, and make them your own by highlighting, adding notes, and commenting directly on the documents.</p>
              </div>
            </div>
            <div className="rounded bg-[#5C5C5C] shadow-lg md:self-start border-full border-8" style={{
              background:
                "linear-gradient(180deg, var(--neutral-800), var(--neutral-900)",
            }}>
              <Image src="/pdf1.png" width={500} height={300} alt={"GnoVistar PDF"} className="rounded"/>
            </div>
          </div>
          <div className="flex-col md:flex-row flex justify-center items-center py-5 gap-5">
            <div className="md:self-start flex-col flex gap-10 px-5">
              <div className="p-5 rounded-full w-min bg-primary">
              <Bot size={48} className="text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-5">AI-Generated Summaries</h1>
                <p className="max-w-[500px]">Automatically receive summaries and key insights from your PDFs, helping you understand and manage your documents more effectively.</p>
              </div>
            </div>
            <div className="shadow-lg rounded bg-[#5C5C5C] md:self-start border-full border-8" style={{
              background:
                "linear-gradient(180deg, var(--neutral-800), var(--neutral-900)",
            }}>
              <Image src="/pdf2.png" width={500} height={300} alt={"GnoVistar PDF"} className="rounded"/>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Simple Pricing
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the plan that fits your needs
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3 md:gap-8">
              <PricingCard
                title="Free"
                price="$0"
                description="For individuals just getting started"
                features={[
                  "Basic PDF viewing and annotation",
                  "Basic AI Summarization",
                  "1 Book Limit"
                ]}
                buttonText="Get Started"
              />
              <PricingCard
                title="Basic"
                price="$4.99"
                description="For serious readers and students"
                features={[
                  "Basic PDF viewing and annotation",
                  "Advanced AI Summarization",
                  "3 Book Limit",
                  "AI Suggestions and links to articles"
                ]}
                buttonText="Choose Basic"
                highlighted={true}
              />
              <PricingCard
                title="Pro"
                price="$9.99"
                description="For power users and professionals"
                features={[
                  "Basic PDF viewing and annotation",
                  "Advanced AI Summarization",
                  "10 Book Limit",
                  "AI Suggestions and links to articles",
                  "YouTube video recommendations"
                ]}
                buttonText="Choose Pro"
              />
            </div>
          </div>
        </section>
        <section className="w-full">
          <InfiniteMovingCardsDemo/>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Gnovistar Waitlist
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-center mb-12">
            Be the first to experience Gnovistar, the ultimate document management app for seamless PDF annotation, note-taking, and AI-driven insights—join our waitlist today for early access to exclusive productivity-enhancing features.
            </p>
            <div className="flex justify-center">
              <div className="flex gap-5">
                {isSignedIn ? (
                  <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-6 flex items-center space-x-4 animate-fade-in">
                    <CheckCircle className="w-8 h-8" />
                    <div>
                      <p className="text-xl font-semibold">You're on the waitlist!</p>
                      <p className="text-sm opacity-90">We'll notify you when it's your turn</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <SignedOut>
                      <SignInButton>
                        <Button className="font-bold text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 ease-in-out hover:scale-105">
                          Join the Waitlist
                        </Button>
                      </SignInButton>
                    </SignedOut>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center">
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-semibold">Gnovistar</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering PDF management with AI-driven insights.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-between items-center md:flex-col md:items-end md:justify-start">
            <div className="flex gap-4 text-muted-foreground">
              <Link className="hover:text-foreground transition-colors" href="https://github.com/kenyounot123/gnovistar-app">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">© 2024 Gnovistar. All rights reserved.</p>
          </div>
        </div>
        <div className="container flex flex-col gap-2 sm:flex-row py-6 items-center border-t">
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy Policy
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Cookie Policy
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground sm:ml-auto">
            Designed with ❤️ by Gnovistar Team
          </p>
        </div>
      </footer>
    </div>
  )
}

import { Link } from "react-router";
// import imageFull from "../../public/full.jpeg"
// import imageSide from "../../public/side.jpeg"
// import imageBlue from "../../public/blue.jpeg"
// import imageRed from "../../public/red.jpeg"
import selangor from "../../public/selangor.jpg"

import { HugeiconsIcon } from "@hugeicons/react"
import {ArrowRight,  Check, Clock, Heart, MapPin, MessageCircle, Phone, Sparkles, Star} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button";
import {Card,CardContent,CardFooter,CardHeader,CardTitle} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

import Header from "@/pages/layout/header";
import { usePackages } from "@/context/packageProvider";


export default function Home() {

  const packageData = usePackages()

  const packages = packageData?.data ?? []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>

        {/*HERO ATAU BANNER*/}

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-muted">
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Banner Image
            </div>
          </div>

          <div className="absolute inset-0 -z-10 bg-background/80" />

          <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center px-4 py-20">
            <div className="mx-auto max-w-3xl text-center">
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-2"
              >
                <HugeiconsIcon icon={Sparkles} strokeWidth={2} />
                Mini Pelamin & Event Decoration
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Mini Pelamin,
                <span className="block text-primary">
                  Untuk Hari Pertunangan Anda.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Dapatkan mini pelamin cantik dengan harga mesra poket untuk hari pertunangan anda untuk area KL dan Selangor
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button size="lg" >
                  <Link to="/signup" className="flex items-center">
                    Book Pelamin
                    <HugeiconsIcon icon={ArrowRight} strokeWidth={2} />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  
                >
                  <a href="#contact">
                    Hubungi Kami
                  </a>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Check} strokeWidth={2} />
                  

                  KL & Selangor
                </div>

                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Check} strokeWidth={2} />
                  Setup Pantas
                </div>

                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Check} strokeWidth={2} />
                  Design Kemas & Cantik
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*PACKAGES PART*/}
        <section
          id="packages"
          className="border-t bg-muted/30 py-20 sm:py-28"
        >
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                Pakej-Pakej Kami
              </Badge>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Pilih Pelamin Anda
              </h2>

              <p className="mt-4 text-muted-foreground">
                Pilih Design Yang Ikut Citarasa Korang. Untuk Sebarang Request Tambahan Jangan Segan-Segan untuk PM kami.
              </p>
            </div>

            <div className="mx-auto max-w-6xl px-10">
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent>
                  {packages.map((pkg) => 
                  {

                const image = pkg.documents?.[0];

                const imageUrl = image
                  ? `${import.meta.env.VITE_API_URL.replace("/api", "")}/storage/${image.path}`
                  : null;
                  return (
                    <CarouselItem
                      key={pkg.name}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="flex h-full flex-col overflow-hidden">
                        {/* Package image placeholder */}
                        <div className="aspect-[4/3] overflow-hidden bg-muted">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={pkg.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                              Package Image
                            </div>
                          )}
                        </div>

                        <CardHeader>
                          <div className="flex items-start justify-between gap-3">
                            <CardTitle className="text-xl">
                              {pkg.name}
                            </CardTitle>

                            {pkg.popular && (
                              <Badge>
                                Popular
                              </Badge>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="flex-1">
                          <p className="text-sm leading-6 text-muted-foreground">
                            {pkg.detail}
                          </p>

                          <div className="mt-6">
                            <span className="text-3xl font-bold">
                              {pkg.currency} {pkg.amount}
                            </span>
                          </div>
                        </CardContent>

                        <CardFooter>
                          <Button
                            className="w-full"
                            variant={
                              pkg.popular
                                ? "default"
                                : "outline"
                            }
                            
                          >
                            <Link to="/signup">
                              Enquire Now
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  )
                })}
                </CarouselContent>

                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </section>



        {/*COVER AREA MANA*/}
        <section className="py-20 sm:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border bg-card">
              <div className="grid md:grid-cols-2">
                <div className="flex min-h-[350px] items-center justify-center bg-muted text-muted-foreground">
                  <img src={selangor}></img>
                </div>

                <div className="flex flex-col justify-center p-8 sm:p-10">
                  <Badge
                    variant="secondary"
                    className="mb-4 w-fit"
                  >
                    <HugeiconsIcon icon={MapPin} strokeWidth={2} />
                    Service Area
                  </Badge>

                  <h2 className="text-3xl font-bold tracking-tight">
                    Serving KL & Selangor
                  </h2>

                  <p className="mt-4 leading-7 text-muted-foreground">
                    Our mini pelamin services are currently available
                    throughout Kuala Lumpur and Selangor.
                  </p>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <HugeiconsIcon icon={Check} strokeWidth={2} />
                      Kuala Lumpur
                    </div>

                    <div className="flex items-center gap-3">
                      <HugeiconsIcon icon={Check} strokeWidth={2} />
                      Petaling Jaya
                    </div>

                    <div className="flex items-center gap-3">
                      <HugeiconsIcon icon={Check} strokeWidth={2} />
                      Shah Alam
                    </div>

                    <div className="flex items-center gap-3">
                      <HugeiconsIcon icon={Check} strokeWidth={2} />
                      Subang Jaya
                    </div>

                    <div className="flex items-center gap-3">
                      <HugeiconsIcon icon={Check} strokeWidth={2} />
                      Puchong
                    </div>

                    <div className="flex items-center gap-3">
                      <HugeiconsIcon icon={Check} strokeWidth={2} />
                      And surrounding areas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*BAHAGIAN CTA*/}
        <section className="border-y bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-2xl">
              <HugeiconsIcon icon={Sparkles} strokeWidth={2} />

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to plan your special day?
              </h2>

              <p className="mt-4 text-primary-foreground/80">
                Browse our packages or get in touch with us to discuss
                your mini pelamin setup.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  
                >
                  <Link to="/signup">
                    View Packages
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  
                >
                  <a href="#contact">
                    Contact Us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        id="contact"
        className="border-t"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold">
                3 Sahabat Weddings
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                We offer budget-friendly mini pelamin for events in KL Selangor.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Quick Links
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                <a
                  href="#packages"
                  className="hover:text-foreground"
                >
                  Packages
                </a>

                <a
                  href="#contact"
                  className="hover:text-foreground"
                >
                  Contact
                </a>

                <Link
                  to="/login"
                  className="hover:text-foreground"
                >
                  Login
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">
                Contact Us
              </h3>

              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <a
                  href="tel:+60183924046"
                  className="flex items-center gap-3 hover:text-foreground"
                >
                  <HugeiconsIcon icon={Phone} strokeWidth={2} />
                  018-3924046
                </a>

                <a
                  href="https://wa.me/60183924046"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 hover:text-foreground"
                >
                  <HugeiconsIcon icon={MessageCircle} strokeWidth={2} />
                  WhatsApp
                </a>

                <div className="flex items-center gap-3">
                  <HugeiconsIcon icon={MapPin} strokeWidth={2} />
                  Kuala Lumpur & Selangor
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
            <p>
              © {new Date().getFullYear()} 3 Sahabat Weddings. All rights
              reserved.
            </p>

            <p>
              Made for your special moments.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
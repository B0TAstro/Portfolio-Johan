// app/about/page.tsx

import Image from "next/image";
import Link from "next/link";
import { getAbout } from "@/lib/sanity.query";
import { AboutType } from "@/types";
import { PortableText } from "@portabletext/react";
import { Carousel } from "../components/ui/carousel";

export default async function About() {
    const about: AboutType = await getAbout();

    return (
        <main className="relative min-h-screen px-6 md:px-12">
            <section className="flex flex-col md:flex-row gap-8 md:gap-12 mt-38 md:mt-46 items-stretch">
                <Carousel
                    slides={about.profileImages.map((img) => ({
                        src: img.url,
                        alt: img.alt ?? undefined,
                    }))}
                    autoPlay
                    autoPlayInterval={10000}
                />
                <div className="w-full h-full">
                    <h1 className="text-3xl md:text-5xl font-bold mb-6">{about.title}</h1>
                    <div className="prose prose-invert max-w-none text-base md:text-lg">
                        <PortableText value={about.description} />
                    </div>
                </div>
            </section>

            <section className="mt-12 md:mt-24">
                <h2 className="text-3xl md:text-5xl font-bold text-center">
                    {about.clientsSection.title}
                </h2>

                <div className="mt-6 md:mt-12 flex flex-col md:flex-row flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-14">
                    {about.clientsSection.clients?.map((client, index) => {
                        const Logo = (
                            <Image
                                src={client.url}
                                alt={client.alt || client.clientName || "Client logo"}
                                width={220}
                                height={120}
                                className="object-contain h-[50px] md:h-[70px] w-auto opacity-80 hover:opacity-100 transition-opacity"
                                loading="lazy"
                            />
                        );

                        return (
                            <div key={index} className="flex items-center justify-center">
                                {client.link ? (
                                    <Link
                                        href={client.link}
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                        aria-label={client.clientName || "Client website"}
                                    >
                                        {Logo}
                                    </Link>
                                ) : (
                                    Logo
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {about.sections?.map((section, index) => (
                <section key={index} className="mt-12 md:mt-24">
                    {section.title && (
                        <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 md:mb-12">
                            {section.title}
                        </h2>
                    )}

                    {section.images && section.images.length > 0 && (
                        <div
                            className={
                                section.images.length === 1
                                    ? "max-w-6xl mx-auto"
                                    : section.images.length === 2
                                        ? "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                                        : "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                            }
                        >
                            {section.images.map((image, imgIndex) => (
                                <div
                                    key={imgIndex}
                                    className="group relative w-full overflow-hidden rounded-xl"
                                >
                                    <div className="relative w-full aspect-[4/3] md:aspect-[16/10]">
                                        <Image
                                            src={image.url}
                                            alt={image.alt || `Section image ${imgIndex + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {section.content && (
                        <div className="prose prose-invert prose-lg max-w-3xl md:max-w-6xl mx-auto mt-6 md:mt-12">
                            <PortableText value={section.content} />
                        </div>
                    )}
                </section>
            ))}
        </main>
    );
}
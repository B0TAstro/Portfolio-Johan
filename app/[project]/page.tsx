// app/[project]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getSingleProject } from "@/lib/sanity.query";
import type { ProjectType } from "@/types";
import { PortableText } from "@portabletext/react";
import VideoWithHoverControls from "@/app/components/VideoWithHoverControls";
import FullscreenImage from "@/app/components/shared/FullscreenImage";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ project: string }>;
};

interface SanityBlock {
  children?: Array<{ text?: string }>;
}

const CATEGORY_LABEL: Record<string, string> = {
  photography: "Photography",
  "short-movie": "Short Movie",
  "client-project": "Client project",
  collaboration: "Collaboration",
  "art-project": "Art project",
  drone: "Drone",
  editing: "Editing",
  miscellaneaous: "Miscellaneaous",
};

function labelCategory(value?: string) {
  if (!value) return "";
  return CATEGORY_LABEL[value] ?? value;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.project;
  const project: ProjectType = await getSingleProject(slug);

  if (!project) {
    return { title: "Projet non trouvé", description: "Ce projet n'existe pas ou a été supprimé." };
  }

  const description =
    Array.isArray(project.description) && project.description.length > 0
      ? (project.description[0] as SanityBlock)?.children?.[0]?.text || project.title
      : project.title;

  const imageUrl =
    project.coverMedia?.type === "image"
      ? project.coverMedia.image?.url
      : undefined;

  return {
    title: `${project.title} | Portfolio`,
    description,
    openGraph: { images: imageUrl ? [imageUrl] : [], title: project.title, description },
  };
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.project;
  const project: ProjectType = await getSingleProject(slug);

  if (!project) notFound();

  const categoryLabel = labelCategory(project.category);

  return (
    <main className="relative min-h-screen px-6 md:px-12">
      <Link
        href="/"
        className="group mt-38 mb-4 md:mt-46 md:mb-8 inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors "
      >
        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to home
      </Link>

      <div className="relative w-full h-[200px] md:h-[600px] overflow-hidden">
        {project.coverMedia?.type === "video" && project.coverMedia.video?.url ? (
          <VideoWithHoverControls
            src={project.coverMedia.video.url}
            className="object-cover w-full h-full"
          />
        ) : (
          <FullscreenImage
            src={project.coverMedia?.image?.url}
            alt={project.coverMedia?.image?.alt || project.title}
            className="w-full h-full"
            imageClassName="object-cover"
            priority
            loading="lazy"
          />
        )}
      </div>

      <div className="text-center md:text-left mt-4 mb-6 md:mt-8 md:mb-12">
        <h1 className="text-2xl md:text-5xl font-black uppercase">{project.title}</h1>
        {categoryLabel && (
          <p className="text-[16px] md:text-2xl font-bold">{categoryLabel}</p>
        )}
      </div>

      {project.description && (
        <section className="mb-6 md:mb-12">
          <div className="flex items-center gap-2">
            <span className="text-[16px] md:text-2xl">→</span>
            <h2 className="text-[16px] md:text-2xl font-bold">A few words about the project.</h2>
          </div>
          <div className="prose prose-invert prose-lg max-w-none">
            <PortableText value={project.description} />
          </div>
        </section>
      )}

      {project.gallery && project.gallery.length > 0 && (
        <section className="text-center md:text-left">
          <h2 className="text-[16px] md:text-2xl font-bold mb-3 md:mb-6">Visual vignettes</h2>

          <div className="space-y-6 md:space-y-12">
            {project.gallery.map((item, index) => (
              <div
                key={index}
                className="group relative h-[200px] md:h-[600px] overflow-hidden"
              >
                {item.type === "video" && item.video?.url ? (
                  <VideoWithHoverControls
                    src={item.video.url}
                    className="object-cover w-full h-full"
                  />
                ) : item.image?.url ? (
                  <FullscreenImage
                    src={item.image.url}
                    alt={item.image.alt || "Image Gallery"}
                    caption={item.image.caption}
                    className="w-full h-full"
                    imageClassName="object-cover transition-transform duration-350 group-hover:scale-101"
                    loading="lazy"
                  />
                ) : null}

                {(item.image?.caption) && (
                  <div className="absolute z-1 pointer-events-none inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250 ease-out">
                    <p className="text-sm p-6 pb-6">
                      {item.image?.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
"use client";

import Image from "next/image";

interface OurStoryGalleryProps {
  galleryRef: React.RefObject<HTMLDivElement | null>;
}

export function OurStoryGallery({ galleryRef }: OurStoryGalleryProps) {
  return (
    <section ref={galleryRef} className="py-20 px-6 container mx-auto max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {/* Item 1 */}
        <div className="gallery-item group relative overflow-hidden rounded-xl aspect-4/3 shadow-md border border-neutral-main/10">
          <Image
            src="/images/joss_paper.png"
            alt="Authentic Joss Paper"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Item 2 */}
        <div className="gallery-item group relative overflow-hidden rounded-xl aspect-4/3 shadow-md border border-neutral-main/10 sm:translate-y-8">
          <Image
            src="/images/deity_offering_set.png"
            alt="Deity Offering Set"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Item 3 */}
        <div className="gallery-item group relative overflow-hidden rounded-xl aspect-4/3 shadow-md border border-neutral-main/10">
          <Image
            src="/images/aromatic_wood_powder.png"
            alt="Aromatic Wood Powder"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Item 4 */}
        <div className="gallery-item group relative overflow-hidden rounded-xl aspect-4/3 shadow-md border border-neutral-main/10 sm:translate-y-8">
          <Image
            src="/images/sandalwood_incense.png"
            alt="Sandalwood Incense"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}

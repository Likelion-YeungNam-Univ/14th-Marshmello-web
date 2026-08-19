type TimelineImageSectionProps = {
  title: string
  imageUrl: string | null
}

export function TimelineImageSection({
  title,
  imageUrl,
}: TimelineImageSectionProps) {
  return (
    <section className="bg-white px-[44px] pb-[49px] pt-[48px]">
      <h2 className="text-[16px] font-medium tracking-[-0.16px] text-black">
        {title}
      </h2>

      <div className="mt-[13px] h-[270px] w-full overflow-hidden rounded-[5px] bg-[#d9d9d9]">
        {imageUrl ? (
          <img
            alt={title}
            className="h-full w-full object-cover"
            src={imageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[13px] text-[#8c8c8c]">
            이미지를 불러오지 못했어요.
          </div>
        )}
      </div>
    </section>
  )
}
import type { TodayCareCardData } from "@/features/care/model/today-care-card"

type TodayCareCardProps = {
  card: TodayCareCardData
}

export function TodayCareCard({ card }: TodayCareCardProps) {
  return (
    <section
      aria-labelledby="today-care-card-title"
      className="relative mx-auto h-[458px] w-[341px]"
    >
      <div
        aria-hidden="true"
        className="absolute left-[6px] top-0 h-[449px] w-[329px] -rotate-[1.5deg] rounded-[50px] border-2 border-white bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4)_0%,rgba(200,238,231,0.7)_50%,#91ddcf_100%)] shadow-[inset_-5px_-5px_250px_rgba(255,255,255,0.02)]"
      />

      <article className="absolute left-[4px] top-[5px] h-[449px] w-[329px] overflow-hidden rounded-[50px] border-2 border-white bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4)_0%,rgba(200,238,231,0.7)_50%,#91ddcf_100%)] shadow-[5px_5px_4px_rgba(255,255,255,0.1),inset_-5px_-5px_250px_rgba(255,255,255,0.02)]">
        <h1
          className="absolute inset-x-5 top-[55px] text-center text-[20px] leading-[1.4] font-semibold tracking-[-0.01em]"
          id="today-care-card-title"
        >
          {card.title}
        </h1>

        <p className="absolute inset-x-[55px] top-[118px] text-center text-[14px] leading-[1.4] tracking-[-0.02em]">
          {card.tip.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </p>

        <p className="absolute inset-x-[30px] top-[174px] text-center text-[11px] leading-[1.4] tracking-[-0.02em] text-[#484c52]">
          {card.description.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </p>

        {card.source ? (
          <p className="absolute inset-x-5 top-[338px] text-center text-[11px] leading-[1.4] tracking-[-0.02em] text-[#484c52]">
            (출처: {card.source})
          </p>
        ) : null}
      </article>
    </section>
  )
}

import { CalendarDays, Check, Search } from "lucide-react";

type PopularPost = {
  title: string;
  image: string;
};

type BlogDetailTemplateProps = {
  heroTitle: string;
  heroSubtitle: string;
  image: string;
  title: string;
  intro: string;
  popularPosts: PopularPost[];
};

const detailParagraphOne =
  "Coping with grief is a profoundly personal journey, and understanding the stages of loss can provide a valuable framework for healing. Psychologist Elisabeth Kubler-Ross identified five stages of grief: Denial, Anger, Bargaining, Depression, and Acceptance. These stages offer insight into the range of emotions one may experience after a significant loss. In the Denial stage, individuals may feel numb or shocked as they gradually accept the reality of their loss. Anger may then arise, often directed at oneself, others, or the situation, allowing the release of intense emotions.";

const detailParagraphTwo =
  "Bargaining follows, marked by 'what-ifs' and attempts to understand or alter the outcome, often accompanied by feelings of guilt. In the Depression stage, deep sadness and isolation may set in as one fully confronts the void left by the loss. Finally, Acceptance emerges.";

const detailParagraphThree =
  "Navigating these stages is rarely linear, and it's natural to revisit them or experience them in a different order. Recognizing these emotions as part of the healing process, along with seeking support, can provide comfort and resilience during the difficult journey through grief.";

const processItems = [
  "Initial Assessment and Rapport Building",
  "Goal Setting and Treatment Planning",
  "Exploration and Insight Development",
  "Skill Building and Strategy Implementation",
  "Termination and Maintenance Planning",
];

export default function BlogDetailTemplate({
  heroTitle,
  heroSubtitle,
  image,
  title,
  intro,
  popularPosts,
}: BlogDetailTemplateProps) {
  return (
    <div className="bg-white">
      <section className="bg-[#1f4d3a] pt-28 sm:pt-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="h-[170px] sm:h-[210px]" />
          <div className="max-w-[460px] rounded-t-xl bg-white px-6 py-7 shadow-[0_12px_30px_rgba(0,0,0,0.08)] sm:px-10">
            <h1 className="font-serif text-[2rem] leading-none text-[#0e2207] sm:text-[3.125rem]">
              {heroTitle}
            </h1>
            <p className="mt-3 text-sm font-semibold text-[#1f6306]">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 pt-12 sm:pb-24 lg:pt-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,850px)_340px] xl:gap-14">
            <article className="max-w-[850px]">
              <div className="mb-3 flex gap-[2px]">
                <span className="h-[2px] w-[44px] bg-[#1f4d3a]" />
                <span className="h-[2px] w-[44px] bg-[#d8d6d1]" />
                <span className="h-[2px] w-[44px] bg-[#d8d6d1]" />
                <span className="h-[2px] w-[44px] bg-[#d8d6d1]" />
                <span className="h-[2px] w-[44px] bg-[#d8d6d1]" />
                <span className="h-[2px] w-[44px] bg-[#d8d6d1]" />
              </div>

              <div className="overflow-hidden rounded-[20px]">
                <img
                  src={image}
                  alt={title}
                  className="h-[250px] w-full object-cover sm:h-[360px] lg:h-[416px]"
                />
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-[#111214]">
                <CalendarDays size={14} className="text-[#1f4d3a]" />
                <span>October 19, 2022</span>
              </div>

              <h2 className="mt-4 font-serif text-[2rem] leading-tight text-black sm:text-[3.125rem] sm:leading-[1.2]">
                {title}
              </h2>

              <p className="mt-4 text-sm font-semibold leading-[1.625rem] text-[#1f4d3a]">
                {intro}
              </p>

              <p className="mt-6 text-[15px] leading-[1.625rem] text-[#1f4d3a]">
                {detailParagraphOne}
              </p>

              <p className="mt-6 text-[15px] leading-[1.625rem] text-[#1f4d3a]">
                {detailParagraphTwo}
              </p>

              <div className="mt-6 rounded-[5px] bg-[#f1f5eb] p-6">
                <p className="text-[15px] leading-[1.625rem] text-[#141417]">
                  This is thanks to their outstanding service, competitive
                  pricing, and exceptional customer support. It's truly
                  refreshing to experience such a personal touch.
                </p>
                <p className="mt-5 text-[19px] font-medium leading-6 text-[#1f4d3a]">
                  Robert Denbhai
                </p>
              </div>

              <p className="mt-6 text-[15px] leading-[1.625rem] text-[#1f4d3a]">
                {detailParagraphThree}
              </p>

              <h3 className="mt-10 text-[31px] font-medium leading-10 text-[#121212]">
                Our Work Process
              </h3>

              <p className="mt-4 text-[15px] leading-[1.625rem] text-[#1f4d3a]">
                The psychology counseling process is a structured yet flexible
                approach that aims to help individuals explore their thoughts,
                emotions, and behaviors to foster growth, healing, and positive
                change. Here is an overview of the typical steps involved in the
                counseling process. Each of these steps is designed to adapt to
                the client's unique journey, ensuring that counseling remains a
                supportive.
              </p>

              <ul className="mt-6 space-y-3">
                {processItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-[#1f4d3a]">
                    <Check size={15} className="shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <aside className="space-y-6">
              <div className="rounded-[20px] bg-white p-6 shadow-[0_0_60px_rgba(0,0,0,0.05)]">
                <h3 className="text-[1.375rem] font-bold leading-[30px] text-[#1f4d3a]">
                  Search Here
                </h3>
                <label className="mt-6 flex items-center rounded-full border border-[#e3dbd8] px-4 py-3 text-[#727272]">
                  <input
                    type="text"
                    placeholder="Search.."
                    className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[#b4b4b4]"
                  />
                  <Search size={16} className="text-[#1f4d3a]" />
                </label>
              </div>

              <div className="rounded-[20px] bg-white p-6 shadow-[0_0_60px_rgba(0,0,0,0.05)]">
                <h3 className="text-[1.375rem] font-bold leading-[30px] text-[#1f4d3a]">
                  Popular Post
                </h3>
                <div className="mt-6 space-y-5">
                  {popularPosts.map((post) => (
                    <article key={post.title} className="flex items-center gap-4">
                      <div className="h-[85px] w-20 overflow-hidden rounded-[20px] bg-[#d9d9d9]">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[#727272]">
                          <CalendarDays size={13} className="text-[#1f4d3a]" />
                          <span>October 19, 2022</span>
                        </div>
                        <p className="mt-2 text-[1.05rem] font-semibold leading-7 text-[#1f4d3a]">
                          {post.title}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

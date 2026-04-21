import { Lightbulb } from "lucide-react";

const prompts = [
  "What inspired your wellness journey?",
  "How has buckwheat helped your routine?",
  "What would you like the community to learn?",
];

export default function WritingInspirationCard() {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
      <h2 className="text-lg font-bold text-[#06402B]">Writing Inspiration</h2>
      <div className="mt-4 space-y-3">
        {prompts.map((prompt) => (
          <div key={prompt} className="flex gap-3 rounded-lg border border-[#E5E7EB] bg-white p-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#A88751]" />
            <p className="text-sm leading-5 text-[#374151]">{prompt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

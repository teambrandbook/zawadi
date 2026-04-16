import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function CreateUserSection({ title, children }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-[#9F8151]" />
        <h3 className="text-xl font-semibold text-[#0A4833]">{title}</h3>
      </div>
      {children}
    </section>
  );
}

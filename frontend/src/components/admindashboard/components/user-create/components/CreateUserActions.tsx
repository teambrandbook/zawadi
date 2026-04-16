import { useRouter } from "next/navigation";

type Props = {
  onCreate: () => void;
};

export default function CreateUserActions({ onCreate }: Props) {
  const router = useRouter();

  return (
    <div className="sticky bottom-4 z-10 flex justify-end gap-3 rounded-lg bg-white/90 p-3 backdrop-blur">
      <button type="button" onClick={() => router.back()} className="rounded-md bg-[#A88751] px-6 py-2 text-sm text-white hover:bg-[#8F7348]">
        Cancel
      </button>
      <button type="button" onClick={onCreate} className="rounded-md bg-[#0A4833] px-6 py-2 text-sm text-white hover:bg-[#083927]">
        Create User
      </button>
    </div>
  );
}

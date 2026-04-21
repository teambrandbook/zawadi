import { Edit3, Eye, FileText } from "lucide-react";
import type { BlogStatus } from "./blogTypes";

type Props = {
  status: BlogStatus;
};

export default function BlogActions({ status }: Props) {
  if (status === "completed") {
    return (
      <>
        <button className="text-[#06402B]" aria-label="View published blog">
          <Eye className="h-4 w-4" />
        </button>
        <button className="text-[#06402B]" aria-label="Edit published blog">
          <Edit3 className="h-4 w-4" />
        </button>
      </>
    );
  }

  if (status === "continue_writing") {
    return (
      <>
        <button className="text-[#06402B]" aria-label="Continue writing blog">
          <Edit3 className="h-4 w-4" />
        </button>
        <button className="text-[#EF4444]" aria-label="Remove draft">
          <FileText className="h-4 w-4" />
        </button>
      </>
    );
  }

  return (
    <>
      <button className="text-[#06402B]" aria-label="View pending blog">
        <Eye className="h-4 w-4" />
      </button>
      <button className="text-[#06402B]" aria-label="Edit pending blog">
        <Edit3 className="h-4 w-4" />
      </button>
    </>
  );
}

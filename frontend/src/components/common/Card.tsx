import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
}

const Card = ({ title, description, icon, className, delay = 0 }: CardProps) => {
  return (
    <div
      className={cn(
        "gsap-reveal glass-morphism p-8 rounded-3xl group hover:bg-brand-primary/5 transition-all duration-500",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-foreground/60 leading-relaxed">{description}</p>
    </div>
  );
};

export default Card;

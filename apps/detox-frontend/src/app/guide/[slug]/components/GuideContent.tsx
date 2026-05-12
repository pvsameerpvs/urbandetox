"use client";

import { motion } from "framer-motion";

interface GuideContentProps {
  content: string;
}

export function GuideContent({ content }: GuideContentProps) {
  const blocks = content.split("\n\n");

  return (
    <article className="max-w-none">
      {blocks.map((paragraph, i) => {
        const trimmed = paragraph.trim();

        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return (
            <motion.h3
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-2xl font-bold mt-10 sm:mt-12 mb-4 text-foreground"
            >
              {trimmed.replace(/\*\*/g, "")}
            </motion.h3>
          );
        }

        if (trimmed.startsWith("- ")) {
          const lines = trimmed.split("\n").filter((l) => l.trim());
          return (
            <motion.ul
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="my-5 space-y-2.5"
            >
              {lines.map((line, j) => (
                <li key={j} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  {line.replace("- ", "")}
                </li>
              ))}
            </motion.ul>
          );
        }

        if (trimmed.startsWith("**Our recommendation:**") || trimmed.startsWith("**Best for:**") || trimmed.startsWith("**The main difference:**")) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="my-6 rounded-xl bg-brand/[0.04] border border-brand/10 p-5 sm:p-6"
            >
              <p className="text-sm sm:text-base text-foreground leading-relaxed font-medium">
                {trimmed.replace(/\*\*/g, "")}
              </p>
            </motion.div>
          );
        }

        return (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="text-sm sm:text-base text-muted-foreground leading-[1.8] mb-5"
          >
            {trimmed}
          </motion.p>
        );
      })}
    </article>
  );
}

"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export function Specifications({ specs }: { specs: { group: string; items: string[] }[] }) {
  return (
    <Accordion.Root type="multiple" defaultValue={[specs[0]?.group]} className="border-t border-sand">
      {specs.map((s) => (
        <Accordion.Item key={s.group} value={s.group} className="border-b border-sand">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between py-5 text-left font-[family-name:var(--font-display)] text-2xl">
              {s.group}
              <Plus aria-hidden className="size-5 text-brass-deep transition-transform duration-300 group-data-[state=open]:rotate-45" strokeWidth={1.5} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[fadeIn_.2s_ease_reverse]">
            <ul className="space-y-2 pb-6 text-muted">
              {s.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-brass" />
                  {item}
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ProjectRow = {
  name: string;
  client: string;
  tag: string;
  created: string;
  generations: number;
};

const DATA: ProjectRow[] = [
  { name: "Project Alpha",  client: "Client A", tag: "Social Media",     created: "2024-01-15", generations: 120 },
  { name: "Project Beta",   client: "Client B", tag: "Website",          created: "2024-02-20", generations: 85  },
  { name: "Project Gamma",  client: "Client C", tag: "Email Marketing",  created: "2024-03-10", generations: 150 },
  { name: "Project Delta",  client: "Client D", tag: "Advertising",      created: "2024-04-05", generations: 95  },
  { name: "Project Epsilon",client: "Client E", tag: "Content Creation", created: "2024-05-01", generations: 110 },
];

export default function ProjectsTable() {
  return (
    <section className="w-full bg-nano-deep-950 text-nano-white">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 pt-6 pb-10">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Projects</h2>

        {/* Table container w/ rounded corners + subtle border to match mock */}
        <div className="overflow-hidden rounded-lg ring-1 ring-nano-deep-900/80">
          <Table className="[&_th]:text-left">
            <TableHeader className="bg-transparent">
              <TableRow className="border-0 border-b border-nano-deep-900/80">
                <TableHead className="h-12 px-6 text-[13px] font-semibold text-nano-gray-100">
                  Project
                </TableHead>
                <TableHead className="px-6 text-[13px] font-semibold text-nano-gray-100">
                  Client/Site
                </TableHead>
                <TableHead className="px-6 text-[13px] font-semibold text-nano-gray-100">
                  Service Tags
                </TableHead>
                <TableHead className="px-6 text-[13px] font-semibold text-nano-gray-100">
                  Created
                </TableHead>
                <TableHead className="px-6 text-[13px] font-semibold text-nano-gray-100">
                  Generations
                </TableHead>
                <TableHead className="px-6 text-[13px] font-semibold text-nano-gray-100">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {DATA.map((row, idx) => (
                <ProjectsRow key={row.name} row={row} isLast={idx === DATA.length - 1} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}

function ProjectsRow({
  row,
  isLast,
}: {
  row: ProjectRow;
  isLast?: boolean;
}) {
  return (
    <TableRow
      className={cn(
        "border-0",
        !isLast && "border-b border-nano-deep-900/80"
      )}
    >
      {/* match generous row height + left padding */}
      <TableCell className="h-[76px] px-6 align-middle text-[14px] text-white">
        {row.name}
      </TableCell>

      <TableCell className="px-6 align-middle text-[14px] text-nano-mint/85">
        {row.client}
      </TableCell>

      <TableCell className="px-6 align-middle">
        <span className="inline-flex items-center rounded-full bg-nano-forest-800 px-3 py-1 text-[13px] font-semibold text-nano-gray-100">
          {row.tag}
        </span>
      </TableCell>

      <TableCell className="px-6 align-middle text-[14px] text-nano-gray-100/90">
        {row.created}
      </TableCell>

      <TableCell className="px-6 align-middle text-[14px] text-nano-gray-100/90">
        {row.generations}
      </TableCell>

      <TableCell className="px-6 align-middle">
        <div className="text-right md:text-left">
          <a
            href="#"
            className="block text-[13px] font-semibold text-nano-gray-100 hover:underline"
          >
            View Project
          </a>
          <span className="block text-[13px] font-semibold text-nano-gray-100">
            |{" "}
            <a href="#" className="hover:underline">
              Archive Project
            </a>
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
}

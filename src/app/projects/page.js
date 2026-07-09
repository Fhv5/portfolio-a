import { ProjectsClient } from "@/components/ProjectsClient";

export const metadata = {
  title: "Proyectos | Fabián Henry",
  description: "Catálogo completo de proyectos técnicos y casos de estudio de Fabián Henry, Ingeniero Civil en Informática.",
};

export default function ProjectsPage() {
  return (
    <main className="flex flex-col min-h-screen pt-24 px-6 lg:px-8">
      <section className="max-w-5xl mx-auto w-full pb-12">
        <ProjectsClient />
      </section>
    </main>
  );
}

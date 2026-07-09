import { ProjectsClient } from "@/components/ProjectsClient";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return {
    title: dict.projects.pageTitle + " | Fabián Henry",
    description: dict.projects.pageSubtitle,
  };
}

export default function ProjectsPage() {
  return (
    <main className="flex flex-col min-h-screen pt-24 px-6 lg:px-8">
      <section className="max-w-5xl mx-auto w-full pb-12">
        <ProjectsClient />
      </section>
    </main>
  );
}

import { listarSetores } from "@/app/actions";
import RegistroForm from "@/app/registro-form";

export const dynamic = "force-dynamic";

export default async function Home() {
  const setores = await listarSetores();

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
      <div className="rounded-card bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-medium uppercase tracking-wide text-colibri-green">
          Programa Ideia de Melhoria
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-colibri-ink">
          Tudo começa com uma ideia
        </h1>
        <p className="mt-3 text-sm text-colibri-ink/70">
          Leva menos de dois minutos. Conte o problema que você percebeu e o
          que você propõe para resolver — o resto a gente cuida.
        </p>

        <div className="mt-8">
          <RegistroForm setores={setores} />
        </div>
      </div>
    </main>
  );
}

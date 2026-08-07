"use client";

import { useRef, useState, useTransition } from "react";
import { registrarIdeia, type Setor } from "@/app/actions";

export default function RegistroForm({ setores }: { setores: Setor[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<
    { codigo: string; carimbada: boolean } | null
  >(null);

  function onSubmit(formData: FormData) {
    setErro(null);
    startTransition(async () => {
      const res = await registrarIdeia(formData);
      if (!res.ok) {
        setErro(res.erro);
        return;
      }
      setResultado({ codigo: res.codigo, carimbada: res.carimbada });
      formRef.current?.reset();
    });
  }

  if (resultado) {
    return (
      <div className="rounded-card bg-colibri-greenLight p-6 text-colibri-greenDark">
        <p className="text-sm font-medium uppercase tracking-wide">
          Ideia registrada
        </p>
        <p className="mt-2 text-2xl font-semibold">{resultado.codigo}</p>
        <p className="mt-3 text-sm">
          {resultado.carimbada
            ? "Sua ideia recebeu o carimbo de validação e já vai para avaliação."
            : "Sua ideia foi registrada, mas o problema ou a solução ficaram curtos demais para receber o carimbo. Registre uma nova ideia com mais detalhes."}
        </p>
        <button
          type="button"
          onClick={() => setResultado(null)}
          className="mt-6 rounded-full bg-colibri-green px-5 py-2 text-sm font-medium text-white transition hover:bg-colibri-greenDark"
        >
          Registrar outra ideia
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={onSubmit} className="flex flex-col gap-5">
      <Field label="Nome completo" htmlFor="nome">
        <input
          id="nome"
          name="nome"
          type="text"
          required
          className="input"
          placeholder="Seu nome"
        />
      </Field>

      <Field label="Setor / Departamento" htmlFor="setor_id">
        <select id="setor_id" name="setor_id" required defaultValue="" className="input">
          <option value="" disabled>
            Selecione seu setor
          </option>
          {setores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Problema identificado" htmlFor="problema">
        <textarea
          id="problema"
          name="problema"
          required
          rows={3}
          className="input"
          placeholder="O que você percebeu que poderia melhorar?"
        />
      </Field>

      <Field label="Proposta de solução" htmlFor="solucao">
        <textarea
          id="solucao"
          name="solucao"
          required
          rows={3}
          className="input"
          placeholder="Como você resolveria isso?"
        />
      </Field>

      {erro && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-colibri-green px-5 py-3 text-sm font-medium text-white transition hover:bg-colibri-greenDark disabled:opacity-60"
      >
        {isPending ? "Enviando..." : "Registrar ideia"}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 10px;
          border: 1px solid rgba(22, 36, 30, 0.15);
          background: white;
          padding: 0.65rem 0.85rem;
          font-size: 0.95rem;
          color: #16241e;
        }
        .input:focus {
          border-color: #1f6f54;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-colibri-ink/80">{label}</span>
      {children}
    </label>
  );
}

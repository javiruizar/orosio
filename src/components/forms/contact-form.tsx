"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/get-dictionary";

const fieldClass =
  "w-full rounded-lg border border-arena bg-white px-4 py-2.5 text-carbon placeholder:text-granito focus:border-terracota-600 focus:outline-none";

const labelClass = "mb-1.5 block text-sm font-medium text-carbon";

/**
 * En esta fase el formulario es solo maquetación: no envía nada de verdad.
 * La Server Action y la validación llegan en la fase 3.
 */
export function ContactForm({ dict }: { dict: Dictionary }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p role="status" className="rounded-lg border border-arena bg-white p-5 text-carbon">
        {dict.contact.notWorking}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="nombre" className={labelClass}>
          {dict.contact.name}
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          placeholder={dict.contact.placeholderName}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          {dict.contact.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={dict.contact.placeholderEmail}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="telefono" className={labelClass}>
          {dict.contact.phone}
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          placeholder={dict.contact.placeholderPhone}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="fechas" className={labelClass}>
          {dict.contact.dates}
        </label>
        <input
          id="fechas"
          name="fechas"
          type="text"
          placeholder={dict.contact.placeholderDates}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="huespedes" className={labelClass}>
          {dict.contact.guests}
        </label>
        <input id="huespedes" name="huespedes" type="number" min={1} max={4} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="mensaje" className={labelClass}>
          {dict.contact.message}
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          placeholder={dict.contact.placeholderMessage}
          className={fieldClass}
        />
      </div>

      <Button type="submit">{dict.contact.send}</Button>
    </form>
  );
}

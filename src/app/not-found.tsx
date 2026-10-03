import Link from "next/link";

export default function NotFound() {
  return <div className="flex min-h-[60vh] flex-col items-center justify-center text-center"><div className="font-serif text-8xl text-stone-300">404</div><h1 className="mt-4 font-serif text-3xl">Esta prenda ya no está en el perchero.</h1><p className="mt-2 text-sm text-stone-500">Puede que haya cambiado de lugar o que ya no exista.</p><Link href="/" className="store-button mt-6">Volver al inicio</Link></div>;
}

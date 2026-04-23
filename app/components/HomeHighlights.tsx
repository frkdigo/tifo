"use client";
import { motion } from "framer-motion";
type HighlightItem = {
  title: string;
  subtitle: string;
  text: string;
  featured?: boolean;
};

const items: HighlightItem[] = [
  {
    subtitle: "Kiemelt",
    title: "Közelgő programok",
    text: "Nézd meg a legközelebbi eseményünket, és jelezd, ha érdekel. Mindig frissítjük a részleteket.",
    featured: true,
  },
  {
    subtitle: "Közösség",
    title: "Posztolj és kapcsolódj",
    text: "Oszd meg a véleményed, képeid és ötleteid. A főoldalon a közösség tartalmai is megjelennek.",
  },
  {
    subtitle: "Csatlakozás",
    title: "Legyél aktív tag",
    text: "Ha szeretnél tenni Törökbálint fiataljaiért, lépj velünk kapcsolatba, és találkozzunk személyesen.",
  },
];

export default function HomeHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
      {items.map((item) => {
        const isFeatured = !!item.featured;
        return (
          <motion.article
            key={item.title}
            className={[
              "rounded-2xl border p-7 md:p-8 transition-all duration-300 flex flex-col shadow-[0_16px_40px_-18px_rgba(56,189,248,0.10)] hover:shadow-[0_24px_60px_-24px_rgba(56,189,248,0.18)] hover:scale-[1.025] focus-within:scale-[1.025]",
              isFeatured
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white/90 backdrop-blur-sm border-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-700",
            ].join(" ")}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            tabIndex={0}
          >
            <p className={[
              "text-xs uppercase tracking-wider font-semibold mb-2",
              isFeatured ? "text-slate-200" : "text-slate-500 dark:text-slate-300",
            ].join(" ")}>
              {item.subtitle}
            </p>
            <h3 className="text-xl md:text-2xl font-extrabold mb-2 leading-tight truncate" title={item.title}>{item.title}</h3>
            <p className={[
              "text-base leading-relaxed mb-2",
              isFeatured ? "text-slate-200" : "text-slate-600 dark:text-slate-200",
            ].join(" ")}>
              {item.text}
            </p>
              <div className={[
                "mt-4 h-1 rounded-full",
                isFeatured ? "bg-sky-300/70" : "bg-slate-200 dark:bg-slate-700",
              ].join(" ")} />
            </motion.article>
          );
        })}
      </div>
    );
}

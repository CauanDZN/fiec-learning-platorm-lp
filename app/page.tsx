"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Calendar, BookOpen, HelpCircle, FileText } from "lucide-react"
import Image from "next/image"

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Carregando…</div>}>
      <LearningPlatform />
    </Suspense>
  )
}

interface ModuleProgress { [key: string]: number }
interface User { name: string; isLoggedIn: boolean; id?: string }

interface ModuleInfo {
  exists: boolean
  sectionnum: number | null
  sectionid: number | null
  name: string | null
  open: boolean | null
  available: boolean | null
  availableinfo: string | null
  url: string | null
  tstart: number | null
  tend: number | null
  progress?: number | null
}
type ModKey = `modulo${1|2|3|4|5|6|7|8}`

interface CoursePayload {
  id: number
  name: string
  shortname: string
  modules: Record<ModKey, ModuleInfo | null>
  firstopen?: ModKey | null
}

interface ProgressParams {
  autoplay: boolean
  muted: boolean
  saveProgress: boolean
  hideControls: boolean
  restartAfterEnd: boolean
  showCaptions: boolean
  allowSkip: boolean
  trackTime: boolean
}

function LearningPlatform() {
  const searchParams = useSearchParams()

  const [user, setUser] = useState<User>({ name: "Nome do Usuário", isLoggedIn: false })
  const [payload, setPayload] = useState<CoursePayload | null>(null)
  const [progress, setProgress] = useState<ModuleProgress>({
    "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0,
  })
  const [progressParams] = useState<ProgressParams>({
    autoplay: true, muted: false, saveProgress: true, hideControls: false,
    restartAfterEnd: true, showCaptions: true, allowSkip: false, trackTime: true,
  })

  // ► Tudo que lê/parsa URL e seta estado fica dentro do useEffect
  useEffect(() => {
    const uid = searchParams.get("userid") ?? undefined
    const uname = searchParams.get("uname") ?? undefined
    if (uid || uname) {
      setUser(u => ({ ...u, isLoggedIn: true, id: uid ?? u.id, name: uname ?? u.name }))
    }

    const courseParam = searchParams.get("course")
    if (courseParam) {
      try { setPayload(JSON.parse(courseParam)); return } catch {}
      try { setPayload(JSON.parse(decodeURIComponent(courseParam))); return } catch {}
      console.warn("Falha ao decodificar 'course' em JSON; vou usar os params flat.")
    }

    const cid   = Number(searchParams.get("cid") ?? 0)
    const cn    = searchParams.get("cn")  ?? ""
    const csn   = searchParams.get("csn") ?? ""
    const foNum = Number(searchParams.get("fo") ?? 0)

    const flatModules: Record<ModKey, ModuleInfo | null> = {} as any
    const initialProgress: ModuleProgress = { "1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0 }

    for (let i = 1; i <= 8; i++) {
      const pfx = "m" + i

      const exists = searchParams.get(pfx + "e") === "1"
      if (!exists) { (flatModules as any)["modulo" + i] = null; continue }

      const openRaw   = searchParams.get(pfx + "o")
      const nameRaw   = searchParams.get(pfx + "n")
      const secRaw    = searchParams.get(pfx + "s")
      const secIdRaw  = searchParams.get(pfx + "i")
      const urlRaw    = searchParams.get(pfx + "u")
      const tStartRaw = searchParams.get(pfx + "ts")
      const tEndRaw   = searchParams.get(pfx + "te")
      const pRaw      = searchParams.get(pfx + "p") // progresso 0..100 (opcional)

      const progNum = pRaw !== null ? Number(pRaw) : null
      const prog = (progNum !== null && !Number.isNaN(progNum))
        ? Math.max(0, Math.min(100, progNum))
        : null

      if (prog !== null) {
        initialProgress[String(i)] = prog
      }

      const mod: ModuleInfo = {
        exists: true,
        open: openRaw === null ? null : openRaw === "1",
        available: null,
        availableinfo: null,
        name: nameRaw ?? null,
        sectionnum: secRaw !== null ? Number(secRaw) : null,
        sectionid: secIdRaw !== null ? Number(secIdRaw) : null,
        url: urlRaw ?? null,
        tstart: tStartRaw !== null ? Number(tStartRaw) : null,
        tend: tEndRaw !== null ? Number(tEndRaw) : null,
        progress: prog,
      }; // ← SEMICOLON OBRIGATÓRIO AQUI

      (flatModules as any)["modulo" + i] = mod; // ← e aqui também
    }

    setPayload({
      id: cid, name: cn, shortname: csn,
      modules: flatModules,
      firstopen: foNum >= 1 && foNum <= 8 ? ("modulo" + foNum as any) : null,
    })

    // Hidrata a barra de progresso com o que veio do Moodle
    setProgress(initialProgress)
  }, [searchParams])

  // Card metadata (visual)
  const modulesMeta = [
    { id: "1", title: "Módulo 1", subtitle: "Fundamentos de IA generativa", image: "/images/ai-fundamentals-premium.jpg", duration: "16h" },
    { id: "2", title: "Módulo 2", subtitle: "Governança e risco", image: "/images/governance-risk-new.jpg", duration: "16h" },
    { id: "3", title: "Módulo 3", subtitle: "Possibilidades tecnológicas", image: "/images/tech-possibilities-premium.jpg", duration: "16h" },
    { id: "4", title: "Módulo 4", subtitle: "Engenharia de prompts e padrões de saída", image: "/images/prompt-engineering-new.jpg", duration: "16h" },
    { id: "5", title: "Módulo 5", subtitle: "Agentes e automação de workflow", image: "/images/ai-agents-premium.jpg", duration: "16h" },
    { id: "6", title: "Módulo 6", subtitle: "IA no ecossistema corporativo", image: "/images/corporate-ecosystem-premium.jpg", duration: "16h" },
    { id: "7", title: "Módulo 7", subtitle: "Confiabilidade, vieses e segurança", image: "/images/ai-security-premium.jpg", duration: "16h" },
    { id: "8", title: "Módulo 8", subtitle: "Produtividade e colaboração com IA", image: "/images/ai-productivity-premium.jpg", duration: "16h" },
  ];

  const titleFromPayload = (id: string, fallback: string) => {
    const key = `modulo${Number(id)}` as ModKey;
    const n = payload?.modules?.[key]?.name;
    return (n && n.trim().length > 0) ? n : fallback;
  };

  // Desbloqueio: só bloqueia por janela de tempo OU por 'open=false' com motivo claro
  const isModuleUnlocked = (id: string) => {
    const key = `modulo${Number(id)}` as ModKey;
    const m = payload?.modules?.[key];
    if (!m || !m.exists) return false;

    const now = Math.floor(Date.now() / 1000);

    if (m.tstart !== null && now < m.tstart) return false;
    if (m.tend !== null && now >= m.tend) return false;

    if (m.open === true) return true;
    if (m.open === false) {
      const hasTimeRule = (m.tstart !== null || m.tend !== null);
      const hasReason = (m.available === false) || !!(m.availableinfo && m.availableinfo.trim());
      return !(hasTimeRule || hasReason);
    }

    return true;
  };

  const handleModuleClick = (moduleId: string) => {
    if (!isModuleUnlocked(moduleId)) return;
    const current = progress[moduleId];
    if (current < 100) {
      const next = Math.min(current + 25, 100);
      setProgress(p => ({ ...p, [moduleId]: next }));
      console.log("[Moodle/Next] Progresso", { moduleId, progress: next });
    }
  };

  const allModulesCompleted = Object.values(progress).every(p => p === 100);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero */}
      <section className="bg-gray-200 py-16 md:py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <motion.h2
              className="text-4xl md:text-6xl font-extrabold text-blue-600 mb-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            >
              Bem-vindo(a) ao seu espaço de aprendizado, {user.isLoggedIn ? user.name : "Nome do Usuário"}!
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-gray-700 mb-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            >
              {payload?.name
                ? <>Curso: <strong>{payload.name}</strong> ({payload.shortname})</>
                : "Aqui você pode acompanhar seu progresso no Programa de Cultura de IA - Sistema FIEC."}
            </motion.p>
          </div>
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Image src="/images/fiec-ia-logo.png" alt="FIEC +IA Logo" width={600} height={600} className="w-full max-w-lg" />
          </motion.div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.h3
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-600"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            Programa de Cultura de IA - Sistema FIEC
          </motion.h3>
          <motion.p
            className="text-center text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            16h de conteúdo gravado (online)
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: "1", title: "Módulo 1", subtitle: "Fundamentos de IA generativa", image: "/images/ai-fundamentals-premium.jpg", duration: "16h" },
              { id: "2", title: "Módulo 2", subtitle: "Governança e risco", image: "/images/governance-risk-new.jpg", duration: "16h" },
              { id: "3", title: "Módulo 3", subtitle: "Possibilidades tecnológicas", image: "/images/tech-possibilities-premium.jpg", duration: "16h" },
              { id: "4", title: "Módulo 4", subtitle: "Engenharia de prompts e padrões de saída", image: "/images/prompt-engineering-new.jpg", duration: "16h" },
              { id: "5", title: "Módulo 5", subtitle: "Agentes e automação de workflow", image: "/images/ai-agents-premium.jpg", duration: "16h" },
              { id: "6", title: "Módulo 6", subtitle: "IA no ecossistema corporativo", image: "/images/corporate-ecosystem-premium.jpg", duration: "16h" },
              { id: "7", title: "Módulo 7", subtitle: "Confiabilidade, vieses e segurança", image: "/images/ai-security-premium.jpg", duration: "16h" },
              { id: "8", title: "Módulo 8", subtitle: "Produtividade e colaboração com IA", image: "/images/ai-productivity-premium.jpg", duration: "16h" },
            ].map((module, index) => {
              const modKey = `modulo${module.id}` as ModKey;
              const m = payload?.modules?.[modKey];
              const isUnlocked = isModuleUnlocked(module.id);
              const moduleProgress = (m?.progress ?? progress[module.id]) || 0;
              const isCompleted = moduleProgress === 100;
              const displayTitle = titleFromPayload(module.id, module.title);
              const moduleUrl = m?.url || null;

              const wrapperClass = `relative block bg-white p-6 rounded-xl shadow-md transition-all duration-300 ${
                !isUnlocked ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl cursor-pointer"
              }`;

              const inner = (
                <>
                  <div className="absolute top-4 right-4 z-10">
                    {isCompleted ? (
                      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.4 }}>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </motion.div>
                    ) : !isUnlocked ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                        <Image src="/images/padlock-blue.png" alt="Locked" width={24} height={24} className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.3 }}>
                        <Image src="/images/padlock-unlocked.png" alt="Unlocked" width={24} height={24} className="w-6 h-6" />
                      </motion.div>
                    )}
                  </div>

                  <div className="mb-4">
                    <Image src={module.image || "/placeholder.svg"} alt={`Imagem do ${displayTitle}`} width={400} height={200} className="rounded-lg w-full h-32 object-cover" />
                  </div>

                  <h4 className={`text-2xl font-semibold mb-2 text-center transition-colors duration-300 ${isUnlocked ? "text-blue-600" : "text-gray-400"}`}>
                    {displayTitle}
                  </h4>
                  <p className="text-gray-600 text-center mb-4">{module.subtitle}</p>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 font-medium">{module.duration}</span>
                      <span className={`text-sm font-bold ${isCompleted ? "text-green-600" : "text-blue-600"}`}>
                        {moduleProgress}% Concluído
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full transition-all duration-1000 ${isCompleted ? "bg-green-500" : "bg-blue-600"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${moduleProgress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        data-autoplay={progressParams.autoplay}
                        data-muted={progressParams.muted}
                        data-save-progress={progressParams.saveProgress}
                        data-hide-controls={progressParams.hideControls}
                        data-restart-after-end={progressParams.restartAfterEnd}
                        data-show-captions={progressParams.showCaptions}
                        data-allow-skip={progressParams.allowSkip}
                        data-track-time={progressParams.trackTime}
                      />
                    </div>
                  </div>

                  {isUnlocked && moduleUrl && (
                    <div className="mt-4 text-center">
                      <span className="inline-block text-sm font-semibold underline">
                        Abrir no Moodle
                      </span>
                    </div>
                  )}
                </>
              );

              if (isUnlocked && moduleUrl) {
                return (
                  <motion.div key={module.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                    <a
                      href={moduleUrl}
                      target="_top"
                      rel="noopener noreferrer"
                      className={wrapperClass}
                      onClick={() => handleModuleClick(module.id)}
                      style={{ cursor: !isUnlocked ? "not-allowed" : "pointer" }}
                    >
                      {inner}
                    </a>
                  </motion.div>
                )
              }

              return (
                <motion.div key={module.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                  <div
                    className={wrapperClass}
                    onClick={() => isModuleUnlocked(module.id) && handleModuleClick(module.id)}
                    style={{ cursor: !isUnlocked ? "not-allowed" : "pointer" }}
                  >
                    {inner}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Seções adicionais (exemplo) */}
      <section className="py-12 px-4 md:px-8 bg-gray-200">
        <div className="container mx-auto max-w-7xl">
          <motion.h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-600" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Seções Adicionais
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center justify-items-center">
            {[
              { name: "Calendário", icon: Calendar, image: "/calendar-icon.png" },
              { name: "Exercícios Extras", icon: BookOpen, image: "/exercises-book-icon.jpg" },
              { name: "Tire Suas Dúvidas Aqui", icon: HelpCircle, image: "/help-support-icon.png" },
              { name: "Pesquisa Institucional", icon: FileText, image: "/institutional-survey-icon.jpg" },
            ].map((section, index) => {
              const allModulesCompleted = Object.values(progress).every(p => p === 100);
              const isLocked = section.name === "Pesquisa Institucional" && !allModulesCompleted;

              return (
                <motion.div
                  key={section.name}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={!isLocked ? { y: -5, scale: 1.05 } : {}}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                  className={`w-full max-w-xs bg-white p-6 rounded-xl shadow-md transition-all duration-300 flex flex-col items-center ${isLocked ? "opacity-60 cursor-not-allowed" : "hover:shadow-2xl cursor-pointer"}`}
                  style={{ cursor: isLocked ? "not-allowed" : "pointer" }}
                >
                  <div className="relative mb-4">
                    <Image src={section.image || "/placeholder.svg"} alt={`Ícone ${section.name}`} width={80} height={80} className="w-16 h-16 rounded-lg" />
                    {isLocked && (
                      <motion.div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                        <Image src="/images/padlock-blue.png" alt="Locked" width={20} height={20} className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>
                  <span className={`text-lg font-bold transition-colors duration-300 ${isLocked ? "text-gray-400" : "text-blue-600"}`}>
                    {section.name}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

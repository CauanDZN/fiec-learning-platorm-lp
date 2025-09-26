"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Calendar, BookOpen, HelpCircle, FileText } from "lucide-react"
import Image from "next/image"

interface ModuleProgress {
  [key: string]: number
}

interface User {
  name: string
  isLoggedIn: boolean
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

export default function LearningPlatform() {
  const [user, setUser] = useState<User>({ name: "Nome do Usuário", isLoggedIn: false })
  const [progress, setProgress] = useState<ModuleProgress>({
    "1": 100,
    "2": 75,
    "3": 50,
    "4": 25,
    "5": 10,
    "6": 0,
    "7": 0,
    "8": 0,
  })

  const [progressParams, setProgressParams] = useState<ProgressParams>({
    autoplay: true,
    muted: false,
    saveProgress: true,
    hideControls: false,
    restartAfterEnd: true,
    showCaptions: true,
    allowSkip: false,
    trackTime: true,
  })

  // Simulate user login
  useEffect(() => {
    // In a real app, this would come from authentication
    const loggedInUser = { name: "Maria Silva", isLoggedIn: true }
    setUser(loggedInUser)
  }, [])

  const modules = [
    {
      id: "1",
      title: "Módulo 1",
      subtitle: "Fundamentos de IA generativa",
      image: "/images/ai-fundamentals-premium.jpg", // Updated to new premium gradient image
      duration: "16h",
    },
    {
      id: "2",
      title: "Módulo 2",
      subtitle: "Governança e risco",
      image: "/images/governance-risk-new.jpg", // Updated to use new custom gradient image
      duration: "16h",
    },
    {
      id: "3",
      title: "Módulo 3",
      subtitle: "Possibilidades tecnológicas",
      image: "/images/tech-possibilities-premium.jpg", // Updated to new premium gradient image
      duration: "16h",
    },
    {
      id: "4",
      title: "Módulo 4",
      subtitle: "Engenharia de prompts e padrões de saída",
      image: "/images/prompt-engineering-new.jpg", // Updated to use new custom gradient image
      duration: "16h",
    },
    {
      id: "5",
      title: "Módulo 5",
      subtitle: "Agentes e automação de workflow",
      image: "/images/ai-agents-premium.jpg", // Updated to new premium gradient image
      duration: "16h",
    },
    {
      id: "6",
      title: "Módulo 6",
      subtitle: "IA no ecossistema corporativo",
      image: "/images/corporate-ecosystem-premium.jpg", // Updated to new premium gradient image
      duration: "16h",
    },
    {
      id: "7",
      title: "Módulo 7",
      subtitle: "Confiabilidade, vieses e segurança",
      image: "/images/ai-security-premium.jpg", // Updated to new premium gradient image
      duration: "16h",
    },
    {
      id: "8",
      title: "Módulo 8",
      subtitle: "Produtividade e colaboração com IA",
      image: "/images/ai-productivity-premium.jpg", // Updated to new premium gradient image
      duration: "16h",
    },
  ]

  const additionalSections = [
    { name: "Calendário", icon: Calendar, image: "/calendar-icon.png" },
    { name: "Exercícios Extras", icon: BookOpen, image: "/exercises-book-icon.jpg" },
    { name: "Tire Suas Dúvidas Aqui", icon: HelpCircle, image: "/help-support-icon.png" },
    { name: "Pesquisa Institucional", icon: FileText, image: "/institutional-survey-icon.jpg" },
  ]

  const isModuleUnlocked = (moduleId: string) => {
    if (moduleId === "1") return true
    const previousModuleId = String(Number.parseInt(moduleId) - 1)
    return progress[previousModuleId] === 100
  }

  const handleModuleClick = (moduleId: string) => {
    if (!isModuleUnlocked(moduleId)) {
      return
    }

    const currentProgress = progress[moduleId]
    if (currentProgress < 100) {
      const newProgress = Math.min(currentProgress + 25, 100)
      setProgress((prev) => ({
        ...prev,
        [moduleId]: newProgress,
      }))

      // Log progress parameters for debugging
      console.log(`[v0] Module ${moduleId} progress updated with params:`, {
        progress: newProgress,
        autoplay: progressParams.autoplay,
        saveProgress: progressParams.saveProgress,
        trackTime: progressParams.trackTime,
      })
    }
  }

  const allModulesCompleted = Object.values(progress).every((p) => p === 100)

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Section */}
      <section className="bg-gray-200 py-16 md:py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <motion.h2
              className="text-4xl md:text-6xl font-extrabold text-blue-600 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Bem-vindo(a) ao seu espaço de aprendizado, {user.isLoggedIn ? user.name : "Nome do Usuário"}!
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-gray-700 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Aqui você pode acompanhar seu progresso no Programa de Cultura de IA - Sistema FIEC.
            </motion.p>
          </div>
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Image
              src="/images/fiec-ia-logo.png"
              alt="FIEC +IA Logo"
              width={600}
              height={600}
              className="w-full max-w-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.h3
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Programa de Cultura de IA - Sistema FIEC
          </motion.h3>
          <motion.p
            className="text-center text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            16h de conteúdo gravado (online)
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {modules.map((module, index) => {
              const isUnlocked = isModuleUnlocked(module.id)
              const moduleProgress = progress[module.id]
              const isCompleted = moduleProgress === 100

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={isUnlocked ? { y: -8, scale: 1.02 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  className={`relative bg-white p-6 rounded-xl shadow-md transition-all duration-300 ${
                    !isUnlocked ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl cursor-pointer"
                  }`}
                  onClick={() => handleModuleClick(module.id)}
                  style={{ cursor: !isUnlocked ? "not-allowed" : "pointer" }}
                >
                  <div className="absolute top-4 right-4 z-10">
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </motion.div>
                    ) : !isUnlocked ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                        <Image
                          src="/images/padlock-blue.png"
                          alt="Locked"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                          style={{
                            filter:
                              "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)",
                          }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{
                          rotate: [0, 15, -15, 0],
                          transition: { duration: 0.5 },
                        }}
                      >
                        <Image
                          src="/images/padlock-unlocked.png"
                          alt="Unlocked"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                          style={{
                            filter:
                              "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)",
                          }}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Module Image */}
                  <div className="mb-4">
                    <Image
                      src={module.image || "/placeholder.svg"}
                      alt={`Imagem do ${module.title}`}
                      width={400}
                      height={200}
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  </div>

                  <h4
                    className={`text-2xl font-semibold mb-2 text-center transition-colors duration-300 ${
                      isUnlocked ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {module.title}
                  </h4>
                  <p className="text-gray-600 text-center mb-4">{module.subtitle}</p>

                  {/* Progress Section */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 font-medium">{module.duration}</span>
                      <span className={`text-sm font-bold ${isCompleted ? "text-green-600" : "text-blue-600"}`}>
                        {moduleProgress}% Concluído
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          isCompleted ? "bg-green-500" : "bg-blue-600"
                        }`}
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
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Sections */}
      <section className="py-12 px-4 md:px-8 bg-gray-200">
        <div className="container mx-auto max-w-7xl">
          <motion.h3
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Seções Adicionais
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center justify-items-center">
            {additionalSections.map((section, index) => {
              const isLocked = section.name === "Pesquisa Institucional" && !allModulesCompleted

              return (
                <motion.div
                  key={section.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={!isLocked ? { y: -5, scale: 1.05 } : {}}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                  className={`w-full max-w-xs bg-white p-6 rounded-xl shadow-md transition-all duration-300 flex flex-col items-center ${
                    isLocked ? "opacity-60 cursor-not-allowed" : "hover:shadow-2xl cursor-pointer"
                  }`}
                  style={{ cursor: isLocked ? "not-allowed" : "pointer" }}
                >
                  <div className="relative mb-4">
                    <Image
                      src={section.image || "/placeholder.svg"}
                      alt={`Ícone ${section.name}`}
                      width={80}
                      height={80}
                      className="w-16 h-16 rounded-lg"
                    />
                    {isLocked && (
                      <motion.div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                        <Image
                          src="/images/padlock-blue.png"
                          alt="Locked"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                          style={{
                            filter:
                              "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)",
                          }}
                        />
                      </motion.div>
                    )}
                  </div>
                  <span
                    className={`text-lg font-bold transition-colors duration-300 ${
                      isLocked ? "text-gray-400" : "text-blue-600"
                    }`}
                  >
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

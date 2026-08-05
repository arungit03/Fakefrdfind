import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { SiteHeader } from '../components/common/SiteHeader'
import { SiteFooter } from '../components/common/SiteFooter'
import { LoadingScreen } from '../components/common/LoadingScreen'

const LandingPage = lazy(() => import('../pages/LandingPage'))
const CreatorProfilePage = lazy(() => import('../pages/CreatorProfilePage'))
const QuestionBuilderPage = lazy(() => import('../pages/QuestionBuilderPage'))
const QuizReviewPage = lazy(() => import('../pages/QuizReviewPage'))
const SharePage = lazy(() => import('../pages/SharePage'))
const QuizIntroPage = lazy(() => import('../pages/QuizIntroPage'))
const QuizPlayerPage = lazy(() => import('../pages/QuizPlayerPage'))
const ResultPage = lazy(() => import('../pages/ResultPage'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const ResponsesPage = lazy(() => import('../pages/ResponsesPage'))
const ResponseDetailsPage = lazy(() => import('../pages/ResponseDetailsPage'))
const SettingsPage = lazy(() => import('../pages/SettingsPage'))
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'))
const TermsPage = lazy(() => import('../pages/TermsPage'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  )
}

function BareLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>
}

export function AppRouter() {
  const location = useLocation()

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
          <Route path="/create" element={<AppLayout><CreatorProfilePage /></AppLayout>} />
          <Route path="/create/profile" element={<AppLayout><CreatorProfilePage /></AppLayout>} />
          <Route path="/create/questions" element={<AppLayout><QuestionBuilderPage /></AppLayout>} />
          <Route path="/create/review" element={<AppLayout><QuizReviewPage /></AppLayout>} />
          <Route path="/share/:quizId" element={<AppLayout><SharePage /></AppLayout>} />

          <Route path="/quiz/:quizId" element={<BareLayout><QuizIntroPage /></BareLayout>} />
          <Route path="/quiz/:quizId/play" element={<BareLayout><QuizPlayerPage /></BareLayout>} />
          <Route path="/quiz/:quizId/result/:responseId" element={<BareLayout><ResultPage /></BareLayout>} />

          <Route path="/dashboard/:quizId" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/dashboard/:quizId/responses" element={<AppLayout><ResponsesPage /></AppLayout>} />
          <Route path="/dashboard/:quizId/response/:responseId" element={<AppLayout><ResponseDetailsPage /></AppLayout>} />
          <Route path="/dashboard/:quizId/settings" element={<AppLayout><SettingsPage /></AppLayout>} />

          <Route path="/privacy" element={<AppLayout><PrivacyPage /></AppLayout>} />
          <Route path="/terms" element={<AppLayout><TermsPage /></AppLayout>} />
          <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />
          <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
          <Route path="/not-found" element={<AppLayout><NotFoundPage /></AppLayout>} />
          <Route path="*" element={<AppLayout><NotFoundPage /></AppLayout>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

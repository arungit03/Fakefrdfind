import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer } from '../components/common/PageContainer'
import { AppCard } from '../components/common/AppCard'
import { AppInput, AppTextarea } from '../components/common/AppInput'
import { AppButton } from '../components/common/AppButton'
import { contactFormSchema, type ContactFormValues } from '../lib/validators'

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) })

  const onSubmit = async (values: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    void values
    toast.success('Message sent! We\'ll get back to you soon.')
    reset()
  }

  return (
    <PageContainer maxWidth="max-w-xl" className="py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-vibe-gradient text-white">
            <Mail size={24} />
          </div>
          <h1 className="mb-2 text-4xl font-extrabold font-display">Get in Touch</h1>
          <p className="text-slate-500 dark:text-slate-400">Questions, feedback, or a bug to report? We'd love to hear from you.</p>
        </div>

        <AppCard>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <AppInput label="Your name" placeholder="Alex" maxLength={60} {...register('name')} error={errors.name?.message} />
            <AppInput label="Email" type="email" placeholder="alex@example.com" {...register('email')} error={errors.email?.message} />
            <AppTextarea
              label="Message"
              placeholder="Tell us what's on your mind..."
              rows={5}
              maxLength={1000}
              {...register('message')}
              error={errors.message?.message}
            />
            <AppButton type="submit" fullWidth isLoading={isSubmitting} icon={<Send size={16} />}>
              Send Message
            </AppButton>
          </form>
        </AppCard>
      </motion.div>
    </PageContainer>
  )
}

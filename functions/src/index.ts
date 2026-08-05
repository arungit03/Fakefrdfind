import * as admin from 'firebase-admin'

admin.initializeApp()

export { publishQuiz } from './publishQuiz'
export { submitQuizResponse } from './submitQuizResponse'
export { deleteQuizResponse } from './deleteQuizResponse'
export { deleteQuiz } from './deleteQuiz'
export { regenerateQuizLink } from './regenerateQuizLink'
export { exportQuizResponses } from './exportQuizResponses'
export { reportQuiz } from './reportQuiz'
export { getDashboardData } from './getDashboardData'
export { updateQuizSettings } from './updateQuizSettings'

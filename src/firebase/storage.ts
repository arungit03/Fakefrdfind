import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from './config'

export async function uploadCreatorAvatar(uid: string, file: File): Promise<string> {
  const path = `avatars/${uid}/${Date.now()}-${file.name}`
  const storageRef = ref(getFirebaseStorage(), path)
  await uploadBytes(storageRef, file, { contentType: file.type })
  return getDownloadURL(storageRef)
}

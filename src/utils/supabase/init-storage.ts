import { createClient } from '@/utils/supabase/server'

export async function initStorage() {
  const supabase = await createClient()
  
  const { data: buckets } = await supabase.storage.listBuckets()
  
  const requiredBuckets = ['avatars', 'menu-items']
  
  for (const bucketName of requiredBuckets) {
    if (!buckets?.find(b => b.name === bucketName)) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
        fileSizeLimit: 1024 * 1024 * 2 // 2MB
      })
    }
  }
}

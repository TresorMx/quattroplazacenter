import { redirect } from 'next/navigation';

// Root redirect to default locale
export default function Root() {
  redirect('/');
}

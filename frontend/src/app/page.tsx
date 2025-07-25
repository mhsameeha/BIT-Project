
import { redirect } from 'next/navigation';

export default function Page(): never {
    // const AuthClient = authClient.getBasicUserInfo()
  
//   if (!session?.user) {
//     redirect('/auth/sign-in');
//   }

//   // Get user role from session
//   const userRole = session.user.role?.toLowerCase();

//   // Redirect based on role
//   switch (userRole) {
//     case 'tutor':
//       redirect('/tutor-dashboard');
//     case 'admin':
//       redirect('/admin-dashboard');
//     case 'learner':
//     default:
//       redirect('/learner-dashboard');
  //  }
  
  redirect('/dashboard');
}

// export default async function Page(): Promise<never> {
//   const session = await auth();
  
//   if (!session?.user) {
//     redirect('/auth/sign-in');
//   }

//   // Get user role from session
//   const userRole = session.user.role?.toLowerCase();

//   // Redirect based on role
//   switch (userRole) {
//     case 'tutor':
//       redirect('/tutor-dashboard');
//     case 'admin':
//       redirect('/admin-dashboard');
//     case 'learner':
//     default:
//       redirect('/learner-dashboard');
  //  }
// }

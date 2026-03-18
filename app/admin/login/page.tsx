import { redirect } from 'next/navigation'

// TODO: Supabase Auth integráció
export default function AdminLogin() {
  // Ha már be van jelentkezve, irányítsd át az admin főoldalra
  // if (isLoggedIn) redirect('/admin')

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin bejelentkezés</h1>
      <form className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <label>
          Email
          <input type="email" name="email" className="mt-1 w-full border rounded px-3 py-2" required />
        </label>
        <button type="submit" className="bg-blue-900 text-white font-semibold px-6 py-2 rounded hover:bg-blue-800 transition">Bejelentkezés</button>
      </form>
      <p className="text-xs text-gray-400 mt-4 text-center">A bejelentkezéshez Supabase Auth lesz használva.</p>
    </main>
  )
}

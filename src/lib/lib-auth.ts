import { createClient } from "./supabase/client";

// login
export async function Login(email: string, password: string){
    const supabase = createClient()
    const {error} = await supabase.auth.signInWithPassword({email, password})

    if (error?.message === "Invalid login credentials") {
        return {error: "Email ou Senha inválidos"}
    }

    return {error: error?.message}
}

// signup
export async function Signup(name: string, company: string, password: string, email: string, whatsapp: string) {
    const supabase = createClient()
    const {error} = await supabase.auth.signUp({
        email,
        password,
        options:{
            data: {
                signup_type: 'admin',
                name,
                company,
                whatsapp
            }
        }
    })
    return {error}
}

// logout
export async function Logout(){
    const supabase = createClient()
    const {error} = await supabase.auth.signOut()
    return {error}
}

// set password (invited collaborator)
export async function SetPassword(password: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    return { error: error?.message }
}

// invite new user
export async function InviteNewUser(name: string, email: string, area_id: string) {
    const supabase = createClient()
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) throw new Error('Not authenticated')
  
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/invite-collaborator`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ name, email, role: 'collaborator', area_id })
      }
    )
  
    const data = await response.json()
  
    if (!response.ok) throw new Error(data.error)
  
    return data
  }
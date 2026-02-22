import React from 'react'

function page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const handleSignin = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(email, password)
    }
    return (
        <div>
            <div>signin</div>
            <form action="" onSubmit={handleSignin}>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">signin</button>
            </form>
        </div>
    )
}

export default page